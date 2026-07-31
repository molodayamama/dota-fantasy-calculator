from __future__ import annotations

import argparse
import json
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

from .config import DEFAULT_RULES_PATH, DEFAULT_SNAPSHOT_PATH, DEFAULT_TOURNAMENTS_PATH, STATIC_ROOT, empty_snapshot, read_json


class FantasyRequestHandler(SimpleHTTPRequestHandler):
    rules_path: Path = DEFAULT_RULES_PATH
    snapshot_path: Path = DEFAULT_SNAPSHOT_PATH
    tournaments_path: Path = DEFAULT_TOURNAMENTS_PATH

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(STATIC_ROOT), **kwargs)

    def log_message(self, format: str, *args: Any) -> None:
        return

    def _json_response(self, payload: Any, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path == "/api/rules":
            self._json_response(read_json(self.rules_path))
            return
        if path == "/api/snapshot":
            if self.snapshot_path.exists():
                self._json_response(read_json(self.snapshot_path))
            else:
                tournaments = read_json(self.tournaments_path)
                self._json_response(empty_snapshot(2026, tournaments))
            return
        if path == "/":
            self.path = "/index.html"
        super().do_GET()


def run_server(port: int, host: str, rules_path: Path, snapshot_path: Path, tournaments_path: Path) -> None:
    FantasyRequestHandler.rules_path = rules_path
    FantasyRequestHandler.snapshot_path = snapshot_path
    FantasyRequestHandler.tournaments_path = tournaments_path
    server = ThreadingHTTPServer((host, port), FantasyRequestHandler)
    print(f"Serving Dota Fantasy calculator at http://{host}:{port}")
    server.serve_forever()


def add_web_parser(subparsers: argparse._SubParsersAction[argparse.ArgumentParser]) -> None:
    parser = subparsers.add_parser("web", help="Serve the local calculator UI")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--rules", default=DEFAULT_RULES_PATH, type=Path)
    parser.add_argument("--snapshot", default=DEFAULT_SNAPSHOT_PATH, type=Path)
    parser.add_argument("--tournaments", default=DEFAULT_TOURNAMENTS_PATH, type=Path)
    parser.set_defaults(func=lambda args: run_server(args.port, args.host, args.rules, args.snapshot, args.tournaments))

