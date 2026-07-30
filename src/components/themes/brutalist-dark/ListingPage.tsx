"use client";

import { useState } from "react";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import type { Article } from "@/lib/mockData";
import type { YouTubeVideo } from "@/lib/mdx";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

interface PageClientProps {
  articles: Article[];
  allTags: string[];
  basePath?: string;
  videos?: YouTubeVideo[];
  pinnedVideos?: YouTubeVideo[];
}

export default function PageClient({ articles, allTags, basePath = "/11", videos = [], pinnedVideos = [] }: PageClientProps) {
  const [lang, setLang] = useState<"cs" | "en">("cs");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [extraVisible, setExtraVisible] = useState(0);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  const featured = filtered[0] ?? articles[0];
  const rest = filtered.length > 1
    ? filtered.slice(1)
    : filtered[0] === articles[0]
      ? articles.slice(1)
      : [];

  const t = (cs: string, en: string) => (lang === "cs" ? cs : en);

  return (
    <div
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen relative`}
    >
      <style>{`
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

        .rotate-1 { transform: rotate(0); }
        .rotate-2 { transform: rotate(0); }
        .rotate-3 { transform: rotate(0); }
        .rotate-neg { transform: rotate(0); }

        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

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
          content: '█';
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
      `}</style>

      {/* Language switcher - fixed top, aligned with the content column */}
      <div className="fixed top-20 inset-x-0 z-50 pointer-events-none">
        <div className="max-w-full min-[1920px]:max-w-[60%] mx-auto px-4 sm:px-8 flex justify-end">
          <div className="pointer-events-auto flex gap-1 font-mono text-[10px] uppercase tracking-widest">
            <button
              onClick={() => setLang("cs")}
              className={`px-2 py-1 border transition-colors ${
                lang === "cs"
                  ? "border-[#f0f0f0] bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                  : "border-[#f0f0f0]/30 text-[#f0f0f0]/30 hover:text-[#f0f0f0] hover:border-[#f0f0f0] cursor-pointer bg-[#0a0a0a]/80"
              }`}
            >
              CZ
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 border transition-colors ${
                lang === "en"
                  ? "border-[#f0f0f0] bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                  : "border-[#f0f0f0]/30 text-[#f0f0f0]/30 hover:text-[#f0f0f0] hover:border-[#f0f0f0] cursor-pointer bg-[#0a0a0a]/80"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="brutal-page min-h-screen max-w-full min-[1920px]:max-w-[60%] mx-auto">
        {/* MARQUEE TICKER */}
        <div className="overflow-hidden border-b border-[#f0f0f0]/20 py-2 mt-4">
          <div className="flex whitespace-nowrap marquee-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0f0f0]/30 mx-8">
                AI NAHRAZUJE PROGRAMATORY /// AUTOMATIZACE SMAZALA 10K POZIC /// MODELY JSOU CHYTREJSI NEZ LIDE /// BUDOUCNOST JE TED /// AI NAHRAZUJE PROGRAMATORY /// AUTOMATIZACE SMAZALA 10K POZIC ///&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="px-4 sm:px-8 pt-12 pb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="relative">
              {/* Decorative red block */}
              <div className="absolute -left-2 sm:-left-4 top-0 w-2 sm:w-3 h-full bg-[#ff6600]" />

              <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[120px] leading-[0.85] font-normal tracking-tight text-[#f0f0f0] glitch-text pl-4 sm:pl-6">
                BEROU
                <br />
                <span className="text-[#ff6600]">NÁM</span>
                <br />
                PRÁCI
              </h1>

              <p className="font-mono text-xs sm:text-sm mt-6 pl-4 sm:pl-6 text-[#f0f0f0]/70 max-w-md leading-relaxed">
                {t("AI žere svět. My o tom píšeme.", "AI is eating the world. We write about it.")}
              </p>
            </div>

            {/* NAV */}
            <nav className="flex flex-col gap-3 lg:items-end pl-4 sm:pl-0">
              <div className="flex gap-4 font-mono text-xs sm:text-sm uppercase tracking-widest">
                <Link href="/clanky" className="harsh-underline text-[#f0f0f0]">
                  {t("Články", "Articles")}
                </Link>
                <Link href="/resources" className="harsh-underline text-[#f0f0f0]">
                  {t("Zdroje", "Resources")}
                </Link>
                <Link href="/about" className="harsh-underline text-[#f0f0f0]">
                  {t("O\u00a0projektu", "About")}
                </Link>
              </div>
            </nav>
          </div>

          {/* Horizontal rule with label */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-[#f0f0f0]/20" />
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.5em]">
              v.01 // {new Date().getFullYear()}
            </span>
            <div className="h-[2px] w-16 bg-[#ff6600]" />
          </div>
        </header>

        {/* TAG BAR */}
        <section className="px-4 sm:px-8 py-6 border-y border-[#f0f0f0]/10">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-widest mr-4">
              {t(`Filtry (${allTags.length}) //`, `Filters (${allTags.length}) //`)}
            </span>
            {activeTag && (
              <span className="tag-sticker bg-[#f0f0f0] text-[#0a0a0a]">
                {activeTag}
              </span>
            )}
            <span className="font-mono text-[10px] text-[#f0f0f0]/40 ml-auto">
              {filtersOpen ? "▲" : "▼"}
            </span>
          </div>
          <div className={`flex-wrap items-center gap-2 mt-3 ${filtersOpen ? "flex" : "hidden"}`}>
            {allTags.map((tag) => (
              <span
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`tag-sticker cursor-pointer transition-colors ${
                  activeTag === tag
                    ? "bg-[#f0f0f0] text-[#0a0a0a] font-bold"
                    : "text-[#f0f0f0] hover:bg-[#f0f0f0] hover:text-[#0a0a0a]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        <section id="clanky" className="px-4 sm:px-8 py-10 relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.3em]">
              {t("Hlavní zpráva", "Top story")}
            </span>
            <div className="h-[1px] flex-1 bg-[#ff6600]/40" />
            <span className="font-mono text-[10px] text-[#f0f0f0]/30">
              {featured.date}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
            {/* Main featured content */}
            <div className="lg:col-span-8 cut-out p-6 sm:p-8 relative scanline self-start">
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.tags.map((tag) => (
                  <span key={tag} className="tag-sticker tag-sticker-red">
                    {tag}
                  </span>
                ))}
                <span className="tag-sticker text-[#f0f0f0]/50">
                  {featured.readTime} min {t("čtení", "read")}
                </span>
                <span className="tag-sticker text-[#f0f0f0]/50">
                  {featured.sources.length} {t("zdrojů", "sources")}
                </span>
              </div>

              <Link href={`${basePath}/${featured.slug}`}>
                <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#f0f0f0] mb-6 glitch-hover cursor-pointer">
                  {lang === "cs" ? featured.title : featured.titleEn}
                </h2>
              </Link>

              <p className="font-mono text-sm sm:text-base leading-relaxed text-[#f0f0f0]/70 max-w-2xl mb-8">
                {lang === "cs" ? featured.excerpt : featured.excerptEn}
              </p>

              <div className="flex items-center gap-4">
                <Link href={`${basePath}/${featured.slug}`} className="font-mono text-xs uppercase tracking-widest text-[#ff6600] harsh-underline cursor-pointer">
                  {t("Číst článek", "Read article")} &rarr;
                </Link>
              </div>

              {/* Decorative corner marks */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff6600]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff6600]" />
            </div>

            {/* Side annotation - AI Comments for featured */}
            <div className="lg:col-span-4 lg:pl-8 hidden lg:flex flex-col gap-4 lg:-mt-4 relative lg:overflow-hidden lg:max-h-[450px]">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff6600] mb-2">
                // {t("AI modely komentují", "AI models comment")}
              </div>
              {featured.aiComments.map((comment, idx) => (
                <div
                  key={idx}
                  className="ai-annotation"
                >
                  <div className="flex items-center gap-2 mb-1">
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
              {/* Fade overlay */}
              <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
              <Link href={`${basePath}/${featured.slug}`} className="hidden lg:block absolute bottom-2 left-8 font-mono text-[10px] uppercase tracking-widest text-[#ff6600] harsh-underline z-10">
                {t("Celá diskuse", "Full discussion")} &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="px-4 sm:px-8">
          <div className="border-t border-[#f0f0f0]/10 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#0a0a0a] px-4 font-mono text-[10px] text-[#f0f0f0]/20 uppercase tracking-[0.5em]">
              {t("Další zprávy", "More stories")}
            </span>
          </div>
        </div>

        {/* ARTICLE GRID - Asymmetric brutalist layout */}
        <section className="px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Article 2 - Wide */}
            {rest[0] && (
              <Link href={`${basePath}/${rest[0].slug}`} className="md:col-span-7 noise-border p-5 sm:p-6 relative group">
                <div className="flex flex-wrap gap-2 mb-4">
                  {rest[0].tags.map((tag) => (
                    <span key={tag} className="tag-sticker tag-sticker-red">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                  {rest[0].date} // {rest[0].readTime} min
                </span>
                <h3 className="font-headline text-2xl sm:text-3xl leading-tight text-[#f0f0f0] mb-4 group-hover:text-[#ff6600] transition-colors cursor-pointer">
                  {lang === "cs" ? rest[0].title : rest[0].titleEn}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-[#f0f0f0]/50 max-w-lg">
                  {lang === "cs" ? rest[0].excerpt : rest[0].excerptEn}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-widest cursor-pointer harsh-underline">
                    {t("Číst", "Read")} &rarr;
                  </span>
                  <span className="font-mono text-[10px] text-[#f0f0f0]/30">
                    {rest[0].sources.length} {t("zdrojů", "sources")}
                  </span>
                </div>
              </Link>
            )}

            {/* Article 3 - Narrow tall */}
            {rest[1] && (
              <Link href={`${basePath}/${rest[1].slug}`} className="md:col-span-5 border-2 border-[#ff6600] p-5 sm:p-6 relative group bg-[#ff6600]/5">
                <div className="absolute -top-3 -right-3 bg-[#ff6600] text-[#0a0a0a] font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  {rest[1].tags[0] ?? ""}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {rest[1].tags.map((tag) => (
                    <span key={tag} className="tag-sticker">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                  {rest[1].date} // {rest[1].readTime} min
                </span>
                <h3 className="font-headline text-2xl sm:text-3xl leading-tight text-[#f0f0f0] mb-4 group-hover:text-[#ff6600] transition-colors cursor-pointer">
                  {lang === "cs" ? rest[1].title : rest[1].titleEn}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-[#f0f0f0]/50">
                  {lang === "cs" ? rest[1].excerpt : rest[1].excerptEn}
                </p>
                <div className="mt-4">
                  <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-widest cursor-pointer harsh-underline">
                    {t("Číst", "Read")} &rarr;
                  </span>
                </div>
              </Link>
            )}

            {/* Article 4 - Medium, offset */}
            {rest[2] && (
              <Link href={`${basePath}/${rest[2].slug}`} className="md:col-span-5 md:col-start-1 noise-border p-5 sm:p-6 relative group">
                <div className="flex flex-wrap gap-2 mb-4">
                  {rest[2].tags.map((tag) => (
                    <span key={tag} className="tag-sticker tag-sticker-red">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                  {rest[2].date} // {rest[2].readTime} min
                </span>
                <h3 className="font-headline text-xl sm:text-2xl leading-tight text-[#f0f0f0] mb-3 group-hover:text-[#ff6600] transition-colors cursor-pointer">
                  {lang === "cs" ? rest[2].title : rest[2].titleEn}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-[#f0f0f0]/50">
                  {lang === "cs" ? rest[2].excerpt : rest[2].excerptEn}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-widest cursor-pointer harsh-underline">
                    {t("Číst", "Read")} &rarr;
                  </span>
                  <span className="font-mono text-[10px] text-[#f0f0f0]/30">
                    {rest[2].sources.length} {t("zdrojů", "sources")}
                  </span>
                </div>
              </Link>
            )}

            {/* Article 5 - Wide, contrasting */}
            {rest[3] && (
              <Link href={`${basePath}/${rest[3].slug}`} className="md:col-span-7 border-2 border-[#f0f0f0] p-5 sm:p-6 relative group">
                {/* Decorative vertical text */}
                <div className="hidden lg:block absolute -right-8 top-0 vertical-text font-mono text-[10px] text-[#f0f0f0]/10 uppercase tracking-[0.5em]">
                  {rest[3].tags[0] ?? ""}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {rest[3].tags.map((tag) => (
                    <span key={tag} className="tag-sticker">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                  {rest[3].date} // {rest[3].readTime} min
                </span>
                <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl leading-tight text-[#f0f0f0] mb-4 group-hover:text-[#ff6600] transition-colors cursor-pointer glitch-hover">
                  {lang === "cs" ? rest[3].title : rest[3].titleEn}
                </h3>
                <p className="font-mono text-xs sm:text-sm leading-relaxed text-[#f0f0f0]/50 max-w-xl">
                  {lang === "cs" ? rest[3].excerpt : rest[3].excerptEn}
                </p>
                <div className="mt-6 flex items-center gap-6">
                  <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-widest cursor-pointer harsh-underline">
                    {t("Číst článek", "Read article")} &rarr;
                  </span>
                  <span className="font-mono text-[10px] text-[#f0f0f0]/30">
                    {rest[3].sources.length} {t("zdrojů", "sources")}
                  </span>
                </div>
                {/* Bottom decorative bar */}
                <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-[#ff6600]" />
              </Link>
            )}
          </div>

          {/* Load more articles */}
          {extraVisible > 0 && rest.length > 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {rest.slice(4, 4 + extraVisible).map((article) => (
                <Link
                  key={article.slug}
                  href={`${basePath}/${article.slug}`}
                  className="noise-border p-5 relative group hover:bg-[#f0f0f0]/5 transition-colors"
                >
                  <div className="font-mono text-[10px] text-[#f0f0f0]/30 mb-2">
                    {article.date} // {article.readTime} min
                  </div>
                  <h3 className="font-headline text-lg text-[#f0f0f0] group-hover:text-[#ff6600] transition-colors mb-2">
                    {lang === "cs" ? article.title : article.titleEn}
                  </h3>
                  <p className="font-mono text-[11px] text-[#f0f0f0]/40 line-clamp-2 leading-relaxed">
                    {lang === "cs" ? article.excerpt : article.excerptEn}
                  </p>
                  <div className="flex gap-1 flex-wrap mt-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-sticker text-[#f0f0f0]/40" style={{ fontSize: "8px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {rest.length > 4 + extraVisible && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setExtraVisible((c) => c + 6)}
                className="font-mono text-xs uppercase tracking-widest text-[#ff6600] border border-[#ff6600] px-6 py-3 hover:bg-[#ff6600] hover:text-[#0a0a0a] transition-colors cursor-pointer"
              >
                {t("Další články", "More articles")} ({rest.length - 4 - extraVisible})
              </button>
            </div>
          )}
        </section>

        {/* LATEST VIDEOS */}
        {videos.length > 0 && (
          <section className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.3em]">
                // {t("Nová videa", "New videos")}
              </span>
              <div className="h-[1px] flex-1 bg-[#ff6600]/40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <a
                  key={video.url}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-[#f0f0f0]/10 hover:border-[#ff6600] transition-colors overflow-hidden"
                >
                  {video.thumbnail && (
                    <div className="relative aspect-video overflow-hidden bg-[#0a0a0a]">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#0a0a0a]/80 px-2 py-0.5 font-mono text-[9px] text-[#ff6600] uppercase">
                        ▶ YouTube
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="font-mono text-[10px] text-[#f0f0f0]/30 mb-1">
                      {video.author} • {video.published?.slice(0, 10)}
                    </div>
                    <h3 className="font-headline text-sm sm:text-base text-[#f0f0f0] group-hover:text-[#ff6600] transition-colors leading-tight line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* PINNED VIDEOS */}
        {pinnedVideos.length > 0 && (
          <section className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-[0.3em]">
                // {t("Vybraná videa", "Picks")}
              </span>
              <div className="h-[1px] flex-1 bg-[#ff6600]/40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedVideos.map((video) => (
                <a
                  key={video.url}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-[#f0f0f0]/10 hover:border-[#ff6600] transition-colors overflow-hidden"
                >
                  {video.thumbnail && (
                    <div className="relative aspect-video overflow-hidden bg-[#0a0a0a]">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#0a0a0a]/80 px-2 py-0.5 font-mono text-[9px] text-[#ff6600] uppercase">
                        ▶ YouTube
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="font-mono text-[10px] text-[#f0f0f0]/30 mb-1">
                      {video.author}{video.published ? ` • ${video.published.slice(0, 10)}` : ""}
                    </div>
                    <h3 className="font-headline text-sm sm:text-base text-[#f0f0f0] group-hover:text-[#ff6600] transition-colors leading-tight line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="px-4 sm:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="font-headline text-2xl sm:text-3xl text-[#f0f0f0]/20 mb-2">
                BEROU NÁM PRÁCI
              </div>
              <p className="font-mono text-xs text-[#f0f0f0]/30 max-w-sm leading-relaxed">
                {t("Generováno umělou inteligencí. Každý den.", "Generated by artificial intelligence. Every day.")}
              </p>
            </div>
            <div className="font-mono text-[10px] text-[#f0f0f0]/20 text-right leading-loose">
              <div>verze 01 / 05</div>
              <div>brutalist dark editorial</div>
              <div className="text-[#ff6600]/40">&copy; {new Date().getFullYear()}</div>
            </div>
          </div>
          <div className="mt-8 h-[1px] bg-[#f0f0f0]/5" />
          <div className="mt-4 font-mono text-[9px] text-[#f0f0f0]/10 uppercase tracking-[0.5em]">
            {t(
              "Žádná práce není v bezpečí. Žádná profese není posvátná. Budoucnost je teď.",
              "No job is safe. No profession is sacred. The future is now."
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
