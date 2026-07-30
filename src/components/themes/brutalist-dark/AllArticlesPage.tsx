"use client";

import { useState, useMemo } from "react";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
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

interface Props {
  articles: Article[];
  allTags: string[];
}

const ITEMS_PER_PAGE = 12;

export default function AllArticlesPage({ articles, allTags }: Props) {
  const [lang, setLang] = useState<"cs" | "en">("cs");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const t = (cs: string, en: string) => (lang === "cs" ? cs : en);

  const filtered = useMemo(() => {
    let result = articles;

    if (activeTag) {
      result = result.filter((a) => a.tags.includes(activeTag));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.titleEn.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.excerptEn.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [articles, activeTag, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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

        .font-headline { font-family: var(--font-instrument), Georgia, serif; }
        .font-mono { font-family: var(--font-jetbrains), monospace; }

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

        .harsh-underline {
          text-decoration: none;
          border-bottom: 3px solid var(--brutal-blue);
          padding-bottom: 1px;
        }

        .harsh-underline:hover {
          background: var(--brutal-blue);
          color: var(--brutal-black);
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
        {/* Header */}
        <header className="px-4 sm:px-8 pt-12 pb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="relative">
              <div className="absolute -left-2 sm:-left-4 top-0 w-2 sm:w-3 h-full bg-[#ff6600]" />
              <Link href="/" className="font-headline text-3xl sm:text-4xl md:text-5xl text-[#f0f0f0] glitch-text pl-4 sm:pl-6 hover:text-[#ff6600] transition-colors">
                BEROU NÁM PRÁCI
              </Link>
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl text-[#ff6600] mt-4 pl-4 sm:pl-6">
                {t("Všechny články", "All articles")}
              </h1>
            </div>

            <nav className="flex flex-col gap-3 lg:items-end pl-4 sm:pl-0">
              <div className="flex gap-4 font-mono text-xs sm:text-sm uppercase tracking-widest">
                <Link href="/" className="harsh-underline text-[#f0f0f0]">
                  {t("Domů", "Home")}
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
        </header>

        {/* Search + Filters */}
        <section className="px-4 sm:px-8 py-6 border-y border-[#f0f0f0]/10">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            placeholder={t("Hledat články...", "Search articles...")}
            className="w-full max-w-xl bg-transparent border-2 border-[#ff6600] text-[#f0f0f0] font-mono text-sm px-4 py-3 outline-none placeholder:text-[#f0f0f0]/30 focus:border-[#f0f0f0] transition-colors"
          />

          <div
            className="flex items-center gap-2 cursor-pointer mt-4"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <span className="font-mono text-[10px] text-[#ff6600] uppercase tracking-widest">
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
                onClick={() => {
                  setActiveTag(activeTag === tag ? null : tag);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
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

          <div className="font-mono text-[10px] text-[#f0f0f0]/30 mt-4">
            {filtered.length} {t("článků", "articles")}
          </div>
        </section>

        {/* Article list */}
        <section className="px-4 sm:px-8 py-6">
          <div className="flex flex-col gap-1">
            {visible.map((article) => (
              <Link
                key={article.slug}
                href={`/${article.slug}`}
                className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4 border-b border-[#f0f0f0]/5 hover:bg-[#f0f0f0]/5 px-2 -mx-2 transition-colors"
              >
                <span className="font-mono text-[10px] text-[#f0f0f0]/30 shrink-0 w-20">
                  {article.date}
                </span>
                <span className="font-headline text-lg sm:text-xl text-[#f0f0f0] group-hover:text-[#ff6600] transition-colors flex-1">
                  {lang === "cs" ? article.title : article.titleEn}
                </span>
                <span className="font-mono text-[10px] text-[#f0f0f0]/20 shrink-0 hidden md:block">
                  {article.readTime} min
                </span>
                <div className="flex gap-1 flex-wrap sm:hidden mt-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag-sticker text-[#f0f0f0]/40" style={{ fontSize: "8px" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                className="font-mono text-xs uppercase tracking-widest text-[#ff6600] border border-[#ff6600] px-6 py-3 hover:bg-[#ff6600] hover:text-[#0a0a0a] transition-colors cursor-pointer"
              >
                {t("Načíst další", "Load more")} ({filtered.length - visibleCount} {t("zbývá", "remaining")})
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="py-12 text-center font-mono text-sm text-[#f0f0f0]/30">
              {t("Žádné články nenalezeny.", "No articles found.")}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-8 py-8 border-t border-[#f0f0f0]/10">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-[#ff6600] harsh-underline"
          >
            &larr; {t("Zpět na hlavní stránku", "Back to homepage")}
          </Link>
        </footer>
      </div>
    </div>
  );
}
