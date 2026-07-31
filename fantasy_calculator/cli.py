from __future__ import annotations

import argparse

from .refresh import add_refresh_parser
from .web import add_web_parser


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="python -m fantasy_calculator")
    subparsers = parser.add_subparsers(dest="command", required=True)
    add_refresh_parser(subparsers)
    add_web_parser(subparsers)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    result = args.func(args)
    if args.command == "refresh":
        print(
            "Generated {players} players from {tournaments} tournaments into {output}".format(
                players=len(result.get("players", [])),
                tournaments=len(result.get("tournaments", [])),
                output=args.output,
            )
        )
    return 0

