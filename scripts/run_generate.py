#!/usr/bin/env python3
"""Entry point for article generation.

Usage:
    python scripts/run_generate.py                    # today's date
    python scripts/run_generate.py --date 2026-03-03  # specific date
"""

import argparse
import logging
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from generators.article_generator import generate_articles
from utils import setup_logging


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate daily article from raw data")
    parser.add_argument("--date", type=str, help="Date to process (YYYY-MM-DD), defaults to today")
    args = parser.parse_args()

    target_date = args.date or date.today().isoformat()

    setup_logging("generate")
    logger = logging.getLogger("run_generate")

    logger.info("Generating article for %s...", target_date)
    try:
        result = generate_articles(target_date)
        logger.info("Done! Generated article: %s", result["slug"])
        logger.info("  CS: %s", result["cs"])
        logger.info("  EN: %s", result["en"])
    except Exception:
        logger.exception("Article generation failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
