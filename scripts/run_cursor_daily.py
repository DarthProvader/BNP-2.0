#!/usr/bin/env python3
"""Daily orchestrator: local collectors + Cursor SDK agents + social publish.

Flow (default, SDK mode):
  1. Collectors (local) + package and push content/daily-inbox/{date}/
  2. Cursor SDK local agents, one per step, in strict order:
       article (Claude Sonnet 5)
       → opus (Claude Opus 4.8) → gpt (GPT-5.6 Terra) → grok (Grok 4.5)
       → social drafts (Claude Sonnet 5)
     Each step is verified on disk, then committed and pushed by this script.
     Agents never run git themselves.
  3. Publish X + LinkedIn from content/social-drafts/{date}/drafts.md

Requires CURSOR_API_KEY in scripts/.env.

Legacy mode (`--use-automations`) keeps the old behaviour: wait for cloud
Cursor Automations to push results to origin/main, optionally kicked off by
webhooks (`--use-webhooks`).

Usage:
    python scripts/run_cursor_daily.py
    python scripts/run_cursor_daily.py --date 2026-07-29
    python scripts/run_cursor_daily.py --skip-collect --steps opus,gpt,grok
    python scripts/run_cursor_daily.py --collect-only
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
from cursor_pipeline import agent_runner, articles, gitops, inbox, webhooks

logger = logging.getLogger("cursor_daily")

DEFAULT_POLL_INTERVAL = 45
# Legacy automations mode: collect ~06:00, cron chain runs through ~08:20.
DEFAULT_ARTICLE_TIMEOUT = 90 * 60
DEFAULT_COMMENT_TIMEOUT = 45 * 60
DEFAULT_SOCIAL_TIMEOUT = 45 * 60

# What each verified step commits, and under which message.
STEP_COMMITS = {
    "article": ("content/articles/", "Daily article {date}"),
    "opus": ("content/articles/", "Daily comments opus {date}"),
    "gpt": ("content/articles/", "Daily comments gpt {date}"),
    "grok": ("content/articles/", "Daily comments grok {date}"),
    "social": ("content/social-drafts/", "Daily social drafts {date}"),
}


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


def _step_verifier(target_date: str):
    from run_social import drafts_ready

    def verify(step: str) -> bool:
        if step == "article":
            return articles.article_ready(target_date)
        if step in ("opus", "gpt", "grok"):
            return articles.comment_ready(target_date, step)
        if step == "social":
            return drafts_ready(target_date)
        return False

    return verify


def _step_publisher(target_date: str, use_git: bool = True):
    def after_step(step: str) -> None:
        if not use_git:
            logger.info("Step %s verified (git disabled, nothing published)", step)
            return
        path, message = STEP_COMMITS[step]
        try:
            if gitops.commit_paths([path], message.format(date=target_date)):
                gitops.pull()
                gitops.push()
        except Exception as exc:
            # A failed publish must not abort the remaining steps; the next
            # step's commit picks the files up again.
            logger.warning("Publishing %s failed: %s", step, exc)

    return after_step


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


def _sync_inbox(target_date: str, use_git: bool = True) -> None:
    try:
        inbox.package_inbox(target_date)
    except FileNotFoundError as exc:
        # Re-runs for a past date have no raw data left; the inbox is already
        # in git, so this is not fatal for the writing steps.
        logger.warning("Inbox packaging skipped: %s", exc)
    if not use_git:
        return
    try:
        if gitops.commit_inbox(target_date):
            gitops.pull()
            gitops.push()
        else:
            gitops.pull()
            gitops.push()
    except Exception as exc:
        logger.warning("Inbox git sync: %s", exc)


def _run_sdk_steps(
    target_date: str,
    steps: list[str],
    attempts: int,
    use_git: bool = True,
) -> list[str]:
    logger.info("SDK mode — running steps locally: %s", ", ".join(steps))
    unfinished = agent_runner.run_steps(
        target_date,
        steps,
        verify=_step_verifier(target_date),
        after_step=_step_publisher(target_date, use_git),
        attempts=attempts,
    )
    if unfinished:
        logger.error("Steps that produced nothing: %s", ", ".join(unfinished))
    return unfinished


def _run_automations_steps(
    target_date: str,
    *,
    use_webhooks: bool,
    dry_run_webhooks: bool,
    poll_interval: int,
    article_timeout: int,
    comment_timeout: int,
    social_timeout: int,
) -> list[str]:
    """Legacy path: wait for cloud Automations to push to origin/main."""
    from run_social import drafts_ready

    unfinished: list[str] = []

    if use_webhooks:
        logger.info("Webhook mode enabled")
        webhooks.trigger("article", target_date, dry_run=dry_run_webhooks)
    else:
        logger.info("Cron mode — waiting for Automations (no webhooks)")

    if dry_run_webhooks:
        return unfinished

    _wait_until(
        "article MDX",
        lambda: articles.article_ready(target_date),
        timeout=article_timeout,
        interval=poll_interval,
    )

    for step in ("opus", "gpt", "grok"):
        if use_webhooks:
            webhooks.trigger(step, target_date, dry_run=dry_run_webhooks)
        try:
            _wait_until(
                f"comment:{step}",
                lambda s=step: articles.comment_ready(target_date, s),
                timeout=comment_timeout,
                interval=poll_interval,
            )
        except TimeoutError as exc:
            # The article is already published; a late comment can land after.
            logger.warning("%s — continuing without it", exc)
            unfinished.append(step)

    if use_webhooks:
        webhooks.trigger("social", target_date, dry_run=dry_run_webhooks)

    try:
        _wait_until(
            "social drafts",
            lambda: drafts_ready(target_date),
            timeout=social_timeout,
            interval=poll_interval,
        )
    except TimeoutError as exc:
        logger.error("%s", exc)
        unfinished.append("social")

    return unfinished


def run(
    target_date: str,
    *,
    skip_collect: bool = False,
    collect_only: bool = False,
    skip_social: bool = False,
    steps: list[str] | None = None,
    attempts: int = 2,
    use_automations: bool = False,
    use_webhooks: bool = False,
    dry_run_webhooks: bool = False,
    poll_interval: int = DEFAULT_POLL_INTERVAL,
    article_timeout: int = DEFAULT_ARTICLE_TIMEOUT,
    comment_timeout: int = DEFAULT_COMMENT_TIMEOUT,
    social_timeout: int = DEFAULT_SOCIAL_TIMEOUT,
    clear_inbox_after: bool = False,
    use_git: bool = True,
) -> int:
    logger.info("=== Cursor daily pipeline — %s ===", target_date)
    if not use_git:
        logger.info("Git disabled — nothing will be committed or pushed")

    if not skip_collect:
        _run_collectors()
    else:
        logger.info("Skipping collectors")

    _sync_inbox(target_date, use_git)

    if collect_only:
        logger.info("Collect-only — stopping before the writing steps")
        return 0

    if use_automations:
        unfinished = _run_automations_steps(
            target_date,
            use_webhooks=use_webhooks,
            dry_run_webhooks=dry_run_webhooks,
            poll_interval=poll_interval,
            article_timeout=article_timeout,
            comment_timeout=comment_timeout,
            social_timeout=social_timeout,
        )
        if dry_run_webhooks:
            return 0
    else:
        unfinished = _run_sdk_steps(
            target_date,
            steps or list(agent_runner.STEPS),
            attempts,
            use_git,
        )

    exit_code = 1 if unfinished else 0

    if skip_social:
        logger.info("Skipping social publish (--skip-social)")
    elif "social" in unfinished:
        logger.error("No drafts for %s — skipping social publish", target_date)
    else:
        _run_social(target_date)

    if use_git:
        try:
            gitops.pull()
            gitops.commit_articles_if_any(target_date)
            gitops.push()
        except Exception as exc:
            logger.warning("Final git sync: %s", exc)

    if clear_inbox_after and use_git:
        inbox.clear_inbox(target_date)
        if gitops.commit_inbox(target_date):
            gitops.push()

    slug = articles.article_slug(target_date)
    logger.info("=== Done — date=%s slug=%s ===", target_date, slug)
    return exit_code


def main() -> None:
    parser = argparse.ArgumentParser(description="BNP daily orchestrator (Cursor SDK)")
    parser.add_argument("--date", type=str, default=None)
    parser.add_argument("--skip-collect", action="store_true")
    parser.add_argument("--collect-only", action="store_true")
    parser.add_argument("--skip-social", action="store_true")
    parser.add_argument(
        "--steps",
        type=str,
        default=None,
        help=f"Comma-separated subset of: {','.join(agent_runner.STEPS)}",
    )
    parser.add_argument(
        "--attempts",
        type=int,
        default=2,
        help="Attempts per step before giving up (default 2)",
    )
    parser.add_argument(
        "--use-automations",
        action="store_true",
        help="Legacy: wait for cloud Automations instead of running SDK agents",
    )
    parser.add_argument(
        "--use-webhooks",
        action="store_true",
        help="With --use-automations: trigger via CURSOR_WEBHOOK_* webhooks",
    )
    parser.add_argument("--dry-run-webhooks", action="store_true")
    parser.add_argument("--poll-interval", type=int, default=DEFAULT_POLL_INTERVAL)
    parser.add_argument("--article-timeout", type=int, default=DEFAULT_ARTICLE_TIMEOUT)
    parser.add_argument("--comment-timeout", type=int, default=DEFAULT_COMMENT_TIMEOUT)
    parser.add_argument("--social-timeout", type=int, default=DEFAULT_SOCIAL_TIMEOUT)
    parser.add_argument("--clear-inbox", action="store_true")
    parser.add_argument(
        "--no-git",
        action="store_true",
        help="Never commit, pull or push (for sandbox/dry runs)",
    )
    args = parser.parse_args()

    if args.skip_collect and args.collect_only:
        print("ERROR: --skip-collect and --collect-only cannot be combined")
        sys.exit(2)

    if args.no_git and args.use_automations:
        print("ERROR: --no-git cannot be combined with --use-automations")
        sys.exit(2)

    steps: list[str] | None = None
    if args.steps:
        steps = [s.strip() for s in args.steps.split(",") if s.strip()]
        unknown = [s for s in steps if s not in agent_runner.STEPS]
        if unknown:
            print(f"ERROR: unknown steps: {', '.join(unknown)}")
            sys.exit(2)

    setup_logging("cursor_daily")
    target = args.date or date.today().isoformat()
    try:
        code = run(
            target,
            skip_collect=args.skip_collect,
            collect_only=args.collect_only,
            skip_social=args.skip_social,
            steps=steps,
            attempts=args.attempts,
            use_automations=args.use_automations,
            use_webhooks=args.use_webhooks,
            dry_run_webhooks=args.dry_run_webhooks,
            poll_interval=args.poll_interval,
            article_timeout=args.article_timeout,
            comment_timeout=args.comment_timeout,
            social_timeout=args.social_timeout,
            clear_inbox_after=args.clear_inbox,
            use_git=not args.no_git,
        )
    except Exception:
        logger.exception("Pipeline failed")
        sys.exit(1)
    sys.exit(code)


if __name__ == "__main__":
    main()
