# PRD: Berou nám práci 2.0

## 1. Přehled projektu

**Název:** Berou nám práci 2.0
**Typ:** Automatizovaný AI news blog
**Popis:** Webová aplikace, která každý den automaticky sbírá novinky ze světa AI z různých zdrojů (YouTube, podcasty, X/Twitter, weby), zpracuje je pomocí LLM a publikuje článek s vlastním názorem a zdroji.

---

## 2. Cíle

- Automatizovat denní sběr AI novinek z více zdrojů
- Generovat kvalitní články s vlastním názorem LLM a ozdrojováním
- Minimalizovat manuální práci — ideálně zero-touch pipeline
- Poskytnout uživatelům přehledný web s filtrováním a kategorizací

---

## 3. Tech stack

| Komponenta      | Technologie                          |
| --------------- | ------------------------------------ |
| Runtime         | Bun                                  |
| Framework       | Next.js (React)                      |
| Styling         | Tailwind CSS                         |
| Úložiště článků | MDX soubory v git repu               |
| Hosting         | Vercel (auto-deploy z gitu)          |
| Sběr dat (RSS)  | Bun skript (RSS parser)              |
| Sběr dat (X)    | Claude Code + Playwright MCP         |
| LLM             | Claude Code (lokálně na PC)          |
| Jazyky          | CZ + EN (přepínání na webu)          |
| Scheduling      | Windows Task Scheduler               |

---

## 4. Architektura

### 4.1 Denní pipeline (lokálně na PC)

```
[Windows Task Scheduler] — 1x denně
        │
        ▼
[1. Sběr dat - Bun skript]
  └── RSS feedy → YouTube kanály, podcasty, AI weby/blogy
        │
        ▼
[2. Sběr dat - Claude Code + Playwright MCP]
  └── Claude Code dostane instrukci: "Projdi tyto X účty přes Playwright,
      zapiš si odkazy a důležité info"
  └── Claude Code sám ovládá prohlížeč, čte tweety, dělá si poznámky
        │
        ▼
[3. Zpracování - Claude Code]
  ├── Spojí data z RSS + X/Twitter
  ├── Filtrování důležitých novinek
  ├── Přelouskání obsahu (YT přepisy, podcasty)
  ├── Generování článku s vlastním názorem + zdroje
  ├── Generování komentářů z pohledu dalších AI modelů
  └── Vygeneruje článek 2x: jednou CZ, jednou EN
        │
        ▼
[4. Publikace]
  ├── Uložení článků jako MDX soubory (CZ + EN verze)
  ├── git commit + push
  └── Vercel automaticky rebuildne web
```

### 4.2 Web (Vercel)

```
[Vercel] ← auto-deploy při push
    │
    ├── Next.js SSG/ISR
    ├── MDX soubory jako zdroj článků
    └── Statické stránky (rychlé, SEO friendly)
```

---

## 5. Zdroje dat

### 5.1 YouTube (RSS — zdarma)

- Formát URL: `https://www.youtube.com/feeds/videos.xml?channel_id=...`
- Příklady kanálů: Matt Wolfe, AI Explained, Theo, Fireship, AI Advantage
- Metoda: RSS parser v Bun skriptu

### 5.2 Podcasty (RSS — zdarma)

- Příklady: Lex Fridman, Latent Space, Fantastic Future
- Metoda: RSS parser v Bun skriptu

### 5.3 AI weby a blogy (RSS — zdarma)

- Příklady: The Verge AI, TechCrunch AI, Ars Technica, OpenAI blog, ANthropic blog
- Metoda: RSS parser v Bun skriptu

### 5.4 X/Twitter (Claude Code + Playwright MCP — zdarma, s rizikem)

- Metoda: Claude Code přímo ovládá prohlížeč přes Playwright MCP
- Claude Code dostane prompt s instrukcemi: které účty projít, co hledat
- Sám naviguje na X, přihlásí se, prochází účty, čte tweety, dělá si poznámky
- Účet: Sekundární X účet (ne hlavní)
- Frekvence: 1x denně, low-volume (5-10 účtů)
- Rizika: Potenciální ban účtu, X mění DOM každé 2-4 týdny
- Mitigace: Headed mode, domácí IP, normální pauzy, sekundární účet

#### Nápad / další experiment

- Prověřit, jestli nově dostupné X MCP nejde použít jako jednotnou vrstvu pro sběr i publikaci místo současné kombinace Nitter RSS pro scraping a Tweepy/API pro postování.
- Potenciální přínosy: méně různých integrací, méně custom glue kódu, menší závislost na křehkém scrapingu a jednodušší operator workflow.
- Co ověřit v PoC: stabilita MCP, jaké akce opravdu podporuje (read/search/post/thread), limity/rate limiting, potřeba přihlášení, auditovatelnost výstupů a fallback když MCP selže.
- Doporučení: držet stávající collector/poster jako fallback, dokud MCP neprojde pár týdnů reálného provozu.

---

## 6. Zpracování obsahu (LLM)

### 6.1 Filtrování

- LLM projde sesbíraná data a vyfiltruje nejdůležitější/nejzajímavější novinky

### 6.2 Analýza obsahu

- YouTube videa: Přepisy přes YouTube API / Whisper / NotebookLM
- Podcasty: Přepisy přes Whisper / NotebookLM
- Články/tweety: Přímé zpracování textu

### 6.3 Generování článku

- LLM napíše článek s vlastním názorem
- Všechny zdroje ozdrojovány (odkaz na originál)
- Formát: MDX s frontmatter metadaty (datum, tagy, zdroje, autor)

