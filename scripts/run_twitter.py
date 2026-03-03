#!/usr/bin/env python3
"""Entry point for Twitter/X collection.

Usage:
    python scripts/run_twitter.py              # collect all configured accounts
    python scripts/run_twitter.py --handle sama  # collect single account
"""

import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from collectors.twitter_collector import run
from utils import setup_logging


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect tweets from X/Twitter")
    parser.add_argument("--handle", type=str, help="Single handle to collect (e.g. sama)")
    args = parser.parse_args()

    setup_logging("twitter")
    logger = logging.getLogger("run_twitter")

    logger.info("Starting Twitter collection...")
    try:
        stats = run(single_handle=args.handle)
        for cat, count in stats.items():
            logger.info("  %s: %d accounts processed", cat, count)
    except Exception:
        logger.exception("Twitter collection failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
