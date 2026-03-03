#!/usr/bin/env python3
"""Entry point for Reddit collection.

Usage:
    python scripts/run_reddit.py                    # collect all configured subreddits
    python scripts/run_reddit.py --sub singularity  # collect single subreddit
"""

import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from collectors.reddit_collector import run
from utils import setup_logging


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect posts from Reddit")
    parser.add_argument("--sub", type=str, help="Single subreddit to collect (e.g. singularity)")
    args = parser.parse_args()

    setup_logging("reddit")
    logger = logging.getLogger("run_reddit")

    logger.info("Starting Reddit collection...")
    try:
        stats = run(single_sub=args.sub)
        for cat, count in stats.items():
            logger.info("  %s: %d subreddits processed", cat, count)
    except Exception:
        logger.exception("Reddit collection failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
