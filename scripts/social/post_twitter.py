"""Post an X thread from a drafts.md file.

Reads tokens from .env (X_CONSUMER_KEY, X_CONSUMER_SECRET,
X_ACCESS_TOKEN, X_ACCESS_SECRET). Posts the parsed thread via tweepy.

Usage:
    python scripts/social/post_twitter.py --input content/social/2026-04-20/drafts.md
    python scripts/social/post_twitter.py --input <path> --dry-run
"""

import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

# Windows cp1250 console can't handle emoji — force UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from social.drafts_parser import parse


def _client():
    import tweepy

    missing = [
        k for k in (
            "X_CONSUMER_KEY", "X_CONSUMER_SECRET",
            "X_ACCESS_TOKEN", "X_ACCESS_SECRET",
        ) if not os.getenv(k)
    ]
    if missing:
        raise SystemExit(f"Chybí env: {', '.join(missing)}. Spusť auth_setup.py.")

    return tweepy.Client(
        consumer_key=os.environ["X_CONSUMER_KEY"],
        consumer_secret=os.environ["X_CONSUMER_SECRET"],
        access_token=os.environ["X_ACCESS_TOKEN"],
        access_token_secret=os.environ["X_ACCESS_SECRET"],
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Post X thread from drafts.md")
    parser.add_argument("--input", required=True, help="Path to drafts.md")
    parser.add_argument("--dry-run", action="store_true", help="Print tweets, do not post")
    args = parser.parse_args()

    load_dotenv(SCRIPTS_DIR / ".env")

    drafts = parse(Path(args.input))
    if not drafts.x_thread:
        raise SystemExit("drafts.md: sekce ## X je prázdná")

    # Enforce 280-char limit before any posting
    too_long = [(i, t) for i, t in enumerate(drafts.x_thread, 1) if len(t) > 280]
    if too_long:
        print("CHYBA: Některé tweety přesahují 280 znaků:", file=sys.stderr)
        for i, t in too_long:
            print(f"  #{i} ({len(t)} zn.): {t[:60]}...", file=sys.stderr)
        raise SystemExit(1)

    if args.dry_run:
        print(f"[DRY-RUN] Thread o {len(drafts.x_thread)} tweetech:")
        for i, t in enumerate(drafts.x_thread, 1):
            print(f"\n--- tweet {i}/{len(drafts.x_thread)} ({len(t)} zn.) ---")
            print(t)
        return

    client = _client()
    previous_id: str | None = None
    first_url: str | None = None
    for i, tweet in enumerate(drafts.x_thread, 1):
        kwargs = {"text": tweet}
        if previous_id:
            kwargs["in_reply_to_tweet_id"] = previous_id
        resp = client.create_tweet(**kwargs)
        tweet_id = resp.data["id"]
        if i == 1:
            first_url = f"https://x.com/i/status/{tweet_id}"
        previous_id = tweet_id
        print(f"Posted {i}/{len(drafts.x_thread)}: https://x.com/i/status/{tweet_id}")

    print(first_url or "")


if __name__ == "__main__":
    main()
