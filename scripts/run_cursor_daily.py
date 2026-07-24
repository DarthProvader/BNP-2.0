#!/usr/bin/env python3
"""Daily orchestrator: collect → inbox → Cursor Automations chain → social.

Flow:
  1. Collectors (local)
  2. Package content/daily-inbox/{date}/ and push to git
  3. Webhook: article Automation (Claude Sonnet 5)
  4. Poll until CS+EN MDX exist
  5. Webhook: Opus 4.8 comment → poll
  6. Webhook: GPT-5.6 Terra comment → poll
  7. Webhook: Grok 4.5 comment → poll
  8. Social publish (local)
  9. Final git sync

Usage:
    python scripts/run_cursor_daily.py
    python scripts/run_cursor_daily.py --date 2026-07-24
    python scripts/run_cursor_daily.py --skip-collect
    python scripts/run_cursor_daily.py --collect-only
    python scripts/run_cursor_daily.py --dry-run-webhooks
"""

from __future__ import annotations

import argparse
import logging
import sys
import time
from datetime import date
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))

try:
    from dotenv import load_dotenv
    load_dotenv(SCRIPTS_DIR / ".env")
except ImportError:
    pass

from utils import setup_logging
from cursor_pipeline import articles, gitops, inbox, webhooks

logger = logging.getLogger("cursor_daily")

DEFAULT_POLL_INTERVAL = 30
DEFAULT_ARTICLE_TIMEOUT = 45 * 60
DEFAULT_COMMENT_TIMEOUT = 25 * 60


def _run_collectors() -> None:
    from collectors.rss_collector import run as rss_run
    from collectors.twitter_collector import run as twitter_run
    from collectors.reddit_collector import run as reddit_run
    from collectors.yt_transcript_collector import run as transcripts_run
    from collectors.futuretools_collector import run as futuretools_run

    for name, fn in (
        ("RSS", rss_run),
        ("Twitter", twitter_run),
        ("Reddit", reddit_run),
        ("Transcripts", transcripts_run),
        ("FutureTools", futuretools_run),
    ):
        logger.info("Collecting: %s", name)
        fn()


def _wait_until(
    label: str,
    predicate,
    timeout: int,
    interval: int,
) -> None:
    deadline = time.time() + timeout
    attempt = 0
    while time.time() < deadline:
        attempt += 1
        try:
            gitops.pull()
        except Exception as exc:
            logger.warning("git pull during poll failed: %s", exc)

        if predicate():
            logger.info("%s — ready after %d poll(s)", label, attempt)
            return

        remaining = int(deadline - time.time())
        logger.info(
            "%s — not ready yet (poll %d, %ds left), sleeping %ds…",
            label,
            attempt,
            remaining,
            interval,
        )
        time.sleep(interval)

    raise TimeoutError(f"Timed out waiting for: {label} ({timeout}s)")


def _run_social(target_date: str) -> None:
    from run_social import run as run_social

    code = run_social(
        target_date=target_date,
        dry_run=False,
        skip_twitter=False,
        skip_linkedin=False,
    )
    if code != 0:
        raise RuntimeError(f"run_social exited {code}")


def run(
    target_date: str,
    *,
    skip_collect: bool = False,
    collect_only: bool = False,
    skip_social: bool = False,
    dry_run_webhooks: bool = False,
    poll_interval: int = DEFAULT_POLL_INTERVAL,
    article_timeout: int = DEFAULT_ARTICLE_TIMEOUT,
    comment_timeout: int = DEFAULT_COMMENT_TIMEOUT,
    clear_inbox_after: bool = False,
) -> int:
    logger.info("=== Cursor daily pipeline — %s ===", target_date)

    if not skip_collect:
        _run_collectors()
    else:
        logger.info("Skipping collectors")

    inbox.package_inbox(target_date)
    if gitops.commit_inbox(target_date):
        gitops.pull()
        gitops.push()
    else:
        # Still push in case a previous commit is unpushed
        try:
            gitops.pull()
            gitops.push()
        except Exception as exc:
            logger.warning("git sync after empty inbox commit: %s", exc)

    if collect_only:
        logger.info("Collect-only mode — stopping before Automations")
        return 0

    # --- Article (Sonnet 5) ---
    webhooks.trigger("article", target_date, dry_run=dry_run_webhooks)
    if not dry_run_webhooks:
        _wait_until(
            "article MDX",
            lambda: articles.article_ready(target_date),
            timeout=article_timeout,
            interval=poll_interval,
        )

    # --- Comments chain ---
    for step in ("opus", "gpt", "grok"):
        webhooks.trigger(step, target_date, dry_run=dry_run_webhooks)
        if dry_run_webhooks:
            continue
        _wait_until(
            f"comment:{step}",
            lambda s=step: articles.comment_ready(target_date, s),
            timeout=comment_timeout,
            interval=poll_interval,
        )

    # --- Social drafts (Sonnet 5) then local publish ---
    webhooks.trigger("social", target_date, dry_run=dry_run_webhooks)
    if not dry_run_webhooks:
        from run_social import drafts_ready

        _wait_until(
            "social drafts",
            lambda: drafts_ready(target_date),
            timeout=comment_timeout,
            interval=poll_interval,
        )

    if skip_social:
        logger.info("Skipping social publish")
    elif dry_run_webhooks:
        logger.info("Skipping social publish (dry-run webhooks)")
    else:
        _run_social(target_date)

    # Final sync (Automations may have pushed; social doesn't touch articles)
    try:
        gitops.pull()
        if gitops.commit_articles_if_any(target_date):
            gitops.push()
        else:
            gitops.push()
    except Exception as exc:
        logger.warning("Final git sync: %s", exc)

    if clear_inbox_after:
        inbox.clear_inbox(target_date)
        if gitops.commit_inbox(target_date):
            gitops.push()

    slug = articles.article_slug(target_date)
    logger.info("=== Done — date=%s slug=%s ===", target_date, slug)
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="BNP Cursor Automations daily orchestrator")
    parser.add_argument("--date", type=str, default=None)
    parser.add_argument("--skip-collect", action="store_true")
    parser.add_argument("--collect-only", action="store_true")
    parser.add_argument("--skip-social", action="store_true")
    parser.add_argument("--dry-run-webhooks", action="store_true")
    parser.add_argument("--poll-interval", type=int, default=DEFAULT_POLL_INTERVAL)
    parser.add_argument("--article-timeout", type=int, default=DEFAULT_ARTICLE_TIMEOUT)
    parser.add_argument("--comment-timeout", type=int, default=DEFAULT_COMMENT_TIMEOUT)
    parser.add_argument("--clear-inbox", action="store_true")
    args = parser.parse_args()

    if args.skip_collect and args.collect_only:
        print("ERROR: --skip-collect and --collect-only cannot be combined")
        sys.exit(2)

    setup_logging("cursor_daily")
    target = args.date or date.today().isoformat()
    try:
        code = run(
            target,
            skip_collect=args.skip_collect,
            collect_only=args.collect_only,
            skip_social=args.skip_social,
            dry_run_webhooks=args.dry_run_webhooks,
            poll_interval=args.poll_interval,
            article_timeout=args.article_timeout,
            comment_timeout=args.comment_timeout,
            clear_inbox_after=args.clear_inbox,
        )
    except Exception:
        logger.exception("Pipeline failed")
        sys.exit(1)
    sys.exit(code)


if __name__ == "__main__":
    main()
