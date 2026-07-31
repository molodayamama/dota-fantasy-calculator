from __future__ import annotations

import argparse
import os
import re
from collections import Counter, defaultdict
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from .clients import ApiError, OpenDotaClient, StratzClient
from .config import (
    DEFAULT_RAW_CACHE_DIR,
    DEFAULT_RULES_PATH,
    DEFAULT_SNAPSHOT_PATH,
    DEFAULT_TEAMS_PATH,
    DEFAULT_TOURNAMENTS_PATH,
    load_dotenv,
    read_json,
    write_json,
)


GLOBAL_SUBTITLES = (
    "total_deaths_from_torm",
    "firstblood_after_10min",
    "firstblood_before_horn",
    "games<25min",
    "duration_ends_8",
    "last_possible_match",
    "fountain_kill",
)


def _as_number(value: Any, default: float = 0.0) -> float:
    if value is None:
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _first_present(payload: dict[str, Any], *keys: str, default: Any = None) -> Any:
    for key in keys:
        value = payload.get(key)
        if value not in (None, ""):
            return value
    return default


def _display_name(player: dict[str, Any]) -> str:
    explicit = _first_present(player, "name", "personaname")
    if explicit:
        return str(explicit)
    account_id = player.get("account_id")
    if account_id:
        return f"Player {account_id}"
    slot = player.get("player_slot", "?")
    return f"Unknown slot {slot}"


def _normalize_name(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "", str(value or "").casefold())


def _roster_player_id(team_name: str, player: dict[str, Any]) -> str:
    account_id = player.get("account_id")
    if account_id:
        return str(account_id)
    return f"roster:{_normalize_name(team_name)}:{_normalize_name(player.get('nick'))}"


def _build_roster_index(team_rosters: dict[str, Any] | None) -> dict[str, dict[str, Any]]:
    index: dict[str, dict[str, Any]] = {}
    if not team_rosters:
        return index

    for team in team_rosters.get("teams", []) or []:
        team_name = str(team.get("name") or "")
        for player in team.get("players", []) or []:
            record = {**player, "team_name": team_name}
            names = [player.get("nick"), *(player.get("aliases") or [])]
            for name in names:
                key = _normalize_name(name)
                if key:
                    index[key] = record
    return index


def _roster_team_ids(team_rosters: dict[str, Any] | None) -> set[int]:
    team_ids: set[int] = set()
    if not team_rosters:
        return team_ids
    for team in team_rosters.get("teams", []) or []:
        for team_id in team.get("team_ids", []) or []:
            try:
                team_ids.add(int(team_id))
            except (TypeError, ValueError):
                continue
    return team_ids


def _find_roster_player(player: dict[str, Any], roster_index: dict[str, dict[str, Any]]) -> dict[str, Any] | None:
    if not roster_index:
        return None
    names = [_display_name(player), player.get("personaname"), player.get("name")]
    for name in names:
        key = _normalize_name(name)
        if key and key in roster_index:
            return roster_index[key]
    return None


def _player_id(player: dict[str, Any], match_id: int) -> str:
    account_id = player.get("account_id")
    if account_id:
        return str(account_id)
    return f"anon:{match_id}:{player.get('player_slot', 'slot')}"


def _is_radiant(player: dict[str, Any]) -> bool:
    if "isRadiant" in player:
        return bool(player["isRadiant"])
    return int(player.get("player_slot", 0)) < 128


def _team_number(player: dict[str, Any]) -> int:
    if "team_number" in player:
        return int(player["team_number"])
    return 0 if _is_radiant(player) else 1


def infer_role(player: dict[str, Any], rules: dict[str, Any]) -> str:
    account_id = player.get("account_id")
    name = _display_name(player).lower()
    overrides = rules.get("role_overrides", {})

    if account_id and str(account_id) in overrides.get("accounts", {}):
        return overrides["accounts"][str(account_id)]
    if name in overrides.get("names", {}):
        return overrides["names"][name]

    lane_role = int(player.get("lane_role") or 0)
    last_hits = _as_number(player.get("last_hits"))
    gpm = _as_number(player.get("gold_per_min"))
    wards = _as_number(player.get("obs_placed")) + _as_number(player.get("sen_placed"))
    stacks = _as_number(player.get("camps_stacked"))
    smokes = _as_number(player.get("item_uses", {}).get("smoke_of_deceit") if isinstance(player.get("item_uses"), dict) else 0)

    if lane_role == 2:
        return "mid"
    if wards >= 4 or stacks >= 3 or smokes >= 2:
        return "support"
    if lane_role in (1, 3) and (last_hits >= 120 or gpm >= 430):
        return "core"
    if lane_role in (4, 5):
        return "support"
    return "core"


