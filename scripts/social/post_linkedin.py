"""Post a LinkedIn update from a drafts.md file.

The article URL (from drafts.md frontmatter) is appended to the end of the
main post. LinkedIn algo mildly penalizes external links but for traffic
building that tradeoff is acceptable.

Reads tokens from .env:
    LINKEDIN_ACCESS_TOKEN  (w_member_social scope)
    LINKEDIN_PERSON_URN    (e.g. "urn:li:person:abc123" — resolved by auth_setup.py)

Usage:
    python scripts/social/post_linkedin.py --input content/social/2026-04-20/drafts.md
    python scripts/social/post_linkedin.py --input <path> --dry-run
"""

import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

# Windows cp1250 console can't handle emoji — force UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from social.drafts_parser import parse

API = "https://api.linkedin.com/rest"
USERINFO_URL = "https://api.linkedin.com/v2/userinfo"
HEADERS_VERSION = "202510"  # LinkedIn deprecates versions ~12mo — update periodically


def _headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "LinkedIn-Version": HEADERS_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
    }


def _resolve_profile(token: str) -> dict[str, str]:
    r = requests.get(
        USERINFO_URL,
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    r.raise_for_status()
    payload = r.json()
    sub = str(payload.get("sub", "")).strip()
    if not sub:
        raise RuntimeError("LinkedIn /userinfo response missing sub")
    return {
        "sub": sub,
        "urn": f"urn:li:person:{sub}",
        "name": str(payload.get("name", "")).strip(),
    }


def _validate_token_identity(token: str, urn: str) -> None:
    profile = _resolve_profile(token)
    if profile["urn"] != urn:
        raise SystemExit(
            "LINKEDIN_ACCESS_TOKEN patří jinému LinkedIn účtu než LINKEDIN_PERSON_URN. "
            f"Token resolved to {profile['urn']}, env has {urn}. Spusť auth_setup.py --linkedin."
        )
    expected_sub = str(os.getenv("LINKEDIN_EXPECTED_SUB") or os.getenv("LINKEDIN_PROFILE_SUB") or "").strip()
    if expected_sub and profile["sub"] != expected_sub:
        raise SystemExit(
            "LINKEDIN_ACCESS_TOKEN je vydaný pro jiný LinkedIn účet, než čeká BNP projekt. "
            f"Expected sub {expected_sub}, got {profile['sub']}. Spusť auth_setup.py --linkedin."
        )


def _post_main(token: str, urn: str, text: str) -> str:
    payload = {
        "author": urn,
        "commentary": text,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": [],
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }
    r = requests.post(f"{API}/posts", headers=_headers(token), json=payload, timeout=30)
    r.raise_for_status()

    post_urn = r.headers.get("x-restli-id") or r.headers.get("X-RestLi-Id")
    if not post_urn:
        raise RuntimeError(f"LinkedIn nedodal post URN, response: {r.text[:500]}")
    return post_urn


def main() -> None:
    parser = argparse.ArgumentParser(description="Post LinkedIn update from drafts.md")
    parser.add_argument("--input", required=True, help="Path to drafts.md")
    parser.add_argument("--dry-run", action="store_true", help="Print payload, do not post")
    args = parser.parse_args()

    load_dotenv(SCRIPTS_DIR / ".env")

    drafts = parse(Path(args.input))
    if not drafts.linkedin_post.strip():
        raise SystemExit("drafts.md: sekce ## LinkedIn je prázdná")

    # Append article URL at the end of the post
    body = drafts.linkedin_post.rstrip()
    if drafts.article_url:
        body = f"{body}\n\n🔗 {drafts.article_url}"

    if args.dry_run:
        print(f"[DRY-RUN] LinkedIn post ({len(body)} zn.):")
        print(body)
        return

    for key in ("LINKEDIN_ACCESS_TOKEN", "LINKEDIN_PERSON_URN"):
        if not os.getenv(key):
            raise SystemExit(f"Chybí env: {key}. Spusť auth_setup.py --linkedin.")

    token = os.environ["LINKEDIN_ACCESS_TOKEN"]
    urn = os.environ["LINKEDIN_PERSON_URN"]
    _validate_token_identity(token, urn)

    post_urn = _post_main(token, urn, body)
    post_url = f"https://www.linkedin.com/feed/update/{post_urn}/"
    print(f"Posted: {post_url}")
    print(post_url)


if __name__ == "__main__":

    main()
