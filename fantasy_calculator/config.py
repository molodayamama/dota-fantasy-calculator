from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path.cwd()
PACKAGE_ROOT = Path(__file__).resolve().parent
STATIC_ROOT = PACKAGE_ROOT / "static"

DEFAULT_RULES_PATH = PROJECT_ROOT / "config" / "fantasy_rules.json"
DEFAULT_TOURNAMENTS_PATH = PROJECT_ROOT / "config" / "tournaments_2026.json"
DEFAULT_TEAMS_PATH = PROJECT_ROOT / "config" / "teams_2026.json"
DEFAULT_SNAPSHOT_PATH = PROJECT_ROOT / "data" / "fantasy_snapshot.json"
DEFAULT_RAW_CACHE_DIR = PROJECT_ROOT / "data" / "raw"


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def load_dotenv(path: Path | None = None) -> None:
    env_path = path or (PROJECT_ROOT / ".env")
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def empty_snapshot(year: int, tournaments: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "year": year,
        "generated_at": None,
        "source": {
            "open_dota": "https://api.opendota.com/api",
            "stratz": "https://api.stratz.com/graphql",
            "stratz_used": False,
        },
        "tournaments": tournaments,
        "players": [],
    }