def _add_stat(league_data: dict[str, Any], stat_id: str, value: Any) -> None:
    aggregate = league_data["stats"].setdefault(stat_id, {"sum": 0.0, "count": 0})
    aggregate["sum"] += _as_number(value)
    aggregate["count"] += 1


def _increment(mapping: dict[str, int], key: str, amount: int = 1) -> None:
    mapping[key] = int(mapping.get(key, 0)) + amount


def _hero_primary_attr(hero_id: int, heroes: dict[int, dict[str, Any]]) -> str | None:
    attr = heroes.get(int(hero_id), {}).get("primary_attr")
    if attr == "universal":
        return "all"
    return attr


def _stratz_hero_levels(supplement: dict[str, Any] | None) -> dict[int, int]:
    if not supplement:
        return {}
    levels: dict[int, int] = {}
    for player in supplement.get("players", []) or []:
        hero_id = player.get("heroId")
        if hero_id is None:
            continue
        levels[int(hero_id)] = int((player.get("dotaPlus") or {}).get("level") or 0)
    return levels


def _first_blood_time(match_detail: dict[str, Any], supplement: dict[str, Any] | None) -> int | None:
    if supplement and supplement.get("firstBloodTime") is not None:
        return int(supplement["firstBloodTime"])
    if match_detail.get("first_blood_time") is not None:
        return int(match_detail["first_blood_time"])
    return None


def _picked_first_or_last(hero_id: int, team_number: int, picks_bans: list[dict[str, Any]], *, last: bool = False) -> bool:
    picks = [pick for pick in picks_bans or [] if pick.get("is_pick")]
    if not picks:
        return False
    selected = picks[-1] if last else picks[0]
    return int(selected.get("hero_id", -1)) == int(hero_id) and int(selected.get("team", team_number)) == int(team_number)


def _count_active_items(player: dict[str, Any], active_item_ids: set[int]) -> int:
    count = 0
    for index in range(6):
        item = player.get(f"item_{index}")
        if item in active_item_ids:
            count += 1
    return count


def _has_nine_slots(player: dict[str, Any]) -> bool:
    item_slots = [player.get(f"item_{index}") for index in range(6)]
    backpack_slots = [player.get(f"backpack_{index}") for index in range(3)]
    return all(item_slots) and all(backpack_slots)


def _lost_game(player: dict[str, Any], match_detail: dict[str, Any]) -> bool:
    if "lose" in player:
        return bool(player["lose"])
    radiant_win = bool(match_detail.get("radiant_win"))
    return radiant_win != _is_radiant(player)


