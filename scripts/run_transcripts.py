#!/usr/bin/env python3
"""Entry point for YouTube transcript collection.

Usage:
    python scripts/run_transcripts.py                # enrich all YouTube JSONs
    python scripts/run_transcripts.py --video-id ID  # test single video
"""

import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from collectors.yt_transcript_collector import fetch_transcript, run
from utils import setup_logging


def main() -> None:
    parser = argparse.ArgumentParser(description="YouTube transcript collector")
    parser.add_argument("--video-id", help="Test single video ID")
    args = parser.parse_args()

    setup_logging("transcripts")
    logger = logging.getLogger("run_transcripts")

    if args.video_id:
        logger.info("Testing single video: %s", args.video_id)
        result = fetch_transcript(args.video_id)
        if result:
            text, lang = result
            logger.info("Transcript (%s): %d chars", lang, len(text))
            print(text[:500] + "..." if len(text) > 500 else text)
        else:
            logger.error("No transcript found")
            sys.exit(1)
        return

    logger.info("Starting YouTube transcript collection...")
    try:
        stats = run()
        logger.info(
            "Done. Processed %d files, added %d transcripts.",
            stats["files"],
            stats["transcripts_added"],
        )
    except Exception:
        logger.exception("Transcript collection failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
