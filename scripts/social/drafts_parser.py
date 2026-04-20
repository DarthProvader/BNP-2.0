"""Parse drafts.md produced by the social agent.

Format:
    ---
    date: 2026-04-20
    article_url: https://...
    ...
    ---

    ## X

    <tweet 1>
    ---
    <tweet 2>
    ---
    <reply tweet with link>

    ## LinkedIn

    <full post text>
"""

import re
from dataclasses import dataclass
from pathlib import Path

import yaml


@dataclass
class Drafts:
    date: str
    article_url: str
    article_slug: str
    x_thread: list[str]       # List of tweet texts (last one is the reply with link)
    linkedin_post: str


def parse(path: Path) -> Drafts:
    text = path.read_text(encoding="utf-8")

    # Frontmatter
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", text, re.DOTALL)
    if not fm_match:
        raise ValueError(f"Missing YAML frontmatter in {path}")
    meta = yaml.safe_load(fm_match.group(1))
    body = fm_match.group(2)

    # Split sections by `## `
    sections = re.split(r"^##\s+", body, flags=re.MULTILINE)
    x_text, li_text = "", ""
    for sec in sections:
        if not sec.strip():
            continue
        head, _, content = sec.partition("\n")
        head = head.strip().lower()
        if head == "x":
            x_text = content.strip()
        elif head == "linkedin":
            li_text = content.strip()

    if not x_text or not li_text:
        raise ValueError(f"Missing ## X or ## LinkedIn section in {path}")

    # Tweets separated by lines containing only `---`
    tweets = [t.strip() for t in re.split(r"\n\s*---\s*\n", x_text) if t.strip()]

    return Drafts(
        date=str(meta.get("date", "")),
        article_url=str(meta.get("article_url", "")),
        article_slug=str(meta.get("article_slug", "")),
        x_thread=tweets,
        linkedin_post=li_text,
    )
