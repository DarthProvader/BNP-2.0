"use client";

import React from "react";
import Link from "next/link";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

/* ─── Data Types ─── */

interface Resource {
  name: string;
  url: string;
  descriptionCs: string;
  descriptionEn: string;
  category: "llm" | "code" | "image" | "productivity" | "search";
}

interface Company {
  name: string;
  url: string;
  focus: string;
}

interface MediaResource {
  name: string;
  url: string;
  type: "newsletter" | "podcast" | "youtube" | "blog";
  descriptionCs: string;
  descriptionEn: string;
}

/* ─── Data ─── */

const aiTools: Resource[] = [
  { name: "ChatGPT", url: "https://chat.openai.com", category: "llm", descriptionCs: "Nejrozšířenější LLM chatbot", descriptionEn: "Most popular LLM chatbot" },
  { name: "Claude", url: "https://claude.ai", category: "llm", descriptionCs: "AI asistent od Anthropic", descriptionEn: "AI assistant by Anthropic" },
  { name: "Gemini", url: "https://gemini.google.com", category: "llm", descriptionCs: "Google AI s přístupem k Search", descriptionEn: "Google AI with Search access" },
  { name: "Perplexity", url: "https://perplexity.ai", category: "search", descriptionCs: "AI-powered vyhledávač", descriptionEn: "AI-powered search engine" },
  { name: "GitHub Copilot", url: "https://github.com/features/copilot", category: "code", descriptionCs: "AI pair programmer v editoru", descriptionEn: "AI pair programmer in your editor" },
  { name: "Cursor", url: "https://cursor.com", category: "code", descriptionCs: "AI-first code editor", descriptionEn: "AI-first code editor" },
  { name: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code", category: "code", descriptionCs: "CLI nástroj pro kódování s AI", descriptionEn: "CLI tool for AI-powered coding" },
  { name: "Midjourney", url: "https://midjourney.com", category: "image", descriptionCs: "Generování obrázků pomocí AI", descriptionEn: "AI image generation" },
  { name: "Sora", url: "https://sora.com", category: "image", descriptionCs: "Generování videa od OpenAI", descriptionEn: "Video generation by OpenAI" },
  { name: "NotebookLM", url: "https://notebooklm.google.com", category: "productivity", descriptionCs: "AI notebook od Google", descriptionEn: "AI notebook by Google" },
  { name: "Bolt", url: "https://bolt.new", category: "code", descriptionCs: "AI full-stack app builder", descriptionEn: "AI full-stack app builder" },
  { name: "v0", url: "https://v0.dev", category: "code", descriptionCs: "AI UI generátor od Vercel", descriptionEn: "AI UI generator by Vercel" },
];

const companies: Company[] = [
  { name: "OpenAI", url: "https://openai.com", focus: "GPT, ChatGPT, Sora, DALL-E" },
  { name: "Anthropic", url: "https://anthropic.com", focus: "Claude, Constitutional AI" },
  { name: "Google DeepMind", url: "https://deepmind.google", focus: "Gemini, AlphaFold" },
  { name: "Meta AI", url: "https://ai.meta.com", focus: "Llama, Open Source AI" },
  { name: "NVIDIA", url: "https://nvidia.com", focus: "GPU, CUDA, AI hardware" },
  { name: "Mistral AI", url: "https://mistral.ai", focus: "Open-weight European LLMs" },
  { name: "xAI", url: "https://x.ai", focus: "Grok" },
  { name: "Stability AI", url: "https://stability.ai", focus: "Stable Diffusion" },
];

const media: MediaResource[] = [
  { name: "The Batch", url: "https://www.deeplearning.ai/the-batch/", type: "newsletter", descriptionCs: "Týdenník od Andrew Ng", descriptionEn: "Weekly by Andrew Ng" },
  { name: "TLDR AI", url: "https://tldr.tech/ai", type: "newsletter", descriptionCs: "Denní AI newsletter", descriptionEn: "Daily AI newsletter" },
  { name: "Import AI", url: "https://importai.net", type: "newsletter", descriptionCs: "Hloubkové analýzy AI výzkumu", descriptionEn: "Deep AI research analysis" },
  { name: "Lex Fridman Podcast", url: "https://lexfridman.com/podcast", type: "podcast", descriptionCs: "Rozhovory s lídry AI", descriptionEn: "Conversations with AI leaders" },
  { name: "All-In Podcast", url: "https://www.allinpodcast.co", type: "podcast", descriptionCs: "Tech, AI a investice", descriptionEn: "Tech, AI and investments" },
  { name: "Latent Space", url: "https://www.latent.space", type: "podcast", descriptionCs: "Podcast pro AI inženýry", descriptionEn: "Podcast for AI engineers" },
  { name: "Fireship", url: "https://www.youtube.com/@Fireship", type: "youtube", descriptionCs: "Rychlé tech explainery", descriptionEn: "Fast tech explainers" },
  { name: "AI Explained", url: "https://www.youtube.com/@aiexplained-official", type: "youtube", descriptionCs: "Hloubkové rozbory AI novinek", descriptionEn: "In-depth AI news analysis" },
  { name: "Matt Wolfe", url: "https://www.youtube.com/@maboroshi", type: "youtube", descriptionCs: "AI nástroje a novinky", descriptionEn: "AI tools and news" },
  { name: "Two Minute Papers", url: "https://www.youtube.com/@TwoMinutePapers", type: "youtube", descriptionCs: "Krátké shrnutí AI výzkumu", descriptionEn: "Short AI research summaries" },
  { name: "FutureTools.io", url: "https://futuretools.io", type: "blog", descriptionCs: "Databáze AI nástrojů a novinky", descriptionEn: "AI tools database and news" },
  { name: "The Verge AI", url: "https://theverge.com/ai-artificial-intelligence", type: "blog", descriptionCs: "AI zpravodajství od The Verge", descriptionEn: "AI coverage by The Verge" },
  { name: "Ars Technica AI", url: "https://arstechnica.com/ai/", type: "blog", descriptionCs: "Technické AI analýzy", descriptionEn: "Technical AI analysis" },
  { name: "Ben's Bites", url: "https://bensbites.com", type: "blog", descriptionCs: "Denní přehled AI novinek", descriptionEn: "Daily AI news roundup" },
];

/* ─── Helpers ─── */

function faviconUrl(siteUrl: string, size = 32): string {
  const domain = new URL(siteUrl).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

const categoryLabel: Record<Resource["category"], { cs: string; en: string }> = {
  llm: { cs: "Chatboti & LLM", en: "Chatbots & LLM" },
  code: { cs: "Kódování", en: "Coding" },
  image: { cs: "Kreativa", en: "Creative" },
  productivity: { cs: "Produktivita", en: "Productivity" },
  search: { cs: "Vyhledávání", en: "Search" },
};

const categoryKeys: Resource["category"][] = ["llm", "code", "image", "productivity", "search"];

const mediaIcon: Record<MediaResource["type"], string> = {
  newsletter: "\u{1F4E7}",
  podcast: "\u{1F399}\uFE0F",
  youtube: "\u25B6\uFE0F",
  blog: "\u{1F4DD}",
};

/* ─── Component ─── */

export default function ResourcesPageClient() {
  const [lang, setLang] = React.useState<"cs" | "en">("cs");
  const [activeCategory, setActiveCategory] = React.useState<Resource["category"] | null>(null);
  const [activeMediaType, setActiveMediaType] = React.useState<MediaResource["type"] | null>(null);

  const filteredTools = activeCategory ? aiTools.filter((t) => t.category === activeCategory) : aiTools;
  const filteredMedia = activeMediaType ? media.filter((m) => m.type === activeMediaType) : media;

  const mediaTypeKeys: MediaResource["type"][] = ["newsletter", "podcast", "youtube", "blog"];
  const mediaTypeLabel: Record<MediaResource["type"], { cs: string; en: string }> = {
    newsletter: { cs: "Newslettery", en: "Newsletters" },
    podcast: { cs: "Podcasty", en: "Podcasts" },
    youtube: { cs: "YouTube", en: "YouTube" },
    blog: { cs: "Blogy", en: "Blogs" },
  };

  return (
    <div
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen relative`}
    >
      <style>{brutalStyles}</style>

      <div className="brutal-page min-h-screen max-w-full min-[1920px]:max-w-[60%] mx-auto">
        {/* MARQUEE TICKER */}
        <div className="overflow-hidden border-b border-[#f0f0f0]/20 py-2">
          <div className="flex whitespace-nowrap marquee-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0f0f0]/30 mx-8"
              >
                AI NAHRAZUJE PROGRAMATORY /// AUTOMATIZACE SMAZALA 10K POZIC
                /// MODELY JSOU CHYTREJSI NEZ LIDE /// BUDOUCNOST JE TED /// AI
                NAHRAZUJE PROGRAMATORY /// AUTOMATIZACE SMAZALA 10K POZIC
                ///&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="px-4 sm:px-8 pt-8 pb-6">
          <div className="flex justify-between">
            {/* Logo — left */}
            <div className="relative">
              <div className="absolute -left-2 sm:-left-4 top-0 w-2 sm:w-3 h-full bg-[#ff6600]" />
              <div className="pl-4 sm:pl-6">
                <Link href="/">
                  <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl leading-[0.85] font-normal tracking-tight text-[#f0f0f0] glitch-text">
                    BEROU
                    <br />
                    <span className="text-[#ff6600]">N&Aacute;M</span>
                    <br />
                    PR&Aacute;CI
                  </h1>
                </Link>
              </div>
            </div>

            {/* Right side — CZ/EN top, nav bottom */}
            <div className="flex flex-col justify-between items-end">
              <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest">
                <button
                  onClick={() => setLang("cs")}
                  className={`px-2 py-1 border transition-colors ${
                    lang === "cs"
                      ? "border-[#f0f0f0] bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                      : "border-[#f0f0f0]/30 text-[#f0f0f0]/30 hover:text-[#f0f0f0] hover:border-[#f0f0f0]"
                  }`}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 border transition-colors ${
                    lang === "en"
                      ? "border-[#f0f0f0] bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                      : "border-[#f0f0f0]/30 text-[#f0f0f0]/30 hover:text-[#f0f0f0] hover:border-[#f0f0f0]"
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
                <Link href="/" className="harsh-underline text-[#f0f0f0]">
                  {lang === "cs" ? "Články" : "Articles"}
                </Link>
                <span className="text-[#ff6600] font-bold">
                  {lang === "cs" ? "Zdroje" : "Resources"}
                </span>
                <Link href="/about" className="harsh-underline text-[#f0f0f0]">
                  {lang === "cs" ? "O\u00a0projektu" : "About"}
                </Link>
              </div>
            </div>
          </div>

          {/* Horizontal rule */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-0.5 flex-1 bg-[#f0f0f0]/20" />
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.5em]">
              v.01 // {lang === "cs" ? "ZDROJE" : "RESOURCES"}
            </span>
            <div className="h-0.5 w-16 bg-[#ff6600]" />
          </div>
        </header>

        {/* ═══ HERO ═══ */}
        <section className="px-4 sm:px-8 py-6 sm:py-8">
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-[#f0f0f0] glitch-text leading-[0.9] mb-3">
            {lang === "cs" ? "ZDROJE" : "RESOURCES"}
          </h2>
          <p className="font-mono text-sm text-[#f0f0f0]/60 max-w-xl leading-relaxed">
            {lang === "cs"
              ? "N\u00E1stroje, newslettery a zdroje ze sv\u011Bta AI"
              : "Tools, newsletters and resources from the AI world"}
          </p>
        </section>

        {/* ═══ AI TOOLS ═══ */}
        <section className="px-4 sm:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.3em]">
              // {lang === "cs" ? "N\u00C1STROJE" : "TOOLS"}
            </span>
            <div className="h-[1px] flex-1 bg-[#ff6600]/40" />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className={`tag-sticker cursor-pointer transition-colors ${
                activeCategory === null
                  ? "bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                  : "text-[#f0f0f0] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]"
              }`}
            >
              {lang === "cs" ? "Vše" : "All"}
            </button>
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`tag-sticker cursor-pointer transition-colors ${
                  activeCategory === cat
                    ? "bg-[#ff6600] text-[#f0f0f0] border-[#ff6600] font-bold"
                    : "text-[#f0f0f0] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]"
                }`}
              >
                {lang === "cs" ? categoryLabel[cat].cs : categoryLabel[cat].en}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="noise-border p-4 relative group hover:border-[#ff6600] transition-colors"
              >
                <div className="mb-3">
                  <span className="tag-sticker tag-sticker-red">
                    {lang === "cs" ? categoryLabel[tool.category].cs : categoryLabel[tool.category].en}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={faviconUrl(tool.url, 64)}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                  <div>
                    <div className="font-mono text-sm font-bold text-[#f0f0f0] group-hover:text-[#ff6600] transition-colors">
                      {tool.name}
                    </div>
                    <p className="font-mono text-[11px] text-[#f0f0f0]/60">
                      {lang === "cs" ? tool.descriptionCs : tool.descriptionEn}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ COMPANIES ═══ */}
        <section className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.3em]">
              // {lang === "cs" ? "FIRMY" : "COMPANIES"}
            </span>
            <div className="h-[1px] flex-1 bg-[#ff6600]/40" />
          </div>

          <div className="flex flex-wrap gap-3">
            {companies.map((company) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tag-sticker hover:bg-[#f0f0f0] hover:text-[#0a0a0a] transition-colors group px-4 py-2"
              >
                <span className="font-mono text-xs font-bold text-[#f0f0f0] group-hover:text-[#0a0a0a]">
                  {company.name}
                </span>
                <span className="font-mono text-[10px] text-[#f0f0f0]/40 group-hover:text-[#0a0a0a]/60 ml-2">
                  {company.focus}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ MEDIA ═══ */}
        <section className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.3em]">
              // {lang === "cs" ? "M\u00C9DIA" : "MEDIA"}
            </span>
            <div className="h-[1px] flex-1 bg-[#ff6600]/40" />
          </div>

          {/* Media type tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveMediaType(null)}
              className={`tag-sticker cursor-pointer transition-colors ${
                activeMediaType === null
                  ? "bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                  : "text-[#f0f0f0] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]"
              }`}
            >
              {lang === "cs" ? "Vše" : "All"}
            </button>
            {mediaTypeKeys.map((type) => (
              <button
                key={type}
                onClick={() => setActiveMediaType(activeMediaType === type ? null : type)}
                className={`tag-sticker cursor-pointer transition-colors ${
                  activeMediaType === type
                    ? "bg-[#ff6600] text-[#f0f0f0] border-[#ff6600] font-bold"
                    : "text-[#f0f0f0] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]"
                }`}
              >
                <span className="mr-1">{mediaIcon[type]}</span>
                {lang === "cs" ? mediaTypeLabel[type].cs : mediaTypeLabel[type].en}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedia.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-[#f0f0f0]/20 p-4 hover:border-[#ff6600] transition-colors relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{mediaIcon[item.type]}</span>
                  <span className="tag-sticker tag-sticker-red text-[9px]">
                    {lang === "cs" ? mediaTypeLabel[item.type].cs : mediaTypeLabel[item.type].en}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={faviconUrl(item.url, 64)}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
                  />
                  <div>
                    <div className="font-mono text-sm font-bold text-[#f0f0f0] group-hover:text-[#ff6600] transition-colors">
                      {item.name}
                    </div>
                    <p className="font-mono text-[11px] text-[#f0f0f0]/60">
                      {lang === "cs" ? item.descriptionCs : item.descriptionEn}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-4 sm:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="font-headline text-2xl sm:text-3xl text-[#f0f0f0]/20 mb-2">
                BEROU N&Aacute;M PR&Aacute;CI
              </div>
              <p className="font-mono text-xs text-[#f0f0f0]/30 max-w-sm leading-relaxed">
                Generováno umělou inteligencí. Každý den.
              </p>
            </div>
            <div className="font-mono text-[10px] text-[#f0f0f0]/20 text-right leading-loose">
              <div>verze 01 / 05</div>
              <div>brutalist dark editorial</div>
              <div className="text-[#ff6600]/40">
                &copy; {new Date().getFullYear()}
              </div>
            </div>
          </div>
          <div className="mt-8 h-[1px] bg-[#f0f0f0]/5" />
          <div className="mt-4 font-mono text-[9px] text-[#f0f0f0]/10 uppercase tracking-[0.5em]">
            Žádná práce není v bezpečí. Žádná profese není posvátná. Budoucnost je teď.
          </div>
        </footer>
      </div>
    </div>
  );
}

const brutalStyles = `
  :root {
    --brutal-blue: #ff6600;
    --brutal-black: #0a0a0a;
    --brutal-white: #f0f0f0;
  }

  .brutal-page {
    background-color: var(--brutal-black);
    color: var(--brutal-white);
    font-family: var(--font-jetbrains), monospace;
  }

  .brutal-page::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .brutal-page > * {
    position: relative;
    z-index: 1;
  }

  .font-headline {
    font-family: var(--font-instrument), Georgia, serif;
  }

  .font-mono {
    font-family: var(--font-jetbrains), monospace;
  }

  .glitch-text {
    text-shadow:
      2px 2px 0 #ff6600,
      -1px -1px 0 #00ffff;
  }

  .glitch-hover:hover {
    text-shadow:
      3px 3px 0 #ff6600,
      -2px -2px 0 #00ffff,
      5px 0px 0 #ff660044;
    transition: text-shadow 0.1s ease;
  }

  .noise-border {
    border: 2px solid var(--brutal-white);
    box-shadow:
      4px 4px 0 var(--brutal-blue),
      -1px -1px 0 var(--brutal-white);
  }

  .cut-out {
    border: 2px solid var(--brutal-white);
    background: var(--brutal-black);
    box-shadow:
      6px 6px 0 var(--brutal-blue);
  }

  .tag-sticker {
    border: 1px solid var(--brutal-white);
    padding: 2px 8px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: var(--font-jetbrains), monospace;
    display: inline-block;
  }

  .tag-sticker-red {
    border-color: var(--brutal-blue);
    color: var(--brutal-blue);
  }

  .scanline::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.01) 2px,
      rgba(255,255,255,0.01) 4px
    );
    pointer-events: none;
  }

  .harsh-underline {
    text-decoration: none;
    border-bottom: 3px solid var(--brutal-blue);
    padding-bottom: 1px;
  }

  .harsh-underline:hover {
    background: var(--brutal-blue);
    color: var(--brutal-black);
  }

  .rotate-1 { transform: rotate(0.7deg); }
  .rotate-neg { transform: rotate(-0.8deg); }

  .ai-annotation {
    border-left: 3px solid var(--brutal-blue);
    padding-left: 12px;
    position: relative;
  }

  .ai-annotation::before {
    content: '//';
    position: absolute;
    left: -2px;
    top: -14px;
    font-size: 10px;
    color: var(--brutal-blue);
    font-family: var(--font-jetbrains), monospace;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .cursor-blink::after {
    content: '\u2588';
    animation: blink 1s infinite;
    color: var(--brutal-blue);
    margin-left: 2px;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .marquee-track {
    animation: marquee 30s linear infinite;
  }
`;
