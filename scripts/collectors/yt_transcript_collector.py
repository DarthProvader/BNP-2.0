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

# Scheduled live streams have no transcript yet but get one later, so give a
# video a few runs before writing it off for good.
MAX_TRANSCRIPT_ATTEMPTS = 3


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


def _pick_transcript(listing):
    """Prefer a human English track, then auto English, then anything at all."""
    for finder in (
        lambda: listing.find_manually_created_transcript(["en"]),
        lambda: listing.find_generated_transcript(["en"]),
    ):
        try:
            return finder()
        except Exception:
            continue

    available = list(listing)
    if not available:
        return None

    # Many uploads only expose an auto track in the viewer's locale; those are
    # usually translatable back to English.
    chosen = available[0]
    if getattr(chosen, "is_translatable", False):
        codes = {t.language_code for t in getattr(chosen, "translation_languages", [])}
        if "en" in codes:
            try:
                return chosen.translate("en")
            except Exception:
                pass
    return chosen


def fetch_transcript(video_id: str) -> tuple[str, str] | None:
    """Fetch transcript for a video. Returns (text, lang) or None."""
    try:
        listing = _ytt.list(video_id)
    except Exception as e:
        logger.warning("No transcript list for %s: %s", video_id, e)
        return None

    transcript = _pick_transcript(listing)
    if transcript is None:
        logger.warning("No transcript tracks for %s", video_id)
        return None

    lang = getattr(transcript, "language_code", "auto")
    try:
        fetched = transcript.fetch()
    except Exception as e:
        logger.warning("Transcript fetch failed for %s (%s): %s", video_id, lang, e)
        return None

    text = " ".join(snippet.text for snippet in fetched)
    if not text.strip():
        logger.warning("Empty transcript for %s (%s)", video_id, lang)
        return None
    return text, lang


def enrich_file(json_path: Path) -> int:
    """Enrich a single YouTube JSON file with transcripts.
    Returns number of transcripts added."""
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    added = 0
    changed = False
    items = data.get("items", [])

    for item in items:
        if item.get("transcript"):
            logger.info("  Skipping %s (already processed)", item.get("title", "?")[:50])
            continue

        attempts = item.get("transcript_attempts", 0)
        if "transcript" in item and attempts >= MAX_TRANSCRIPT_ATTEMPTS:
            logger.info(
                "  Skipping %s (no transcript after %d attempts)",
                item.get("title", "?")[:50],
                attempts,
            )
            continue

        video_id = extract_video_id(item.get("url", ""))
        if not video_id:
            logger.warning("  Could not extract video ID from: %s", item.get("url", ""))
            continue

        logger.info("  Fetching transcript for: %s (%s)", item.get("title", "?")[:50], video_id)
        result = fetch_transcript(video_id)
        changed = True

        if result:
            text, lang = result
            item["transcript"] = text
            item["transcript_lang"] = lang
            item.pop("transcript_attempts", None)
            added += 1
            logger.info("    -> Got %d chars (%s)", len(text), lang)
        else:
            item["transcript"] = None
            item["transcript_lang"] = None
            item["transcript_attempts"] = attempts + 1

    # Persist failures too, otherwise the same videos are retried on every run.
    if changed:
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
