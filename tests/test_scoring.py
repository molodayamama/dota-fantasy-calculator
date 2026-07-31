import unittest

from fantasy_calculator.scoring import percent_to_multiplier, score_player


class ScoringTest(unittest.TestCase):
    def setUp(self):
        self.rules = {
            "stats": {
                "kills": {"factor": 100, "scoring": "normal"},
                "deaths": {"factor": 180, "base": 1800, "scoring": "inverse"},
            },
            "titles": {
                "str": {"percent": 20},
            },
            "title_prefixes": {
                "crimson": {"percent": 20, "scope": "player_title", "condition": "red"},
            },
            "title_suffixes": {
                "underdog": {"percent": 10, "scope": "player_subtitle", "condition": "lost_games"},
            },
        }
        self.player = {
            "per_tournament": {
                "1": {
                    "matches": 2,
                    "stats": {
                        "kills": {"sum": 10, "count": 2},
                        "deaths": {"sum": 10, "count": 2},
                    },
                    "title_counts": {"str": 1},
                    "subtitle_counts": {"lost_games": 1},
                },
                "2": {
                    "matches": 2,
                    "stats": {
                        "kills": {"sum": 100, "count": 2},
                        "deaths": {"sum": 2, "count": 2},
                    },
                    "title_counts": {"str": 0},
                    "subtitle_counts": {"lost_games": 0},
                },
            }
        }

    def test_percent_normalization(self):
        self.assertEqual(percent_to_multiplier(250), 2.5)

    def test_normal_stat_with_title_bonus(self):
        score = score_player(self.player, [{"stat": "kills", "percent": 250}], "str", self.rules, ["1"])
        self.assertEqual(score, 1375.0)

    def test_deaths_inverse_formula(self):
        score = score_player(self.player, [{"stat": "deaths", "percent": 100}], None, self.rules, ["1"])
        self.assertEqual(score, 900.0)

    def test_disabled_tournament_is_omitted(self):
        score = score_player(self.player, [{"stat": "kills", "percent": 100}], None, self.rules, ["1"])
        self.assertEqual(score, 500.0)

    def test_prefix_and_suffix_title_multiplier(self):
        player = {
            "per_tournament": {
                "1": {
                    "matches": 2,
                    "stats": {"kills": {"sum": 10, "count": 2}},
                    "title_counts": {"red": 1},
                    "subtitle_counts": {"lost_games": 1},
                }
            }
        }
        score = score_player(
            player,
            [{"stat": "kills", "percent": 100}],
            None,
            self.rules,
            ["1"],
            prefix_id="crimson",
            suffix_id="underdog",
        )
        self.assertEqual(score, 575.0)

    def test_team_entity_scores_sum_role_players(self):
        team = {
            "players": [
                {
                    "per_tournament": {
                        "1": {
                            "matches": 1,
                            "stats": {"kills": {"sum": 5, "count": 1}},
                            "title_counts": {"red": 1},
                            "subtitle_counts": {},
                        }
                    }
                },
                {
                    "per_tournament": {
                        "1": {
                            "matches": 1,
                            "stats": {"kills": {"sum": 7, "count": 1}},
                            "title_counts": {"red": 0},
                            "subtitle_counts": {},
                        }
                    }
                },
            ]
        }
        score = score_player(
            team,
            [{"stat": "kills", "percent": 100}],
            None,
            self.rules,
            ["1"],
            prefix_id="crimson",
        )
        self.assertEqual(score, 1300.0)

    def test_single_player_team_entity_scores_inner_player(self):
        team = {
            "players": [
                {
                    "per_tournament": {
                        "1": {
                            "matches": 1,
                            "stats": {"kills": {"sum": 6, "count": 1}},
                            "title_counts": {},
                            "subtitle_counts": {},
                        }
                    }
                }
            ]
        }
        score = score_player(team, [{"stat": "kills", "percent": 100}], None, self.rules, ["1"])
        self.assertEqual(score, 600.0)


if __name__ == "__main__":
    unittest.main()
