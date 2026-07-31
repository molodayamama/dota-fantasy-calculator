from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


class ApiError(RuntimeError):
    """Raised when an upstream API cannot return usable JSON."""


def _request_json(url: str, *, method: str = "GET", payload: dict[str, Any] | None = None, headers: dict[str, str] | None = None) -> Any:
    data = None
    request_headers = {
        "Accept": "application/json",
        "User-Agent": "fantasy-calculator/0.1",
    }
    if headers:
        request_headers.update(headers)

    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        request_headers["Content-Type"] = "application/json"

    request = Request(url, data=data, headers=request_headers, method=method)
    try:
        with urlopen(request, timeout=45) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise ApiError(f"{url} returned HTTP {exc.code}: {details[:400]}") from exc
    except (URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise ApiError(f"{url} failed: {exc}") from exc


class JsonCache:
    def __init__(self, root: Path):
        self.root = root

    def get(self, key: str) -> Any | None:
        path = self.root / key
        if not path.exists():
            return None
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)

    def set(self, key: str, payload: Any) -> None:
        path = self.root / key
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False)


class OpenDotaClient:
    base_url = "https://api.opendota.com/api"

    def __init__(self, cache_dir: Path, *, use_cache: bool = True, sleep_seconds: float = 1.1):
        self.cache = JsonCache(cache_dir / "opendota")
        self.use_cache = use_cache
        self.sleep_seconds = sleep_seconds

    def _get(self, path: str, cache_key: str) -> Any:
        if self.use_cache:
            cached = self.cache.get(cache_key)
            if cached is not None:
                return cached

        if self.sleep_seconds:
            time.sleep(self.sleep_seconds)
        payload = _request_json(f"{self.base_url}{path}")
        self.cache.set(cache_key, payload)
        return payload

    def get_heroes(self) -> list[dict[str, Any]]:
        return self._get("/heroes", "heroes.json")

    def get_league_matches(self, league_id: int) -> list[dict[str, Any]]:
        return self._get(f"/leagues/{league_id}/matches", f"leagues/{league_id}_matches.json")

    def get_match(self, match_id: int) -> dict[str, Any]:
        return self._get(f"/matches/{match_id}", f"matches/{match_id}.json")


class StratzClient:
    base_url = "https://api.stratz.com/graphql"

    def __init__(self, token: str | None, cache_dir: Path, *, use_cache: bool = True, sleep_seconds: float = 1.1):
        self.token = token
        self.cache = JsonCache(cache_dir / "stratz")
        self.use_cache = use_cache
        self.sleep_seconds = sleep_seconds

    @property
    def enabled(self) -> bool:
        return bool(self.token)

    def get_match_supplement(self, match_id: int) -> dict[str, Any] | None:
        cache_key = f"matches/{match_id}.json"
        if self.use_cache:
            cached = self.cache.get(cache_key)
            if cached is not None:
                return cached

        if not self.token:
            return None

        if self.sleep_seconds:
            time.sleep(self.sleep_seconds)

        query = """
        {
          match(id: MATCH_ID) {
            firstBloodTime
            players {
              heroId
              dotaPlus {
                level
              }
            }
          }
        }
        """.replace("MATCH_ID", str(match_id))

        try:
            payload = _request_json(
                self.base_url,
                method="POST",
                payload={"query": query},
                headers={"Authorization": f"Bearer {self.token}"},
            )
        except ApiError:
            return None

        match = payload.get("data", {}).get("match")
        if not match:
            return None
        self.cache.set(cache_key, match)
        return match


def explorer_sql_url(sql: str) -> str:
    return f"https://api.opendota.com/api/explorer?sql={quote(sql)}"

