"""Post an X thread from a drafts.md file.

Reads tokens from .env (X_CONSUMER_KEY, X_CONSUMER_SECRET,
X_ACCESS_TOKEN, X_ACCESS_SECRET). Posts the parsed thread via tweepy.

Usage:
    python scripts/social/post_twitter.py --input content/social/2026-04-20/drafts.md
    python scripts/social/post_twitter.py --input <path> --dry-run
    python scripts/social/post_twitter.py --input <path> --force-unique
"""

from __future__ import annotations

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

# Zero-width space alone is often NOT enough — X fingerprint ignores it.
_ZWSP = "\u200b"


def _client():
    import tweepy

    missing = [
        k
        for k in (
            "X_CONSUMER_KEY",
            "X_CONSUMER_SECRET",
            "X_ACCESS_TOKEN",
            "X_ACCESS_SECRET",
        )
        if not os.getenv(k)
    ]
    if missing:
        raise SystemExit(f"Chybí env: {', '.join(missing)}. Spusť auth_setup.py.")

    return tweepy.Client(
        consumer_key=os.environ["X_CONSUMER_KEY"],
        consumer_secret=os.environ["X_CONSUMER_SECRET"],
        access_token=os.environ["X_ACCESS_TOKEN"],
        access_token_secret=os.environ["X_ACCESS_SECRET"],
    )


def _format_tweepy_error(exc: BaseException) -> str:
    """Human-readable Tweepy / X API error."""
    parts = [f"{type(exc).__name__}: {exc}"]
    response = getattr(exc, "response", None)
    if response is not None:
        status = getattr(response, "status_code", None)
        if status is not None:
            parts.append(f"HTTP {status}")
        text = getattr(response, "text", "") or ""
        if text.strip():
            parts.append(text.strip()[:1000])
    messages = getattr(exc, "api_messages", None) or []
    if messages:
        parts.append("api_messages: " + "; ".join(str(m) for m in messages))
    return " | ".join(parts)


def _is_duplicate_content(exc: BaseException) -> bool:
    blob = _format_tweepy_error(exc).lower()
    return "duplicate content" in blob or "duplicate" in blob and "tweet" in blob


def _with_unique_marker(text: str, attempt: int, *, date_hint: str = "") -> str:
    """Make text unique for X duplicate-content checks.

    attempt 1: trailing ZWSP (sometimes enough)
    attempt 2+: visible date footnote X cannot ignore
    """
    if attempt <= 0:
        return text
    if attempt == 1:
        return text + _ZWSP
    # Visible, short, deterministic — safe for re-runs of the same day's draft
    suffix = date_hint.strip() or "repost"
    # Prefer compact Czech date if ISO
    if len(suffix) == 10 and suffix[4] == "-" and suffix[7] == "-":
        y, m, d = suffix.split("-")
        suffix = f"{int(d)}. {int(m)}."
    marked = f"{text.rstrip()} · {suffix}"
    if len(marked) > 280:
        # Keep under limit: trim body, preserve suffix
        keep = 280 - len(f" · {suffix}") - 1
        marked = f"{text.rstrip()[:keep].rstrip()}… · {suffix}"
    return marked


def _post_thread(
    client,
    tweets: list[str],
    *,
    force_unique: bool,
    date_hint: str = "",
) -> str:
    """Post thread; return URL of first tweet.

    On duplicate of tweet 1, automatically escalates uniqueness markers
    (ZWSP → visible date) up to 2 retries.
    """
    import tweepy

    previous_id: str | None = None
    first_url: str | None = None
    unique_attempt = 1 if force_unique else 0
    max_unique_attempt = 2

    i = 0
    while i < len(tweets):
        raw = tweets[i]
        text = _with_unique_marker(
            raw,
            unique_attempt if i == 0 else 0,
            date_hint=date_hint,
        )
        kwargs: dict = {"text": text}
        if previous_id:
            kwargs["in_reply_to_tweet_id"] = previous_id

        try:
            resp = client.create_tweet(**kwargs)
        except tweepy.Forbidden as exc:
            if _is_duplicate_content(exc) and i == 0 and unique_attempt < max_unique_attempt:
                unique_attempt += 1
                print(
                    f"X: duplicate na 1. tweetu — unikátní marker attempt={unique_attempt}…",
                    file=sys.stderr,
                )
                continue  # retry same index with stronger marker
            print(_format_tweepy_error(exc), file=sys.stderr)
            if _is_duplicate_content(exc):
                raise SystemExit(
                    f"X: duplicitní obsah na tweetu {i + 1}/{len(tweets)}. "
                    "Uprav drafts.md nebo smaž starý tweet na účtu."
                ) from exc
            raise SystemExit(1) from exc
        except tweepy.TweepyException as exc:
            print(_format_tweepy_error(exc), file=sys.stderr)
            raise SystemExit(1) from exc

        tweet_id = resp.data["id"]
        if i == 0:
            first_url = f"https://x.com/i/status/{tweet_id}"
        previous_id = tweet_id
        print(f"Posted {i + 1}/{len(tweets)}: https://x.com/i/status/{tweet_id}")
        i += 1

    return first_url or ""


def main() -> None:
    parser = argparse.ArgumentParser(description="Post X thread from drafts.md")
    parser.add_argument("--input", required=True, help="Path to drafts.md")
    parser.add_argument("--dry-run", action="store_true", help="Print tweets, do not post")
    parser.add_argument(
        "--force-unique",
        action="store_true",
        help="Start with uniqueness marker (skip plain first attempt)",
    )
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
    first_url = _post_thread(
        client,
        drafts.x_thread,
        force_unique=args.force_unique,
        date_hint=drafts.date,
    )
    print(first_url)


if __name__ == "__main__":
    main()
