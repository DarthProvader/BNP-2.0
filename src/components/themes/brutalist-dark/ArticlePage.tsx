"use client";

import React from "react";
import Link from "next/link";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import ArticleContent from "@/components/ArticleContent";
import type { Article } from "@/lib/mockData";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const sourceTypeIcon: Record<string, string> = {
  youtube: "YT",
  twitter: "X",
  web: "WEB",
  podcast: "POD",
};

interface PageClientProps {
  article: Article;
  basePath?: string;
}

export default function PageClient({ article, basePath = "/11" }: PageClientProps) {
  const [lang, setLang] = React.useState<"cs" | "en">("cs");

  const title = lang === "cs" ? article.title : article.titleEn;
  const content = lang === "cs" ? article.content : article.contentEn;

  return (
    <div
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen relative`}
    >
      <style>{brutalStyles}</style>

      <div className="brutal-page min-h-screen">
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link
                href={basePath}
                className="font-mono text-xs uppercase tracking-widest text-[#ff2222] hover:bg-[#ff2222] hover:text-[#0a0a0a] transition-colors px-2 py-1 border border-[#ff2222]"
              >
                &larr; Zp&#283;t na v&yacute;b&#283;r
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* CZ/EN toggle */}
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
            </div>
          </div>

          {/* Title with red vertical bar */}
          <div className="relative mt-10">
            <div className="absolute -left-2 sm:-left-4 top-0 w-2 sm:w-3 h-full bg-[#ff2222]" />
            <div className="pl-4 sm:pl-6">
              <Link href={basePath}>
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl leading-[0.85] font-normal tracking-tight text-[#f0f0f0] glitch-text">
                  BEROU
                  <br />
                  <span className="text-[#ff2222]">NÁM</span>
                  <br />
                  PRÁCI
                </h1>
              </Link>
            </div>
          </div>

          {/* Horizontal rule */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-[#f0f0f0]/20" />
            <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-[0.5em]">
              v.01 // {article.date}
            </span>
            <div className="h-[2px] w-16 bg-[#ff2222]" />
          </div>
        </header>

        {/* ARTICLE CONTENT */}
        <section className="px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
            {/* Main article panel */}
            <div className="lg:col-span-8 cut-out p-6 sm:p-8 md:p-10 relative scanline">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <span key={tag} className="tag-sticker tag-sticker-red">
                    {tag}
                  </span>
                ))}
                <span className="tag-sticker text-[#f0f0f0]/50">
                  {article.readTime} min{" "}
                  {lang === "cs" ? "čtení" : "read"}
                </span>
                <span className="tag-sticker text-[#f0f0f0]/50">
                  {article.sources.length}{" "}
                  {lang === "cs" ? "zdrojů" : "sources"}
                </span>
              </div>

              {/* Date */}
              <div className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest mb-4">
                {article.date} // {article.readTime} min
              </div>

              {/* Article title */}
              <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-[#f0f0f0] mb-8 glitch-hover">
                {title}
              </h2>

              {/* Article body */}
              <ArticleContent
                content={content}
                headingClassName="mt-8 mb-4 font-headline text-xl sm:text-2xl text-[#ff2222] first:mt-0"
                paragraphClassName="mb-6 font-mono text-sm sm:text-base leading-relaxed text-[#f0f0f0]/80"
                strongClassName="font-bold text-[#f0f0f0]"
                emClassName="text-[#f0f0f0]/50 italic"
                linkClassName="text-[#ff2222] border-b-2 border-[#ff2222] hover:bg-[#ff2222] hover:text-[#0a0a0a] transition-colors"
              />

              {/* Corner marks */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff2222]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ff2222]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff2222]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff2222]" />
            </div>

            {/* Side AI annotations */}
            <div className="lg:col-span-4 lg:pl-8 flex flex-col gap-6 lg:-mt-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff2222] mb-2">
                // AI modely komentují
              </div>
              {article.aiComments.map((comment, idx) => (
                <div
                  key={idx}
                  className="ai-annotation"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{comment.avatar}</span>
                    <span className="font-mono text-[11px] font-bold text-[#f0f0f0] uppercase tracking-wider">
                      {comment.model}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed text-[#f0f0f0]/60">
                    &ldquo;{comment.comment}&rdquo;
                  </p>
                </div>
              ))}

              {/* Decorative element */}
              <div className="hidden lg:block mt-8 font-mono text-[9px] text-[#f0f0f0]/10 uppercase tracking-[0.5em] leading-loose">
                <div>SYSTEM.LOG</div>
                <div>---</div>
                <div>ANALYZING...</div>
                <div>MODELS: 3</div>
                <div>CONSENSUS: LOW</div>
                <div className="cursor-blink">_</div>
              </div>
            </div>
          </div>
        </section>

        {/* SOURCES */}
        <section className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-[0.3em]">
              // {lang === "cs" ? "Zdroje" : "Sources"}
            </span>
            <div className="h-[1px] flex-1 bg-[#ff2222]/40" />
          </div>

          <div className="flex flex-wrap gap-3">
            {article.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tag-sticker hover:bg-[#f0f0f0] hover:text-[#0a0a0a] transition-colors group"
              >
                <span className="text-[#ff2222] mr-2 font-bold">
                  [{sourceTypeIcon[source.type]}]
                </span>
                <span className="harsh-underline">{source.title}</span>
              </a>
            ))}
          </div>
        </section>

        {/* BACK NAVIGATION */}
        <section className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href={basePath}
              className="font-mono text-xs uppercase tracking-widest text-[#ff2222] harsh-underline"
            >
              &larr; {lang === "cs" ? "Všechny články" : "All articles"}
            </Link>
            <div className="font-mono text-[10px] text-[#f0f0f0]/30 uppercase tracking-widest">
              {article.slug} // {article.readTime} min
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-4 sm:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="font-headline text-2xl sm:text-3xl text-[#f0f0f0]/20 mb-2">
                BEROU NÁM PRÁCI
              </div>
              <p className="font-mono text-xs text-[#f0f0f0]/30 max-w-sm leading-relaxed">
                Generováno umělou inteligencí. Každý den.
              </p>
            </div>
            <div className="font-mono text-[10px] text-[#f0f0f0]/20 text-right leading-loose">
              <div>verze 01 / 05</div>
              <div>brutalist dark editorial</div>
              <div className="text-[#ff2222]/40">
                &copy; {new Date().getFullYear()}
              </div>
            </div>
          </div>
          <div className="mt-8 h-[1px] bg-[#f0f0f0]/5" />
          <div className="mt-4 font-mono text-[9px] text-[#f0f0f0]/10 uppercase tracking-[0.5em]">
            Žádná práce není v bezpečí. Žádná profese není posvátná. Budoucnost
            je teď.
          </div>
        </footer>
      </div>
    </div>
  );
}

const brutalStyles = `
  :root {
    --brutal-red: #ff2222;
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
      2px 2px 0 #ff2222,
      -1px -1px 0 #00ffff;
  }

  .glitch-hover:hover {
    text-shadow:
      3px 3px 0 #ff2222,
      -2px -2px 0 #00ffff,
      5px 0px 0 #ff222244;
    transition: text-shadow 0.1s ease;
  }

  .noise-border {
    border: 2px solid var(--brutal-white);
    box-shadow:
      4px 4px 0 var(--brutal-red),
      -1px -1px 0 var(--brutal-white);
  }

  .cut-out {
    border: 2px solid var(--brutal-white);
    background: var(--brutal-black);
    box-shadow:
      6px 6px 0 var(--brutal-red);
  }

  .tag-sticker {
    border: 1px solid var(--brutal-white);
    padding: 2px 8px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: var(--font-jetbrains), monospace;
    display: inline-block;
    background: var(--brutal-black);
  }

  .tag-sticker-red {
    border-color: var(--brutal-red);
    color: var(--brutal-red);
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
    border-bottom: 3px solid var(--brutal-red);
    padding-bottom: 1px;
  }

  .harsh-underline:hover {
    background: var(--brutal-red);
    color: var(--brutal-black);
  }

  .rotate-1 { transform: rotate(0.7deg); }
  .rotate-neg { transform: rotate(-0.8deg); }

  .ai-annotation {
    border-left: 3px solid var(--brutal-red);
    padding-left: 12px;
    position: relative;
  }

  .ai-annotation::before {
    content: '//';
    position: absolute;
    left: -2px;
    top: -14px;
    font-size: 10px;
    color: var(--brutal-red);
    font-family: var(--font-jetbrains), monospace;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  .cursor-blink::after {
    content: '\u2588';
    animation: blink 1s infinite;
    color: var(--brutal-red);
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