def aggregate_matches(
    *,
    year: int,
    tournaments: list[dict[str, Any]],
    league_matches: dict[str, list[dict[str, Any]]],
    match_details: dict[str, dict[str, Any]],
    heroes: dict[int, dict[str, Any]],
    rules: dict[str, Any],
    team_rosters: dict[str, Any] | None = None,
    stratz_supplements: dict[str, dict[str, Any] | None] | None = None,
    stratz_used: bool = False,
) -> dict[str, Any]:
    players: dict[str, dict[str, Any]] = {}
    active_item_ids = {int(item_id) for item_id in rules.get("active_item_ids", [])}
    hero_tag_groups = {
        tag: {int(hero_id) for hero_id in hero_ids}
        for tag, hero_ids in rules.get("hero_tag_groups", {}).items()
    }
    roster_index = _build_roster_index(team_rosters)
    stratz_supplements = stratz_supplements or {}

    tournament_output: list[dict[str, Any]] = []

    for tournament in tournaments:
        tournament_id = str(tournament["id"])
        summaries = league_matches.get(tournament_id, [])
        parsed_match_ids = [str(summary["match_id"]) for summary in summaries if str(summary.get("match_id")) in match_details]
        global_counts = {key: 0 for key in GLOBAL_SUBTITLES}
        series_matches: dict[int, list[dict[str, Any]]] = defaultdict(list)
        for match_id in parsed_match_ids:
            match_detail = match_details[match_id]
            series_id = match_detail.get("series_id")
            if series_id:
                series_matches[int(series_id)].append(match_detail)
        last_possible_match_ids: set[str] = set()
        for matches_in_series in series_matches.values():
            series_type = int(matches_in_series[0].get("series_type") or 0)
            max_games = {1: 3, 2: 5}.get(series_type)
            if not max_games or len(matches_in_series) < max_games:
                continue
            last_match = max(matches_in_series, key=lambda item: int(item.get("start_time") or 0))
            last_possible_match_ids.add(str(last_match.get("match_id")))
        first_starts: list[int] = []
        last_starts: list[int] = []

        for match_id in parsed_match_ids:
            match_detail = match_details[match_id]
            supplement = stratz_supplements.get(match_id)
            hero_levels = _stratz_hero_levels(supplement)
            players_in_match = match_detail.get("players", []) or []
            if not players_in_match:
                continue

            start_time = match_detail.get("start_time")
            if start_time:
                first_starts.append(int(start_time))
                last_starts.append(int(start_time))

            first_blood = _first_blood_time(match_detail, supplement)
            if first_blood is not None:
                if first_blood > 600:
                    global_counts["firstblood_after_10min"] += 1
                if first_blood < 0:
                    global_counts["firstblood_before_horn"] += 1
            duration = int(match_detail.get("duration") or 0)
            if duration < 1500:
                global_counts["games<25min"] += 1
            if duration % 10 == 8:
                global_counts["duration_ends_8"] += 1
            if match_id in last_possible_match_ids:
                global_counts["last_possible_match"] += 1
            if any((player.get("killed_by") or {}).get("npc_dota_miniboss", 0) for player in players_in_match if isinstance(player.get("killed_by"), dict)):
                global_counts["total_deaths_from_torm"] += 1

            max_assists = max(_as_number(player.get("assists")) for player in players_in_match)
            max_deaths = max(_as_number(player.get("deaths")) for player in players_in_match)
            min_networth = min(_as_number(player.get("net_worth")) for player in players_in_match)
            chat_counts = Counter(event.get("player_slot") for event in match_detail.get("chat", []) or [] if event.get("type") == "chatwheel")
            max_chat_count = max(chat_counts.values(), default=0)
            top_chat_slots = {slot for slot, count in chat_counts.items() if count == max_chat_count and max_chat_count > 0}

            for player in players_in_match:
                hero_id = int(player.get("hero_id") or 0)
                if not hero_id:
                    continue

                roster_player = _find_roster_player(player, roster_index)
                if roster_index and not roster_player:
                    continue

                if roster_player:
                    player_id = _roster_player_id(roster_player["team_name"], roster_player)
                    role = str(roster_player.get("role") or infer_role(player, rules))
                    display_name = str(roster_player.get("nick") or _display_name(player))
                    team_name = str(roster_player.get("team_name") or "")
                else:
                    player_id = _player_id(player, int(match_id))
                    role = infer_role(player, rules)
                    display_name = _display_name(player)
                    team_name = match_detail.get("radiant_name") if _is_radiant(player) else match_detail.get("dire_name")

                record = players.setdefault(
                    player_id,
                    {
                        "id": player_id,
                        "name": display_name,
                        "role": role,
                        "team_name": team_name or "",
                        "team_logo": None,
                        "matches": 0,
                        "per_tournament": {},
                        "_role_counts": {},
                    },
                )
                record["name"] = display_name
                record["team_name"] = team_name or record.get("team_name", "")
                record["_role_counts"][role] = int(record["_role_counts"].get(role, 0)) + 1
                record["role"] = max(record["_role_counts"], key=record["_role_counts"].get)
                record["matches"] += 1

                league_data = record["per_tournament"].setdefault(
                    tournament_id,
                    {
                        "matches": 0,
                        "stats": {},
                        "title_counts": {},
                        "subtitle_counts": {},
                    },
                )
                league_data["matches"] += 1

                _add_stat(league_data, "kills", player.get("kills"))
                _add_stat(league_data, "deaths", player.get("deaths"))
                _add_stat(league_data, "creep_score", _as_number(player.get("last_hits")) + _as_number(player.get("denies")))
                _add_stat(league_data, "gpm", player.get("gold_per_min"))
                _add_stat(league_data, "madstone_collected", (player.get("item_uses") or {}).get("madstone_bundle", 0) if isinstance(player.get("item_uses"), dict) else 0)
                _add_stat(league_data, "tower_kills", player.get("towers_killed"))
                _add_stat(league_data, "obs_placed", player.get("obs_placed"))
                _add_stat(league_data, "camps_stacked", player.get("camps_stacked"))
                _add_stat(league_data, "runes_grabbed", player.get("rune_pickups"))
                _add_stat(league_data, "watchers_taken", (player.get("ability_uses") or {}).get("ability_lamp_use", 0) if isinstance(player.get("ability_uses"), dict) else 0)
                _add_stat(league_data, "lotuses_grabbed", sum((player.get("item_uses") or {}).get(item, 0) for item in ("famango", "great_famango", "greater_famango")) if isinstance(player.get("item_uses"), dict) else 0)
                _add_stat(league_data, "smokes_used", (player.get("item_uses") or {}).get("smoke_of_deceit", 0) if isinstance(player.get("item_uses"), dict) else 0)
                _add_stat(league_data, "roshan_kills", player.get("roshans_killed"))
                _add_stat(league_data, "teamfight_participation", player.get("teamfight_participation"))
                _add_stat(league_data, "stuns", player.get("stuns"))
                _add_stat(league_data, "tormentor_kills", (player.get("killed") or {}).get("npc_dota_miniboss", 0) if isinstance(player.get("killed"), dict) else 0)
                _add_stat(league_data, "courier_kills", player.get("courier_kills"))
                _add_stat(league_data, "firstblood", player.get("firstblood_claimed"))

                attr = _hero_primary_attr(hero_id, heroes)
                if attr in ("str", "agi", "int", "all"):
                    _increment(league_data["title_counts"], attr)
                for tag, hero_ids in hero_tag_groups.items():
                    if hero_id in hero_ids:
                        _increment(league_data["title_counts"], tag)
                if _picked_first_or_last(hero_id, _team_number(player), match_detail.get("picks_bans") or []):
                    _increment(league_data["title_counts"], "first_pick")
                if _picked_first_or_last(hero_id, _team_number(player), match_detail.get("picks_bans") or [], last=True):
                    _increment(league_data["title_counts"], "last_pick")
                if any(cosmetic.get("item_rarity") == "arcana" for cosmetic in player.get("cosmetics", []) or [] if isinstance(cosmetic, dict)):
                    _increment(league_data["title_counts"], "games_with_arcana")
                if hero_levels.get(hero_id, 0) >= 25:
                    _increment(league_data["title_counts"], "games_with_hero_master")

                if _as_number(player.get("kills")) == 0:
                    _increment(league_data["subtitle_counts"], "0_kills")
                if _as_number(player.get("net_worth")) == min_networth:
                    _increment(league_data["subtitle_counts"], "lowest_networth")
                if player.get("buyback_log") and player["buyback_log"][0].get("time", 999999) < 1800:
                    _increment(league_data["subtitle_counts"], "bbs_before_30min")
                if _as_number(player.get("deaths")) == max_deaths:
                    _increment(league_data["subtitle_counts"], "most_deaths")
                if _count_active_items(player, active_item_ids) >= 4:
                    _increment(league_data["subtitle_counts"], "4+_active_items")
                if _as_number(player.get("assists")) == max_assists:
                    _increment(league_data["subtitle_counts"], "most_assists")
                if _has_nine_slots(player):
                    _increment(league_data["subtitle_counts"], "9_slots")
                if _lost_game(player, match_detail):
                    _increment(league_data["subtitle_counts"], "lost_games")
                if player.get("player_slot") in top_chat_slots:
                    _increment(league_data["subtitle_counts"], "most_voice_lines")

        parsed_count = len(parsed_match_ids)
        first_match = datetime.fromtimestamp(min(first_starts), UTC).date().isoformat() if first_starts else None
        last_match = datetime.fromtimestamp(max(last_starts), UTC).date().isoformat() if last_starts else None
        tournament_output.append(
            {
                **tournament,
                "id": int(tournament["id"]),
                "match_count": parsed_count,
                "first_match": first_match,
                "last_match": last_match,
                "global_subtitle_counts": global_counts,
            }
        )

    output_players = []
    if team_rosters:
        for team in team_rosters.get("teams", []) or []:
            team_name = str(team.get("name") or "")
            for roster_player in team.get("players", []) or []:
                player_id = _roster_player_id(team_name, roster_player)
                players.setdefault(
                    player_id,
                    {
                        "id": player_id,
                        "name": str(roster_player.get("nick") or "Unknown"),
                        "role": str(roster_player.get("role") or "core"),
                        "team_name": team_name,
                        "team_logo": None,
                        "matches": 0,
                        "per_tournament": {},
                        "_role_counts": {},
                    },
                )

    for player in players.values():
        player.pop("_role_counts", None)
        output_players.append(player)

    tournament_output.sort(key=lambda item: item.get("last_match") or "", reverse=True)
    output_players.sort(key=lambda item: item["name"].lower())

    return {
        "schema_version": 1,
        "year": year,
        "generated_at": datetime.now(UTC).isoformat(),
        "source": {
            "open_dota": "https://api.opendota.com/api",
            "stratz": "https://api.stratz.com/graphql",
            "stratz_used": stratz_used,
        },
        "tournaments": tournament_output,
        "players": output_players,
    }


