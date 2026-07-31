import unittest
from pathlib import Path

from fantasy_calculator.config import read_json


class SchemaTest(unittest.TestCase):
    def test_rules_have_role_slots_and_stats(self):
        rules = read_json(Path("config/fantasy_rules.json"))
        self.assertEqual(rules["schema_version"], 1)
        self.assertGreaterEqual(len(rules["roles"]), 3)
        for role in rules["roles"]:
            self.assertIn(role["selection"], {"team_duo", "team_player", "player"})
            self.assertGreaterEqual(len(role["role_numbers"]), 1)
            self.assertEqual(len(role["slot_colors"]), 3)
            self.assertEqual(len(role["default_slots"]), 3)
            for slot in role["default_slots"]:
                self.assertIn(slot["stat"], rules["stats"])
                self.assertIn("percent", slot)
        self.assertIn("crimson", rules["title_prefixes"])
        self.assertIn("lucky", rules["title_suffixes"])
        self.assertIn("lotuses_grabbed", rules["stats"])

    def test_tournaments_include_disabled_ti_main(self):
        tournaments = read_json(Path("config/tournaments_2026.json"))
        by_id = {item["id"]: item for item in tournaments}
        self.assertFalse(by_id[19719]["enabled_by_default"])
        self.assertNotIn(19268, by_id)
        for tournament in tournaments:
            if tournament["kind"] == "qualifier":
                self.assertFalse(tournament["enabled_by_default"])

    def test_roster_config_has_ti_participants(self):
        rosters = read_json(Path("config/teams_2026.json"))
        self.assertEqual(rosters["schema_version"], 1)
        self.assertEqual(len(rosters["teams"]), 16)
        for team in rosters["teams"]:
            self.assertEqual(len(team["players"]), 5)


if __name__ == "__main__":
    unittest.main()
