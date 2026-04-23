"""Shared utilities for BNP 2.0 scripts."""

import io
import logging
import sys
from datetime import datetime
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent


def setup_logging(prefix: str) -> None:
    """Configure logging with console + daily rotating file output."""
    log_dir = SCRIPTS_DIR / "logs"
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / f"{prefix}_{datetime.now().strftime('%Y-%m-%d')}.log"

    # Force UTF-8 on stdout to avoid UnicodeEncodeError on Windows (cp1250/ascii)
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, io.UnsupportedOperation):
        sys.stdout = io.TextIOWrapper(
            sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True,
        )

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(log_file, encoding="utf-8"),
        ],
    )
