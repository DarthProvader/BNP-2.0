"""YouTube transcript collector for BNP 2.0.

Reads existing YouTube JSON files from content/raw/youtube/,
fetches transcripts via youtube-transcript-api, and enriches
the JSON items with transcript text.
"""

from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from youtube_transcript_api import YouTubeTranscriptApi

logger = logging.getLogger(__name__)

# Reuse a single API instance across all calls
_ytt = YouTubeTranscriptApi()


def extract_video_id(url: str) -> str | None:
    """Extract YouTube video ID from various URL formats."""
    parsed = urlparse(url)
    if parsed.hostname in ("www.youtube.com", "youtube.com"):
        # /watch?v=ID
        qs = parse_qs(parsed.query)
        vid = qs.get("v", [None])[0]
        if vid:
            return vid
        # /shorts/ID
        m = re.match(r"^/shorts/([a-zA-Z0-9_-]+)", parsed.path)
        if m:
            return m.group(1)
    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/")
    return None


def fetch_transcript(video_id: str) -> tuple[str, str] | None:
    """Fetch transcript for a video. Returns (text, lang) or None."""
    try:
        # Try English first, then any available language
        transcript = _ytt.fetch(video_id, languages=["en"])
        text = " ".join(snippet.text for snippet in transcript)
        return text, "en"
    except Exception as en_err:
        logger.debug("No English transcript for %s: %s", video_id, en_err)

    try:
        transcript = _ytt.fetch(video_id)
        lang = transcript.language if hasattr(transcript, "language") else "auto"
        text = " ".join(snippet.text for snippet in transcript)
        return text, lang
    except Exception as e:
        logger.warning("No transcript for %s: %s", video_id, e)
        return None


def enrich_file(json_path: Path) -> int:
    """Enrich a single YouTube JSON file with transcripts.
    Returns number of transcripts added."""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    added = 0
    items = data.get("items", [])

    for item in items:
        # Skip if already attempted (key present — even if None means "no transcript available")
        if "transcript" in item:
            logger.info("  Skipping %s (already processed)", item.get("title", "?")[:50])
            continue

        video_id = extract_video_id(item.get("url", ""))
        if not video_id:
            logger.warning("  Could not extract video ID from: %s", item.get("url", ""))
            continue

        logger.info("  Fetching transcript for: %s (%s)", item.get("title", "?")[:50], video_id)
        result = fetch_transcript(video_id)

        if result:
            text, lang = result
            item["transcript"] = text
            item["transcript_lang"] = lang
            added += 1
            logger.info("    -> Got %d chars (%s)", len(text), lang)
        else:
            item["transcript"] = None
            item["transcript_lang"] = None

    if added > 0:
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    return added


def run(youtube_dir: Path | None = None) -> dict:
    """Main entry point. Returns summary stats."""
    if youtube_dir is None:
        scripts_dir = Path(__file__).resolve().parent.parent
        youtube_dir = scripts_dir.parent / "content" / "raw" / "youtube"

    if not youtube_dir.exists():
        logger.warning("YouTube directory not found: %s", youtube_dir)
        return {"files": 0, "transcripts_added": 0}

    json_files = sorted(youtube_dir.glob("*.json"))
    if not json_files:
        logger.info("No YouTube JSON files found")
        return {"files": 0, "transcripts_added": 0}

    total_added = 0
    for json_path in json_files:
        logger.info("Processing: %s", json_path.name)
        added = enrich_file(json_path)
        total_added += added

    return {"files": len(json_files), "transcripts_added": total_added}
