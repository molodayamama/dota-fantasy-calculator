import unittest

from fantasy_calculator.refresh import aggregate_matches


class RefreshParserTest(unittest.TestCase):
    def test_aggregate_one_match_with_missing_names_and_missing_stratz(self):
        rules = {
            "active_item_ids": [50, 100, 150, 200],
            "hero_tag_groups": {"green": [1]},
            "role_overrides": {"accounts": {}, "names": {}},
        }
        tournaments = [{"id": 1, "name": "Fixture Cup", "short_name": "Fixture", "kind": "main", "enabled_by_default": True}]
        league_matches = {"1": [{"match_id": 42, "start_time": 1780000000}]}
        match_details = {
            "42": {
                "match_id": 42,
                "start_time": 1780000000,
                "duration": 1400,
                "radiant_win": True,
                "radiant_name": "Radiant Test",
                "dire_name": "Dire Test",
                "first_blood_time": 700,
                "picks_bans": [
                    {"is_pick": True, "hero_id": 1, "team": 0},
                    {"is_pick": True, "hero_id": 2, "team": 1},
                ],
                "players": [
                    {
                        "account_id": 101,
                        "name": "Carry",
                        "player_slot": 0,
                        "hero_id": 1,
                        "lane_role": 1,
                        "kills": 10,
                        "deaths": 1,
                        "assists": 5,
                        "last_hits": 220,
                        "denies": 12,
                        "gold_per_min": 650,
                        "towers_killed": 2,
                        "obs_placed": 0,
                        "sen_placed": 0,
                        "camps_stacked": 0,
                        "rune_pickups": 4,
                        "roshans_killed": 1,
                        "teamfight_participation": 0.5,
                        "stuns": 12,
                        "courier_kills": 0,
                        "firstblood_claimed": 1,
                        "net_worth": 30000,
                        "item_uses": {"smoke_of_deceit": 0},
                        "ability_uses": {},
                        "killed": {},
                        "killed_by": {},
                    },
                    {
                        "account_id": 102,
                        "player_slot": 128,
                        "hero_id": 2,
                        "lane_role": 5,
                        "kills": 0,
                        "deaths": 8,
                        "assists": 20,
                        "last_hits": 20,
                        "denies": 1,
                        "gold_per_min": 280,
                        "towers_killed": 0,
                        "obs_placed": 8,
                        "sen_placed": 12,
                        "camps_stacked": 5,
                        "rune_pickups": 2,
                        "roshans_killed": 0,
                        "teamfight_participation": 0.7,
                        "stuns": 60,
                        "courier_kills": 1,
                        "firstblood_claimed": 0,
                        "net_worth": 8000,
                        "item_uses": {"smoke_of_deceit": 3},
                        "ability_uses": {"ability_lamp_use": 2},
                        "killed": {},
                        "killed_by": {"npc_dota_miniboss": 1},
                    },
                ],
            }
        }
        heroes = {1: {"primary_attr": "str"}, 2: {"primary_attr": "int"}}

        snapshot = aggregate_matches(
            year=2026,
            tournaments=tournaments,
            league_matches=league_matches,
            match_details=match_details,
            heroes=heroes,
            rules=rules,
            stratz_supplements={},
            stratz_used=False,
        )

        self.assertEqual(snapshot["tournaments"][0]["match_count"], 1)
        self.assertEqual(snapshot["tournaments"][0]["global_subtitle_counts"]["games<25min"], 1)
        self.assertEqual(snapshot["tournaments"][0]["global_subtitle_counts"]["total_deaths_from_torm"], 1)
        self.assertEqual(snapshot["tournaments"][0]["global_subtitle_counts"]["firstblood_after_10min"], 1)
        self.assertEqual(len(snapshot["players"]), 2)
        support = next(player for player in snapshot["players"] if player["id"] == "102")
        self.assertEqual(support["name"], "Player 102")
        self.assertEqual(support["role"], "support")

    def test_roster_filter_controls_names_and_roles(self):
        rules = {
            "active_item_ids": [],
            "hero_tag_groups": {},
            "role_overrides": {"accounts": {}, "names": {}},
        }
        rosters = {
            "teams": [
                {
                    "name": "Roster Team",
                    "players": [
                        {"nick": "Carry", "role": "mid", "aliases": ["CarryAlias"]},
                    ],
                }
            ]
        }
        tournaments = [{"id": 1, "name": "Fixture Cup", "short_name": "Fixture", "kind": "main", "enabled_by_default": True}]
        league_matches = {"1": [{"match_id": 42, "start_time": 1780000000}]}
        match_details = {
            "42": {
                "match_id": 42,
                "start_time": 1780000000,
                "duration": 1600,
                "radiant_win": True,
                "radiant_name": "Wrong API Team",
                "dire_name": "Dire Test",
                "players": [
                    {
                        "account_id": 101,
                        "name": "CarryAlias",
                        "player_slot": 0,
                        "hero_id": 1,
                        "lane_role": 1,
                        "kills": 10,
                        "deaths": 1,
                        "assists": 5,
                        "last_hits": 220,
                        "denies": 12,
                        "gold_per_min": 650,
                        "towers_killed": 2,
                        "obs_placed": 0,
                        "sen_placed": 0,
                        "camps_stacked": 0,
                        "rune_pickups": 4,
                        "roshans_killed": 1,
                        "teamfight_participation": 0.5,
                        "stuns": 12,
                        "courier_kills": 0,
                        "firstblood_claimed": 1,
                        "net_worth": 30000,
                        "item_uses": {},
                        "ability_uses": {},
                        "killed": {},
                        "killed_by": {},
                    },
                    {
                        "account_id": 999,
                        "name": "Extra Player",
                        "player_slot": 128,
                        "hero_id": 2,
                    },
                ],
            }
        }

        snapshot = aggregate_matches(
            year=2026,
            tournaments=tournaments,
            league_matches=league_matches,
            match_details=match_details,
            heroes={1: {"primary_attr": "str"}},
            rules=rules,
            team_rosters=rosters,
        )

        self.assertEqual(len(snapshot["players"]), 1)
        self.assertEqual(snapshot["players"][0]["name"], "Carry")
        self.assertEqual(snapshot["players"][0]["role"], "mid")
        self.assertEqual(snapshot["players"][0]["team_name"], "Roster Team")


if __name__ == "__main__":
    unittest.main()
