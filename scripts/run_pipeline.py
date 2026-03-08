#!/usr/bin/env python3
"""Daily pipeline orchestrator — collects data and generates article.

Usage:
    python scripts/run_pipeline.py                     # full pipeline, today
    python scripts/run_pipeline.py --date 2026-03-04   # specific date
    python scripts/run_pipeline.py --skip-collect       # skip collectors, generate only
    python scripts/run_pipeline.py --collect-only       # collect only, no generation
"""

import argparse
import logging
import sys
import time
import traceback
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Any, Callable

sys.path.insert(0, str(Path(__file__).resolve().parent))

from utils import setup_logging

# ---------------------------------------------------------------------------
# Step result
# ---------------------------------------------------------------------------

@dataclass
class StepResult:
    name: str
    status: str = "SKIPPED"      # OK | FAILED | SKIPPED
    duration: float = 0.0
    detail: str = ""
    error: str | None = None


def _format_duration(seconds: float) -> str:
    if seconds < 60:
        return f"{seconds:.1f}s"
    m, s = divmod(int(seconds), 60)
    return f"{m}m {s}s"


# ---------------------------------------------------------------------------
# Step runner
# ---------------------------------------------------------------------------

def run_step(
    step_num: int,
    total_steps: int,
    name: str,
    fn: Callable[..., Any],
    logger: logging.Logger,
    critical: bool = False,
    **kwargs: Any,
) -> StepResult:
    """Run a single pipeline step, measure time, catch exceptions."""

    logger.info("")
    logger.info("=" * 50)
    logger.info("  KROK %d/%d: %s", step_num, total_steps, name)
    logger.info("=" * 50)

    t0 = time.time()
    try:
        result = fn(**kwargs)
        elapsed = time.time() - t0

        # Build detail string from result dict
        if isinstance(result, dict):
            detail = ", ".join(f"{k}: {v}" for k, v in result.items())
        else:
            detail = str(result)

        logger.info("OK — %s (%s)", detail, _format_duration(elapsed))
        return StepResult(name=name, status="OK", duration=elapsed, detail=detail)

    except Exception as exc:
        elapsed = time.time() - t0
        err_msg = f"{type(exc).__name__}: {exc}"
        tb = traceback.format_exc()

        if critical:
            logger.error("FAILED — %s (%s)", err_msg, _format_duration(elapsed))
            logger.debug(tb)
        else:
            logger.warning("FAILED — %s (%s)", err_msg, _format_duration(elapsed))
            logger.debug(tb)

        return StepResult(
            name=name, status="FAILED", duration=elapsed,
            detail=err_msg[:80], error=tb,
        )


# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

def print_summary(results: list[StepResult], total_time: float, logger: logging.Logger) -> None:
    """Print final summary table."""

    ok_count = sum(1 for r in results if r.status == "OK")
    total = len(results)

    logger.info("")
    logger.info("=" * 60)
    logger.info("  SOUHRN PIPELINE")
    logger.info("=" * 60)
    logger.info("  %-22s %-8s %-8s %s", "Krok", "Status", "Trvání", "Detail")
    logger.info("  " + "-" * 56)

    for r in results:
        detail = r.detail[:35] if len(r.detail) > 35 else r.detail
        logger.info(
            "  %-22s %-8s %-8s %s",
            r.name, r.status, _format_duration(r.duration), detail,
        )

    logger.info("  " + "-" * 56)
    logger.info(
        "  Pipeline dokoncena za %s | %d/%d kroku OK",
        _format_duration(total_time), ok_count, total,
    )
    logger.info("=" * 60)


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def run_pipeline(target_date: str, skip_collect: bool, collect_only: bool) -> int:
    """Run the full pipeline. Returns exit code (0 = success)."""

    logger = logging.getLogger("pipeline")
    logger.info("Pipeline start — datum: %s", target_date)

    results: list[StepResult] = []
    t0 = time.time()

    # ------- FÁZE 1: Sběr dat -------
    if skip_collect:
        logger.info("Přeskakuji sběr dat (--skip-collect)")
        for name in ("RSS collector", "Twitter collector", "Reddit collector", "Transcripts"):
            results.append(StepResult(name=name, status="SKIPPED", detail="přeskočeno"))
    else:
        total_steps = 4 if collect_only else 5

        # Krok 1: RSS
        from collectors.rss_collector import run as rss_run
        results.append(run_step(1, total_steps, "RSS collector", rss_run, logger))

        # Krok 2: Twitter (Apify)
        from collectors.twitter_collector import run as twitter_run
        results.append(run_step(2, total_steps, "Twitter collector", twitter_run, logger))

        # Krok 3: Reddit
        from collectors.reddit_collector import run as reddit_run
        results.append(run_step(3, total_steps, "Reddit collector", reddit_run, logger))

        # Krok 4: YouTube transcripts
        from collectors.yt_transcript_collector import run as transcripts_run
        results.append(run_step(4, total_steps, "Transcripts", transcripts_run, logger))

    # ------- FÁZE 2: Generování -------
    if collect_only:
        logger.info("Přeskakuji generování (--collect-only)")
        results.append(StepResult(name="Article generator", status="SKIPPED", detail="přeskočeno"))
    else:
        total_steps = 5 if not skip_collect else 1
        step_num = 5 if not skip_collect else 1

        from generators.article_generator import generate_articles
        results.append(run_step(
            step_num, total_steps, "Article generator",
            generate_articles, logger, critical=True,
            target_date=target_date,
        ))

    # ------- Souhrn -------
    total_time = time.time() - t0
    print_summary(results, total_time, logger)

    # Exit code: 1 if article generation failed
    gen_result = next((r for r in results if r.name == "Article generator"), None)
    if gen_result and gen_result.status == "FAILED":
        return 1
    return 0


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="BNP 2.0 — daily pipeline orchestrator")
    parser.add_argument("--date", type=str, help="Date to process (YYYY-MM-DD), defaults to today")
    parser.add_argument("--skip-collect", action="store_true", help="Skip collectors, generate only")
    parser.add_argument("--collect-only", action="store_true", help="Collect only, skip generation")
    args = parser.parse_args()

    if args.skip_collect and args.collect_only:
        print("ERROR: --skip-collect a --collect-only nelze kombinovat")
        sys.exit(2)

    target_date = args.date or date.today().isoformat()

    setup_logging("pipeline")

    exit_code = run_pipeline(target_date, args.skip_collect, args.collect_only)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
