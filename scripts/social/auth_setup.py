"""One-time OAuth setup for X and LinkedIn.

Before running this, create:
  1. X (Twitter) developer app at developer.x.com — read+write permissions,
     OAuth 1.0a enabled, note Consumer Key/Secret.
  2. LinkedIn app at developer.linkedin.com — products "Share on LinkedIn"
     + "Sign In with LinkedIn using OpenID Connect", note Client ID/Secret,
     add http://localhost:8765/callback to authorized redirect URLs.

Usage:
    python scripts/social/auth_setup.py --twitter
    python scripts/social/auth_setup.py --linkedin

Tokens are appended to .env in the project root.
"""

import argparse
import http.server
import os
import secrets
import socketserver
import sys
import threading
import urllib.parse
import webbrowser
from pathlib import Path

import requests
from dotenv import load_dotenv

# Windows cp1250 console can't handle emoji — force UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
ENV_FILE = SCRIPTS_DIR / ".env"
REDIRECT_PORT = 8765
REDIRECT_URI = f"http://localhost:{REDIRECT_PORT}/callback"


def _append_env(updates: dict[str, str]) -> None:
    existing: dict[str, str] = {}
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.strip().startswith("#"):
                k, _, v = line.partition("=")
                existing[k.strip()] = v.strip()
    existing.update(updates)
    ENV_FILE.write_text(
        "\n".join(f"{k}={v}" for k, v in existing.items()) + "\n",
        encoding="utf-8",
    )
    print(f"✓ Tokeny uloženy do {ENV_FILE}")


class _CallbackHandler(http.server.BaseHTTPRequestHandler):
    query: dict[str, list[str]] = {}

    def do_GET(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        _CallbackHandler.query = urllib.parse.parse_qs(parsed.query)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(
            b"<h1>Hotovo.</h1><p>Muzes zavrit okno a vratit se do terminalu.</p>"
        )

    def log_message(self, *_args: object) -> None:  # silence
        pass


def _wait_for_callback() -> dict[str, list[str]]:
    _CallbackHandler.query = {}
    server = socketserver.TCPServer(("localhost", REDIRECT_PORT), _CallbackHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    while not _CallbackHandler.query:
        pass
    server.shutdown()
    return _CallbackHandler.query


def setup_twitter() -> None:
    """X OAuth 1.0a PIN-based flow (simplest, no callback server needed)."""
    import tweepy

    consumer_key = os.getenv("X_CONSUMER_KEY") or input("X Consumer Key (API Key): ").strip()
    consumer_secret = os.getenv("X_CONSUMER_SECRET") or input("X Consumer Secret (API Secret): ").strip()

    auth = tweepy.OAuth1UserHandler(
        consumer_key, consumer_secret, callback="oob",
    )
    auth_url = auth.get_authorization_url()
    print(f"\nOtevři v prohlížeči a autorizuj:\n  {auth_url}")
    webbrowser.open(auth_url)

    pin = input("\nVlož PIN ze stránky: ").strip()
    auth.get_access_token(pin)

    _append_env({
        "X_CONSUMER_KEY": consumer_key,
        "X_CONSUMER_SECRET": consumer_secret,
        "X_ACCESS_TOKEN": auth.access_token,
        "X_ACCESS_SECRET": auth.access_token_secret,
    })


def setup_linkedin() -> None:
    """LinkedIn OAuth 2.0 code flow with local callback."""
    client_id = os.getenv("LINKEDIN_CLIENT_ID") or input("LinkedIn Client ID: ").strip()
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET") or input("LinkedIn Client Secret: ").strip()
    print(f"Client ID: {client_id[:6]}... (z .env)" if os.getenv("LINKEDIN_CLIENT_ID") else "")

    state = secrets.token_urlsafe(16)
    scope = "w_member_social openid profile"

    auth_url = "https://www.linkedin.com/oauth/v2/authorization?" + urllib.parse.urlencode({
        "response_type": "code",
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "state": state,
        "scope": scope,
    })
    print(f"\nOtevírám prohlížeč:\n  {auth_url}")
    webbrowser.open(auth_url)
    print("Čekám na callback na localhost:8765 ...")

    query = _wait_for_callback()
    if query.get("state", [""])[0] != state:
        raise SystemExit("State mismatch — zkus to znovu.")
    code = query.get("code", [""])[0]
    if not code:
        raise SystemExit(f"LinkedIn vrátil chybu: {query}")

    # Exchange code for access token
    token_resp = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": client_id,
            "client_secret": client_secret,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    token_resp.raise_for_status()
    token = token_resp.json()["access_token"]

    # Resolve person URN via /userinfo (OIDC endpoint, scope "openid profile")
    me = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    me.raise_for_status()
    sub = me.json()["sub"]
    urn = f"urn:li:person:{sub}"

    _append_env({
        "LINKEDIN_CLIENT_ID": client_id,
        "LINKEDIN_CLIENT_SECRET": client_secret,
        "LINKEDIN_ACCESS_TOKEN": token,
        "LINKEDIN_PERSON_URN": urn,
    })


def main() -> None:
    parser = argparse.ArgumentParser(description="OAuth setup for social accounts")
    parser.add_argument("--twitter", action="store_true", help="Setup X/Twitter")
    parser.add_argument("--linkedin", action="store_true", help="Setup LinkedIn")
    args = parser.parse_args()

    if not (args.twitter or args.linkedin):
        parser.error("Vyber --twitter nebo --linkedin")

    load_dotenv(ENV_FILE)

    if args.twitter:
        setup_twitter()
    if args.linkedin:
        setup_linkedin()


if __name__ == "__main__":
    main()