### 6.4 Komentáře AI modelů

- Další LLM modely přidají svůj komentář/pohled na novinky
- Prezentováno jako "názory" různých AI modelů

---

## 7. Struktura MDX článku

Každý článek existuje ve dvou verzích (CZ + EN):

```mdx
# content/articles/cs/2026-03-01-ai-news.mdx
---
title: "Název článku"
date: "2026-03-01"
lang: "cs"
slug: "ai-news-2026-03-01"
tags: ["openai", "llm", "release"]
sources:
  - title: "Originální video"
    url: "https://youtube.com/..."
    type: "youtube"
  - title: "Tweet od @sama"
    url: "https://x.com/..."
    type: "twitter"
aiComments:
  - model: "GPT-4o"
    comment: "Z mého pohledu..."
  - model: "Gemini"
    comment: "Zajímavé je, že..."
---

Obsah článku v češtině...
```

```mdx
# content/articles/en/2026-03-01-ai-news.mdx
---
title: "Article title"
date: "2026-03-01"
lang: "en"
slug: "ai-news-2026-03-01"
tags: ["openai", "llm", "release"]
sources: ...
aiComments:
  - model: "GPT-4o"
    comment: "From my perspective..."
  - model: "Gemini"
    comment: "What's interesting is..."
---

Article content in English...
```

---

## 8. Stránky webu

### 8.1 Hlavní stránka (seznam článků)

- Seznam článků seřazený od nejnovějšího
- Sidebar nebo horní filtr podle tagů
- Náhled článku (titulek, datum, krátký popis, tagy)
- Responzivní design
- Přepínač jazyka CZ/EN

### 8.2 Detail článku

- Plný text článku
- Seznam zdrojů s odkazy
- Komentáře AI modelů (každý model se svým avatarem/logem)
- Přepínač jazyka CZ/EN

### 8.3 Resources

- Kurátorský seznam AI nástrojů a odkazů
- Kategorizace podle typu (chatboty, generování obrázků, kódování, atd.)

### 8.4 O projektu

- Vysvětlení jak web funguje
- Popis pipeline (sběr → zpracování → publikace)
- Transparentnost — web je generován AI

---

## 9. Struktura projektu

```
BNP 2.0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Hlavní stránka (seznam článků)
│   │   ├── article/[slug]/     # Detail článku
│   │   ├── resources/          # Resources stránka
│   │   └── about/              # O projektu
│   ├── components/             # React komponenty
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── TagFilter.tsx
│   │   ├── AIComment.tsx
│   │   ├── SourceList.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── Layout.tsx
│   └── lib/                    # Utility funkce
│       ├── mdx.ts              # Načítání MDX souborů
│       └── types.ts            # TypeScript typy
├── content/
│   └── articles/
│       ├── cs/                 # České články
│       │   ├── 2026-03-01-ai-news.mdx
│       │   └── ...
│       └── en/                 # Anglické články
│           ├── 2026-03-01-ai-news.mdx
│           └── ...
├── scripts/
│   ├── collect.ts              # Sběr dat z RSS + Playwright
│   ├── generate.ts             # Generování článku přes LLM
│   └── publish.ts              # Git commit + push
├── public/                     # Statické assety
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── PRD.md
```

---

## 10. Fáze implementace

### Fáze 1 — Základ webu

- [ ] Inicializace Next.js + Bun + Tailwind
- [ ] Layout a navigace
- [ ] Hlavní stránka se seznamem článků
- [ ] Detail článku (MDX rendering)
- [ ] Testovací články (manuálně napsané MDX)

### Fáze 2 — Sběr dat

- [ ] RSS parser skript (YouTube, podcasty, weby)
- [ ] Claude Code prompt/instrukce pro Playwright MCP sběr z X/Twitter
- [ ] Sloučení dat do jednotného formátu

### Fáze 3 — LLM pipeline

- [ ] Integrace Claude Code pro zpracování
- [ ] Filtrování a prioritizace novinek
- [ ] Generování článku ve dvou jazycích (CZ + EN MDX výstup)
- [ ] Generování komentářů AI modelů

### Fáze 4 — Automatizace

- [ ] Publish skript (git commit + push)
- [ ] Windows Task Scheduler nastavení
- [ ] End-to-end test pipeline

### Fáze 5 — Doladění

- [ ] Stránka Resources
- [ ] Stránka O projektu
- [ ] SEO optimalizace
- [ ] Design a UX polish
- [ ] Deploy na Vercel

---

## 11. Rizika a mitigace

| Riziko                          | Dopad                                 | Mitigace                                         |
| ------------------------------- | ------------------------------------- | ------------------------------------------------ |
| X/Twitter ban účtu              | Ztráta jednoho zdroje dat             | Sekundární účet, low-volume, headed mode         |
| X mění DOM strukturu            | Playwright skripty přestanou fungovat | Údržba selektorů, fallback na jiné zdroje        |
| LLM generuje nepřesné informace | Špatná kvalita článků                 | Ozdrojování, human review možnost                |
| PC není zapnuté                 | Pipeline neproběhne                   | Manuální spuštění, případně záložní cloud řešení |
| Vercel free tier limity         | Build selhání                         | Monitoring, případně upgrade                     |

---

## 12. Budoucí rozšíření (nice-to-have)

- Newsletter (automatický email s denním shrnutím)
- RSS feed vlastního webu
- Vyhledávání v článcích
- Statistiky čtenosti
- Uživatelské komentáře
- Další jazyky (DE, ES, ...)
- GitHub Actions jako záložní scheduling
