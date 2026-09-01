# Berou nám práci 2.0

> **AI is eating the world. We write about it.**
> *("Berou nám práci" is Czech for "They're taking our jobs.")*

**🌐 Live at [berounampraci.cz](https://berounampraci.cz)**

A fully automated, bilingual news blog about artificial intelligence. Every day, with no human intervention, it collects AI news from dozens of sources, processes them with LLMs, writes an opinionated and fully sourced article, publishes it to the web, and distributes it to social media.

The project is also an experiment: **how much editorial work can an AI pipeline handle on its own today** — from data collection through editorial curation to publishing and distribution.

---

## What it does

- 🗞️ **Zero-touch daily pipeline** — a single command (or Windows Task Scheduler) collects data, generates an article, and publishes it
- 🌍 **Bilingual** — every article is produced in both Czech and English (currently 126 + 126 articles)
- 🔎 **Multi-source collection** — RSS (YouTube, podcasts, AI blogs), Twitter/X, Reddit, FutureTools, YouTube transcripts
- ✍️ **LLM newsroom** — filters the important news, writes an opinionated article, generates commentary from the perspective of different AI models
- 📎 **Sourcing** — every claim links back to its original source
- 📣 **Social autopilot** — automatic posts to X and LinkedIn after publishing
- ⚡ **Static site** — Next.js SSG, MDX as the article source, fast and SEO friendly

---

## Architecture

The project has two separate parts: a **Python pipeline** (runs locally / in CI, generates content) and a **Next.js site** (renders the MDX articles).

```
┌─────────────────────── DAILY PIPELINE (Python) ───────────────────────┐
│                                                                        │
│  1. DATA COLLECTION                                                    │
│     ├── RSS collector      → YouTube, podcasts, AI blogs               │
│     ├── Twitter collector  → X accounts (via Apify)                    │
│     ├── Reddit collector   → AI subreddits                             │
│     ├── YT transcripts     → video transcripts                        │
│     └── FutureTools        → new AI tools (Playwright)                 │
│                    │                                                    │
│                    ▼                                                    │
│  2. GENERATION (LLM)                                                    │
│     ├── news selection & prioritization                               │
│     ├── opinionated article + sources                                 │
│     ├── commentary from different AI models                           │
│     └── output: MDX (CS + EN) with frontmatter metadata               │
│                    │                                                    │
│                    ▼                                                    │
│  3. PUBLISHING                                                         │
│     ├── git commit + push  → site rebuilds                            │
│     └── social autopilot   → X + LinkedIn                             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────── SITE (Next.js) ────────────────────────────┐
│  MDX files → SSG → static pages (listing, detail, resources)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Tech stack

| Layer              | Technology                                               |
| ------------------ | -------------------------------------------------------- |
| **Web**            | Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 |
| **Runtime (web)**  | Bun                                                      |
| **Content**        | MDX files in the git repo (`gray-matter`, `react-markdown`) |
| **Pipeline**       | Python 3.12                                              |
| **Data collection**| `feedparser`, Apify, Playwright, `youtube-transcript-api` |
| **LLM agents**     | Codex CLI, GPT-5.6 Terra                                  |
| **Social**         | `tweepy` (X), LinkedIn API                               |
| **Scheduling**     | Windows Task Scheduler / GitHub Actions                  |
| **Hosting**        | Vercel (auto-deploy from git)                            |

---

## Repository structure

```
BNP 2.0/
├── src/
│   ├── app/                    # Next.js App Router (listing, detail, about, resources)
│   ├── components/
│   │   └── themes/             # visual themes (brutalist-dark)
│   └── lib/                    # MDX loading, config, metadata
├── content/
│   └── articles/
│       ├── cs/                 # Czech articles (MDX)
│       └── en/                 # English articles (MDX)
├── scripts/                    # Python pipeline
│   ├── collectors/             # RSS, Twitter, Reddit, YT transcripts, FutureTools
│   ├── generators/             # news selection, article writing, commentary, MDX writer
│   ├── social/                 # publishing to X + LinkedIn
│   ├── bridge/                 # bridge to Claude Code
│   ├── config.yaml             # data sources (RSS feeds, X accounts, subreddits)
│   └── run_pipeline.py         # orchestrator for the whole pipeline
└── PRD.md                      # original product requirements document
```

---

## Article structure (MDX)

Each article is an MDX file with frontmatter metadata:

```mdx
---
title: "Article title"
date: "2026-07-08"
lang: "en"
tags: ["openai", "anthropic", "release"]
sources:
  - title: "Original video"
    url: "https://youtube.com/..."
    type: "youtube"
aiComments:
  - model: "Gemini"
    comment: "What's interesting is..."
---

Article content…
```

---

## Running the project

### Web

```bash
bun install
bun dev            # http://localhost:3001
bun run build      # production build
```

### Pipeline

```bash
cd scripts
python -m venv venv && source venv/bin/activate    # on Windows: venv\Scripts\activate
pip install -r requirements.txt

python run_codex_daily.py                  # full pipeline for today
python run_codex_daily.py --date 2026-07-08
python run_codex_daily.py --collect-only   # collect data only
python run_codex_daily.py --skip-collect   # generate only
```

The active agent backend requires Codex CLI authenticated in WSL. Collector and
social credentials are passed via environment variables in `scripts/.env`.
The preserved Cursor fallback can still be run with `python run_cursor_daily.py`.

Data source configuration (RSS feeds, X accounts, subreddits) lives in [scripts/config.yaml](scripts/config.yaml).

---

## A note on content

The articles are AI-generated and serve as a demonstration of an automated content pipeline.
The site is intentionally transparent about the fact that the content is AI-generated. The
original product requirements and rationale are in [PRD.md](PRD.md).
