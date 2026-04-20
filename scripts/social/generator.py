"""Generate X + LinkedIn drafts from a published MDX article.

Uses ClaudeBridge (same pattern as article_generator.py) to call Claude in
headless print mode. No interactive session, no Discord plugin — pure
subprocess call.

Output: content/social/YYYY-MM-DD/drafts.md (frontmatter + ## X + ## LinkedIn).
"""

from __future__ import annotations

import logging
import re
from pathlib import Path

import yaml

from bridge.claude_bridge import ClaudeBridge

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
ARTICLES_DIR = PROJECT_ROOT / "content" / "articles" / "cs"
SOCIAL_DIR = PROJECT_ROOT / "content" / "social"
SITE_BASE_URL = "https://berounampraci.cz"


def _find_article(target_date: str) -> Path:
    """Find the CS MDX file whose frontmatter `date` matches target_date."""
    for path in ARTICLES_DIR.glob("*.mdx"):
        head = path.read_text(encoding="utf-8")[:500]
        if re.search(rf"date:\s*['\"]?{re.escape(target_date)}", head):
            return path
    raise FileNotFoundError(f"Žádný článek s date: {target_date} v {ARTICLES_DIR}")


def _build_prompt(article_text: str) -> str:
    return f"""Jsi copywriter pro AI news blog "Berou nám práci" (cs). Dostaneš celý MDX článek a vygeneruješ z něj dva sociální posty.

## Výstup — **striktní formát**, jinak parser selže

```
===X_THREAD===
<tweet 1>
---
<tweet 2>
---
<tweet 3>
---
<poslední tweet s hashtagy>
===LINKEDIN===
<celý LinkedIn post, jeden blok textu>
===END===
```

## Pravidla pro X thread
- 5-8 tweetů, každý MAX 280 znaků (opravdu počítej diakritiku + emoji).
- Hlavní tweet (první) = hook. **Nesmí obsahovat externí link.**
- Tweety 2-N: jedna myšlenka na tweet, rozbaluje klíčové body článku.
- Poslední tweet = hashtagy (max 3, relevantní: #AI, #AINews, #LLM apod.). Žádný link.
- Tón: jako článek — ironický, ale věcný. Žádné buzzwordy typu "game-changer".
- Oddělovač mezi tweety je samostatný řádek `---`.

## Pravidla pro LinkedIn
- 1500-2500 znaků.
- Hook v prvním odstavci (3 věty max, musí přežít „see more" cutoff).
- Struktura: úvod → 3 konkrétní takeaways (✓, →, 📌 nebo podobné) → závěrečná otázka.
- NE**dávej** link na článek do textu. Publisher ho automaticky připojí na konec.
- 5-10 hashtagů na konci (#AI #MachineLearning #TechNews apod.).
- Čeština s diakritikou.

## Article (MDX)

{article_text}

Napiš výstup přesně v tom formátu výše, bez dalšího komentáře."""


def _parse_sections(response: str) -> tuple[list[str], str]:
    """Extract X thread (list of tweets) and LinkedIn post from Claude's response."""
    x_match = re.search(r"===X_THREAD===\s*\n(.*?)(?====LINKEDIN===)", response, re.DOTALL)
    li_match = re.search(r"===LINKEDIN===\s*\n(.*?)(?====END===|$)", response, re.DOTALL)

    if not x_match or not li_match:
        raise ValueError(
            "Claude nevrátil očekávané sekce ===X_THREAD=== / ===LINKEDIN===.\n"
            f"První 500 znaků odpovědi:\n{response[:500]}"
        )

    x_raw = x_match.group(1).strip()
    tweets = [t.strip() for t in re.split(r"\n\s*---\s*\n", x_raw) if t.strip()]
    linkedin = li_match.group(1).strip()

    if len(tweets) < 2:
        raise ValueError(f"X thread má jen {len(tweets)} tweet(y), čekal jsem 5-8.")
    too_long = [(i, t) for i, t in enumerate(tweets, 1) if len(t) > 280]
    if too_long:
        raise ValueError(
            "Některé tweety přesahují 280 znaků: "
            + ", ".join(f"#{i} ({len(t)} zn.)" for i, t in too_long)
        )

    return tweets, linkedin


def _write_drafts(target_date: str, article_slug: str, tweets: list[str], linkedin: str) -> Path:
    day_dir = SOCIAL_DIR / target_date
    day_dir.mkdir(parents=True, exist_ok=True)
    drafts_path = day_dir / "drafts.md"

    frontmatter = {
        "date": target_date,
        "article_slug": article_slug,
        "article_url": f"{SITE_BASE_URL}/{article_slug}",
        "status": "draft",
    }
    body = "---\n" + yaml.safe_dump(frontmatter, allow_unicode=True, sort_keys=False) + "---\n\n"
    body += "## X\n\n" + "\n---\n".join(tweets) + "\n\n"
    body += "## LinkedIn\n\n" + linkedin + "\n"

    drafts_path.write_text(body, encoding="utf-8")
    logger.info("Drafts zapsány do %s", drafts_path.relative_to(PROJECT_ROOT))
    return drafts_path


def generate_drafts(target_date: str) -> Path:
    """Main entry — find article, call Claude, write drafts.md. Return path."""
    article_path = _find_article(target_date)
    article_slug = article_path.stem
    logger.info("Generuji sociální drafty pro %s (%s)", target_date, article_slug)

    article_text = article_path.read_text(encoding="utf-8")
    prompt = _build_prompt(article_text)

    bridge = ClaudeBridge(agent_dir=PROJECT_ROOT, model="sonnet")
    result = bridge.send(prompt)
    if not result.success:
        raise RuntimeError(f"Claude CLI selhal (exit {result.exit_code}): {result.stderr[:400]}")

    tweets, linkedin = _parse_sections(result.response_text)
    return _write_drafts(target_date, article_slug, tweets, linkedin)
