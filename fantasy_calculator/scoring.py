from __future__ import annotations

from typing import Any, Iterable


def percent_to_multiplier(value: float | int | str | None) -> float:
    if value in (None, ""):
        return 1.0
    numeric = float(value)
    return numeric / 100


def stat_average(player: dict[str, Any], stat_id: str, selected_tournaments: Iterable[int | str]) -> float:
    total = 0.0
    count = 0
    per_tournament = player.get("per_tournament", {})

    for tournament_id in map(str, selected_tournaments):
        tournament_stats = per_tournament.get(tournament_id, {}).get("stats", {})
        aggregate = tournament_stats.get(stat_id)
        if not aggregate:
            continue
        total += float(aggregate.get("sum", 0))
        count += int(aggregate.get("count", 0))

    if count == 0:
        return 0.0
    return total / count


def title_bonus_percent(player: dict[str, Any], title_id: str | None, rules: dict[str, Any], selected_tournaments: Iterable[int | str]) -> float:
    if not title_id:
        return 0.0

    title = rules.get("titles", {}).get(title_id)
    if not title:
        return 0.0

    per_tournament = player.get("per_tournament", {})
    title_percent = float(title.get("percent", 0))
    league_percentages: list[float] = []

    for tournament_id in map(str, selected_tournaments):
        league_data = per_tournament.get(tournament_id)
        if not league_data:
            continue
        matches = int(league_data.get("matches", 0))
        if matches <= 0:
            continue
        count = int(league_data.get("title_counts", {}).get(title_id, 0))
        league_percentages.append(title_percent * count / matches)

    if not league_percentages:
        return 0.0
    return sum(league_percentages) / len(league_percentages)


def _tournament_lookup(tournaments: Iterable[dict[str, Any]] | None) -> dict[str, dict[str, Any]]:
    return {str(tournament.get("id")): tournament for tournament in tournaments or []}


def _title_rule_bonus_percent(
    player: dict[str, Any],
    rule: dict[str, Any] | None,
    selected_tournaments: Iterable[int | str],
    tournaments: Iterable[dict[str, Any]] | None = None,
) -> float:
    if not rule:
        return 0.0

    condition = rule.get("condition")
    if not condition:
        return 0.0

    tournament_by_id = _tournament_lookup(tournaments)
    per_tournament = player.get("per_tournament", {})
    title_percent = float(rule.get("percent", 0))
    league_percentages: list[float] = []

    for tournament_id in map(str, selected_tournaments):
        league_data = per_tournament.get(tournament_id)
        if not league_data:
            continue
        tournament = tournament_by_id.get(tournament_id, {})
        scope = rule.get("scope")

        if scope == "global_subtitle":
            matches = int(tournament.get("match_count") or league_data.get("matches", 0))
            count = int(tournament.get("global_subtitle_counts", {}).get(condition, 0))
        else:
            matches = int(league_data.get("matches", 0))
            bucket = "subtitle_counts" if scope == "player_subtitle" else "title_counts"
            count = int(league_data.get(bucket, {}).get(condition, 0))

        if matches <= 0:
            continue
        league_percentages.append(title_percent * count / matches)

    if not league_percentages:
        return 0.0
    return sum(league_percentages) / len(league_percentages)


def combined_title_bonus_percent(
    player: dict[str, Any],
    prefix_id: str | None,
    suffix_id: str | None,
    rules: dict[str, Any],
    selected_tournaments: Iterable[int | str],
    tournaments: Iterable[dict[str, Any]] | None = None,
) -> float:
    prefix = rules.get("title_prefixes", {}).get(prefix_id or "")
    suffix = rules.get("title_suffixes", {}).get(suffix_id or "")
    return _title_rule_bonus_percent(player, prefix, selected_tournaments, tournaments) + _title_rule_bonus_percent(player, suffix, selected_tournaments, tournaments)


def score_slot(player: dict[str, Any], stat_id: str | None, percent: float | int | str | None, rules: dict[str, Any], selected_tournaments: Iterable[int | str]) -> float:
    if not stat_id:
        return 0.0

    stat_rule = rules.get("stats", {}).get(stat_id)
    if not stat_rule:
        return 0.0

    average = stat_average(player, stat_id, selected_tournaments)
    coefficient = percent_to_multiplier(percent)
    factor = float(stat_rule.get("factor", 1))

    if stat_rule.get("scoring") == "inverse":
        base = float(stat_rule.get("base", 1800))
        return max(0.0, base - average * factor) * coefficient

    raw_score = average * factor
    if stat_rule.get("cap") is not None:
        raw_score = min(raw_score, float(stat_rule["cap"]))
    return raw_score * coefficient


def score_player(
    player: dict[str, Any],
    slots: list[dict[str, Any]],
    title_id: str | None,
    rules: dict[str, Any],
    selected_tournaments: Iterable[int | str],
    *,
    prefix_id: str | None = None,
    suffix_id: str | None = None,
    tournaments: Iterable[dict[str, Any]] | None = None,
) -> float:
    selected_ids = list(map(str, selected_tournaments))
    subtotal = sum(score_slot(player, slot.get("stat"), slot.get("percent", 100), rules, selected_ids) for slot in slots)
    if prefix_id or suffix_id:
        bonus = combined_title_bonus_percent(player, prefix_id, suffix_id, rules, selected_ids, tournaments)
    else:
        bonus = title_bonus_percent(player, title_id, rules, selected_ids)
    return round(subtotal + subtotal * bonus / 100, 2)