def refresh_snapshot(args: argparse.Namespace) -> dict[str, Any]:
    load_dotenv()
    rules = read_json(args.rules)
    team_rosters = read_json(args.teams) if args.teams and args.teams.exists() else None
    roster_team_ids = _roster_team_ids(team_rosters)
    tournaments = [item for item in read_json(args.tournaments) if args.include_upcoming or item.get("kind") != "upcoming"]
    open_dota = OpenDotaClient(args.cache_dir, use_cache=not args.no_cache, sleep_seconds=args.sleep)
    stratz = StratzClient(os.getenv("STRATZ_TOKEN"), args.cache_dir, use_cache=not args.no_cache, sleep_seconds=args.sleep)

    warnings: list[str] = []
    try:
        heroes = {int(hero["id"]): hero for hero in open_dota.get_heroes()}
    except ApiError as exc:
        heroes = {}
        warnings.append(f"OpenDota heroes failed: {exc}")
    league_matches: dict[str, list[dict[str, Any]]] = {}
    match_details: dict[str, dict[str, Any]] = {}
    supplements: dict[str, dict[str, Any] | None] = {}

    for tournament in tournaments:
        league_id = int(tournament["id"])
        try:
            matches = open_dota.get_league_matches(league_id)
        except ApiError as exc:
            warnings.append(f"League {league_id} failed: {exc}")
            league_matches[str(league_id)] = []
            continue

        matches = sorted(matches, key=lambda match: int(match.get("start_time") or match.get("match_id") or 0), reverse=True)
        if roster_team_ids and not args.all_league_matches:
            matches = [
                match
                for match in matches
                if int(match.get("radiant_team_id") or 0) in roster_team_ids
                or int(match.get("dire_team_id") or 0) in roster_team_ids
            ]
        if args.limit_matches_per_tournament is not None:
            matches = matches[: args.limit_matches_per_tournament]
        league_matches[str(league_id)] = matches

        for summary in matches:
            match_id = int(summary["match_id"])
            key = str(match_id)
            try:
                match_details[key] = open_dota.get_match(match_id)
            except ApiError as exc:
                warnings.append(f"Match {match_id} failed: {exc}")
                continue
            supplements[key] = stratz.get_match_supplement(match_id)

    snapshot = aggregate_matches(
        year=args.year,
        tournaments=tournaments,
        league_matches=league_matches,
        match_details=match_details,
        heroes=heroes,
        rules=rules,
        team_rosters=team_rosters,
        stratz_supplements=supplements,
        stratz_used=stratz.enabled,
    )
    snapshot["warnings"] = warnings
    write_json(args.output, snapshot)
    return snapshot


