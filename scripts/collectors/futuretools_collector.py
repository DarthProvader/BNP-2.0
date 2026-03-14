"""FutureTools.io news collector for BNP 2.0.

Scrapes https://futuretools.io/news using Playwright.
Hovers over each article to extract preview summaries (including paywalled content).
Saves raw JSON to content/raw/blogs/.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = SCRIPTS_DIR.parent / "content" / "raw" / "blogs"
CHECKPOINT_FILE = ".last_fetch.json"
NEWS_URL = "https://futuretools.io/news"


def _load_checkpoint() -> dict:
    cp_path = SCRIPTS_DIR / CHECKPOINT_FILE
    if cp_path.exists():
        with open(cp_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_checkpoint(checkpoint: dict) -> None:
    cp_path = SCRIPTS_DIR / CHECKPOINT_FILE
    with open(cp_path, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, indent=2)


def _parse_date_heading(text: str) -> str | None:
    """Parse date from heading like 'Yesterday — Friday, March 13, 2026' or 'Tuesday, March 10, 2026'."""
    # Remove "Yesterday — " or "Today — " prefix
    cleaned = re.sub(r"^(Yesterday|Today)\s*[—–-]\s*", "", text.strip())
    # Try parsing "Friday, March 13, 2026"
    for fmt in ("%A, %B %d, %Y", "%B %d, %Y"):
        try:
            dt = datetime.strptime(cleaned, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def run(cutoff_days: int = 2) -> dict:
    """Scrape FutureTools.io news page and save items as JSON.

    Args:
        cutoff_days: Only collect articles from the last N days.

    Returns:
        Summary stats dict.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        logger.error("playwright not installed. Run: pip install playwright && playwright install chromium")
        return {"error": "playwright not installed"}

    cutoff_date = (datetime.now(timezone.utc) - timedelta(days=cutoff_days)).strftime("%Y-%m-%d")
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    logger.info("Scraping FutureTools.io news (cutoff: %s)...", cutoff_date)

    items = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(NEWS_URL, wait_until="networkidle", timeout=30000)

        # Find all day sections — each has an h2 with the date
        day_headings = page.query_selector_all("h2")

        for heading in day_headings:
            heading_text = heading.inner_text().strip()
            day_date = _parse_date_heading(heading_text)

            if not day_date:
                continue

            if day_date < cutoff_date:
                logger.info("  Reached cutoff date at %s, stopping.", day_date)
                break

            logger.info("  Processing %s...", day_date)

            # Get the parent container and find all article links within it
            parent = heading.evaluate_handle("el => el.parentElement")
            links = parent.query_selector_all("a[href]")

            for link in links:
                try:
                    title_el = link.query_selector("p:first-child")
                    source_el = link.query_selector("p:last-child")

                    if not title_el:
                        continue

                    title = title_el.inner_text().strip()
                    source_domain = source_el.inner_text().strip() if source_el else ""
                    url = link.get_attribute("href") or ""
                    is_paywalled = "Paywalled" in source_domain

                    if is_paywalled:
                        source_domain = source_domain.replace("Paywalled", "").strip()

                    # Hover to get preview summary
                    summary = ""
                    try:
                        link.hover()
                        page.wait_for_timeout(300)

                        # Look for the tooltip/popup that appears on hover
                        popup = page.query_selector("[class*='tooltip'], [class*='popup'], [class*='preview']")
                        if not popup:
                            # Try finding a newly visible element near the link
                            popups = link.evaluate_handle(
                                "el => el.parentElement.querySelector('div:not([class*=\"link\"])')  || el.closest('div').querySelector('p:last-of-type')"
                            )
                            if popups:
                                popup_text = popups.evaluate("el => el ? el.innerText : ''")
                                if popup_text and len(popup_text) > len(title):
                                    summary = popup_text.strip()

                        if not summary:
                            # Alternative: look for any paragraph that appeared after hover
                            sibling_div = link.evaluate_handle(
                                "el => el.nextElementSibling || el.parentElement.nextElementSibling"
                            )
                            if sibling_div:
                                text = sibling_div.evaluate("el => el ? el.innerText : ''")
                                if text and len(text) > 20 and text != title:
                                    # Extract just the summary paragraph
                                    lines = text.strip().split("\n")
                                    for line in lines:
                                        line = line.strip()
                                        if len(line) > 50 and line != title and line != source_domain:
                                            summary = line
                                            break
                    except Exception as e:
                        logger.debug("  Hover failed for %s: %s", title[:40], e)

                    items.append({
                        "title": title,
                        "url": url,
                        "source": source_domain,
                        "date": day_date,
                        "paywalled": is_paywalled,
                        "summary": summary,
                    })

                except Exception as e:
                    logger.debug("  Failed to process a link: %s", e)

        browser.close()

    logger.info("Collected %d items from FutureTools.io", len(items))

    if not items:
        return {"futuretools": 0}

    # Save to output
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_data = {
        "source_type": "blogs",
        "source_name": "FutureTools.io",
        "source_slug": "futuretools",
        "source_url": NEWS_URL,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "items": items,
    }

    output_file = OUTPUT_DIR / f"{today_str}_futuretools.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    logger.info("Saved %d items to %s", len(items), output_file.name)

    # Update checkpoint
    checkpoint = _load_checkpoint()
    checkpoint["blogs/futuretools"] = datetime.now(timezone.utc).isoformat()
    _save_checkpoint(checkpoint)

    return {"futuretools": len(items)}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    stats = run()
    print(f"Done: {stats}")
