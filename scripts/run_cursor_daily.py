#!/usr/bin/env python3
"""Daily orchestrator with Cursor Automations on a cron chain (no webhooks).

Flow:
  1. Collectors (local) + push content/daily-inbox/{date}/
  2. Poll git until Automations finish:
       - article (Sonnet 5)
       - Opus 4.8 → GPT-5.6 Terra → Grok 4.5 comments
       - social drafts (Sonnet 5) in content/social-drafts/
  3. Publish X + LinkedIn locally

Cursor Automations must be scheduled (see scripts/automations/README.md).
Webhook env vars are optional — used only with --use-webhooks.

Usage:
    python scripts/run_cursor_daily.py
    python scripts/run_cursor_daily.py --date 2026-07-24
    python scripts/run_cursor_daily.py --collect-only
    python scripts/run_cursor_daily.py --use-webhooks   # optional legacy path
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

DEFAULT_POLL_INTERVAL = 45
# Collect ~06:00; Automations cron through ~08:20 — allow until late morning
DEFAULT_ARTICLE_TIMEOUT = 90 * 60
DEFAULT_COMMENT_TIMEOUT = 45 * 60
DEFAULT_SOCIAL_TIMEOUT = 45 * 60


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


def _wait_until(label: str, predicate, timeout: int, interval: int) -> None:
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
    use_webhooks: bool = False,
    dry_run_webhooks: bool = False,
    poll_interval: int = DEFAULT_POLL_INTERVAL,
    article_timeout: int = DEFAULT_ARTICLE_TIMEOUT,
    comment_timeout: int = DEFAULT_COMMENT_TIMEOUT,
    social_timeout: int = DEFAULT_SOCIAL_TIMEOUT,
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
        try:
            gitops.pull()
            gitops.push()
        except Exception as exc:
            logger.warning("git sync after empty inbox commit: %s", exc)

    if collect_only:
        logger.info("Collect-only — Automations will pick up inbox on schedule")
        return 0

    if use_webhooks:
        logger.info("Webhook mode enabled")
        webhooks.trigger("article", target_date, dry_run=dry_run_webhooks)
    else:
        logger.info("Cron mode — waiting for Automations (no webhooks)")

    if not dry_run_webhooks:
        _wait_until(
            "article MDX",
            lambda: articles.article_ready(target_date),
            timeout=article_timeout,
            interval=poll_interval,
        )

    exit_code = 0
    missing_comments: list[str] = []

    for step in ("opus", "gpt", "grok"):
        if use_webhooks:
            webhooks.trigger(step, target_date, dry_run=dry_run_webhooks)
        if dry_run_webhooks:
            continue
        try:
            _wait_until(
                f"comment:{step}",
                lambda s=step: articles.comment_ready(target_date, s),
                timeout=comment_timeout,
                interval=poll_interval,
            )
        except TimeoutError as exc:
            # The article is already published; a late comment can land afterwards.
            logger.warning("%s — continuing without it", exc)
            missing_comments.append(step)

    if use_webhooks:
        webhooks.trigger("social", target_date, dry_run=dry_run_webhooks)

    if not dry_run_webhooks:
        from run_social import drafts_ready

        try:
            _wait_until(
                "social drafts",
                lambda: drafts_ready(target_date),
                timeout=social_timeout,
                interval=poll_interval,
            )
        except TimeoutError as exc:
            logger.error("%s — skipping social publish", exc)
            skip_social = True
            exit_code = 1

    if skip_social or dry_run_webhooks:
        logger.info("Skipping social publish")
    else:
        _run_social(target_date)

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
    if missing_comments:
        logger.warning("Comments never landed: %s", ", ".join(missing_comments))
    logger.info("=== Done — date=%s slug=%s ===", target_date, slug)
    return exit_code


def main() -> None:
    parser = argparse.ArgumentParser(description="BNP Cursor Automations daily orchestrator")
    parser.add_argument("--date", type=str, default=None)
    parser.add_argument("--skip-collect", action="store_true")
    parser.add_argument("--collect-only", action="store_true")
    parser.add_argument("--skip-social", action="store_true")
    parser.add_argument(
        "--use-webhooks",
        action="store_true",
        help="Trigger Automations via webhooks (requires CURSOR_WEBHOOK_* in .env)",
    )
    parser.add_argument("--dry-run-webhooks", action="store_true")
    parser.add_argument("--poll-interval", type=int, default=DEFAULT_POLL_INTERVAL)
    parser.add_argument("--article-timeout", type=int, default=DEFAULT_ARTICLE_TIMEOUT)
    parser.add_argument("--comment-timeout", type=int, default=DEFAULT_COMMENT_TIMEOUT)
    parser.add_argument("--social-timeout", type=int, default=DEFAULT_SOCIAL_TIMEOUT)
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
            use_webhooks=args.use_webhooks,
            dry_run_webhooks=args.dry_run_webhooks,
            poll_interval=args.poll_interval,
            article_timeout=args.article_timeout,
            comment_timeout=args.comment_timeout,
            social_timeout=args.social_timeout,
            clear_inbox_after=args.clear_inbox,
        )
    except Exception:
        logger.exception("Pipeline failed")
        sys.exit(1)
    sys.exit(code)


if __name__ == "__main__":
    main()