def add_refresh_parser(subparsers: argparse._SubParsersAction[argparse.ArgumentParser]) -> None:
    parser = subparsers.add_parser("refresh", help="Fetch OpenDota/STRATZ data and generate fantasy_snapshot.json")
    parser.add_argument("--year", type=int, default=2026)
    parser.add_argument("--rules", type=Path, default=DEFAULT_RULES_PATH)
    parser.add_argument("--tournaments", type=Path, default=DEFAULT_TOURNAMENTS_PATH)
    parser.add_argument("--teams", type=Path, default=DEFAULT_TEAMS_PATH, help="Optional roster filter for current fantasy participants.")
    parser.add_argument("--all-league-matches", action="store_true", help="Fetch every match in each configured league instead of prefiltering by roster team ids.")
    parser.add_argument("--output", type=Path, default=DEFAULT_SNAPSHOT_PATH)
    parser.add_argument("--cache-dir", type=Path, default=DEFAULT_RAW_CACHE_DIR)
    parser.add_argument("--limit-matches-per-tournament", type=int, default=None)
    parser.add_argument("--sleep", type=float, default=1.1, help="Seconds to wait before uncached API calls.")
    parser.add_argument("--no-cache", action="store_true")
    parser.add_argument("--include-upcoming", action="store_true")
    parser.set_defaults(func=refresh_snapshot)
