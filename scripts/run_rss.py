#!/usr/bin/env python3
"""Entry point for RSS collection.

Usage:
    python scripts/run_rss.py
"""

import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from collectors.rss_collector import run
from utils import setup_logging


def main() -> None:
    setup_logging("rss")
    logger = logging.getLogger("run_rss")

    logger.info("Starting RSS collection...")
    try:
        stats = run()
        total = sum(stats.values())
        logger.info("Done. Processed %d sources across %d categories.", total, len(stats))
        for cat, count in stats.items():
            logger.info("  %s: %d sources", cat, count)
    except Exception:
        logger.exception("RSS collection failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
