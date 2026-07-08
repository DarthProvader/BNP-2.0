# Berou nám práci 2.0

> **AI žere svět. My o tom píšeme.**

Plně automatizovaný dvojjazyčný news blog o umělé inteligenci. Každý den bez lidského zásahu nasbírá novinky ze světa AI z desítek zdrojů, zpracuje je pomocí LLM, napíše článek s vlastním názorem a ozdrojováním, publikuje ho na webu a rozešle na sociální sítě.

Projekt je zároveň experiment: **kolik novinářské práce dokáže dnes obstarat AI pipeline sama od sebe** — od sběru dat přes redakční výběr až po publikaci a distribuci.

---

## Co to umí

- 🗞️ **Zero-touch denní pipeline** — jeden příkaz (nebo Windows Task Scheduler) nasbírá data, vygeneruje článek a publikuje ho
- 🌍 **Dvojjazyčnost** — každý článek vzniká v české i anglické verzi (aktuálně 126 + 126 článků)
- 🔎 **Sběr z více zdrojů** — RSS (YouTube, podcasty, AI blogy), Twitter/X, Reddit, FutureTools, YouTube přepisy
- ✍️ **LLM redakce** — filtrování důležitých novinek, psaní článku s názorem, generování komentářů z pohledu různých AI modelů
- 📎 **Ozdrojování** — každé tvrzení má odkaz na originální zdroj
- 📣 **Social autopilot** — po publikaci automatické příspěvky na X a LinkedIn
- ⚡ **Statický web** — Next.js SSG, MDX jako zdroj článků, rychlé a SEO friendly

---

## Architektura

Projekt má dvě oddělené části: **Python pipeline** (běží lokálně / v CI, generuje obsah) a **Next.js web** (renderuje MDX články).

```
┌─────────────────────── DENNÍ PIPELINE (Python) ───────────────────────┐
│                                                                        │
│  1. SBĚR DAT                                                           │
│     ├── RSS collector      → YouTube, podcasty, AI blogy               │
│     ├── Twitter collector  → X účty (přes Apify)                       │
│     ├── Reddit collector   → AI subreddity                             │
│     ├── YT transcripts     → přepisy videí                             │
│     └── FutureTools        → nové AI nástroje (Playwright)             │
│                    │                                                    │
│                    ▼                                                    │
│  2. GENEROVÁNÍ (LLM)                                                    │
│     ├── výběr a prioritizace novinek                                   │
│     ├── článek s vlastním názorem + zdroje                             │
│     ├── komentáře z pohledu různých AI modelů                          │
│     └── výstup: MDX (CZ + EN) s frontmatter metadaty                   │
│                    │                                                    │
│                    ▼                                                    │
│  3. PUBLIKACE                                                          │
│     ├── git commit + push  → web se přebuilduje                        │
│     └── social autopilot   → X + LinkedIn                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────── WEB (Next.js) ─────────────────────────────┐
│  MDX soubory → SSG → statické stránky (listing, detail, resources)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Tech stack

| Vrstva            | Technologie                                              |
| ----------------- | -------------------------------------------------------- |
| **Web**           | Next.js 16 (App Router), React 19, TypeScript, Tailwind 4 |
| **Runtime (web)** | Bun                                                      |
| **Obsah**         | MDX soubory v git repu (`gray-matter`, `react-markdown`) |
| **Pipeline**      | Python 3.12                                              |
| **Sběr dat**      | `feedparser`, Apify, Playwright, `youtube-transcript-api` |
| **LLM**           | Claude Code (orchestrace), Azure OpenAI, Google Vertex AI |
| **Social**        | `tweepy` (X), LinkedIn API                               |
| **Scheduling**    | Windows Task Scheduler / GitHub Actions                  |
| **Hosting**       | Vercel (auto-deploy z gitu)                              |

---

## Struktura repozitáře

```
BNP 2.0/
├── src/
│   ├── app/                    # Next.js App Router (listing, detail, about, resources)
│   ├── components/
│   │   └── themes/             # vizuální témata (brutalist-dark)
│   └── lib/                    # načítání MDX, config, metadata
├── content/
│   └── articles/
│       ├── cs/                 # české články (MDX)
│       └── en/                 # anglické články (MDX)
├── scripts/                    # Python pipeline
│   ├── collectors/             # RSS, Twitter, Reddit, YT transcripts, FutureTools
│   ├── generators/             # výběr novinek, psaní článku, komentáře, MDX zápis
│   ├── social/                 # publikace na X + LinkedIn
│   ├── bridge/                 # most k Claude Code
│   ├── config.yaml             # zdroje dat (RSS feedy, X účty, subreddity)
│   └── run_pipeline.py         # orchestrátor celé pipeline
└── PRD.md                      # původní produktové zadání
```

---

## Struktura článku (MDX)

Každý článek je MDX soubor s frontmatter metadaty:

```mdx
---
title: "Název článku"
date: "2026-07-08"
lang: "cs"
tags: ["openai", "anthropic", "release"]
sources:
  - title: "Originální video"
    url: "https://youtube.com/..."
    type: "youtube"
aiComments:
  - model: "Gemini"
    comment: "Zajímavé je, že..."
---

Obsah článku…
```

---

## Spuštění

### Web

```bash
bun install
bun dev            # http://localhost:3001
bun run build      # produkční build
```

### Pipeline

```bash
cd scripts
python -m venv venv && source venv/bin/activate    # na Windows: venv\Scripts\activate
pip install -r requirements.txt

python run_pipeline.py                  # celá pipeline pro dnešek
python run_pipeline.py --date 2026-07-08
python run_pipeline.py --collect-only   # jen sběr dat
python run_pipeline.py --skip-collect   # jen generování
```

Pipeline vyžaduje credentials předané přes proměnné prostředí (viz `.env`):
`CLAUDE_CODE_OAUTH_TOKEN`, `APIFY_API_TOKEN`, `AZURE_OPENAI_KEY`, `AZURE_OPENAI_ENDPOINT`,
`AZURE_DEPLOYMENT_NAME`, případně Vertex AI service account (`vertexai.json`).

Konfigurace zdrojů dat (RSS feedy, X účty, subreddity) je v [scripts/config.yaml](scripts/config.yaml).

---

## Poznámka k obsahu

Články jsou generované AI a slouží jako demonstrace automatizované content pipeline.
Web je záměrně transparentní v tom, že jde o AI-generovaný obsah. Původní produktové
zadání a rozvahu najdeš v [PRD.md](PRD.md).
