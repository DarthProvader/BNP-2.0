"use client";

import { useState } from "react";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import type { Article } from "@/lib/mockData";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-mono",
});

export default function PageClient({
  articles,
  allTags,
}: {
  articles: Article[];
  allTags: string[];
}) {
  const [lang, setLang] = useState<"cs" | "en">("cs");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  const displayArticles = filtered.length > 0 ? filtered : articles;

  const featured = displayArticles[0];
  const rest = displayArticles.slice(1);

  return (
    <div
      className={`${bebas.variable} ${ibmMono.variable} relative min-h-screen bg-[#2a2a2a] text-[#e8e4e0] selection:bg-[#0055ff] selection:text-[#e8e4e0]`}
    >
      {/* ====== CONCRETE TEXTURE OVERLAY (SVG noise) ====== */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
        }}
      />

      {/* ====== BLUEPRINT GRID LINES ====== */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e8e4e0 1px, transparent 1px),
            linear-gradient(to bottom, #e8e4e0 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ====== BRUTALIST PILLARS — thick vertical lines ====== */}
      <div className="pointer-events-none fixed left-[5%] top-0 z-0 h-full w-[6px] bg-[#1a1a1a] opacity-30" />
      <div className="pointer-events-none fixed right-[8%] top-0 z-0 h-full w-[4px] bg-[#1a1a1a] opacity-20" />
      <div className="pointer-events-none fixed left-[62%] top-0 z-0 hidden h-full w-[3px] bg-[#1a1a1a] opacity-15 lg:block" />

      <div className="relative z-10">
        {/* ================================================================
            HEADER — MASSIVE CONCRETE SLAB
        ================================================================ */}
        <header className="border-b-[6px] border-[#1a1a1a]">
          {/* Navigation bar */}
          <nav className="flex items-center justify-between border-b-[3px] border-[#1a1a1a] px-4 py-3 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[0.2em] sm:px-8">
            <div className="flex items-center gap-4 sm:gap-8">
              <span className="hidden text-[#e8e4e0]/40 sm:inline">
                Variace 01
              </span>
              <span className="hidden text-[#e8e4e0]/40 md:inline">
                Concrete Monolith
              </span>
              <div className="flex border-[2px] border-[#e8e4e0]/30">
                <button
                  onClick={() => setLang("cs")}
                  className={`px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
                    lang === "cs"
                      ? "bg-[#e8e4e0] text-[#1a1a1a]"
                      : "text-[#e8e4e0]/50 hover:text-[#0055ff]"
                  }`}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
                    lang === "en"
                      ? "bg-[#e8e4e0] text-[#1a1a1a]"
                      : "text-[#e8e4e0]/50 hover:text-[#0055ff]"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </nav>

          {/* Main title block */}
          <div className="overflow-hidden px-4 pb-6 pt-8 sm:px-8 sm:pb-10 sm:pt-12 md:pb-14 md:pt-16">
            <h1
              className="font-[family-name:var(--font-bebas)] text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tight text-[#e8e4e0]"
              style={{
                textShadow:
                  "6px 6px 0px #1a1a1a, 8px 8px 20px rgba(0,0,0,0.5)",
              }}
            >
              BEROU
              <br />
              NÁM PRÁCI
            </h1>
            <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl font-[family-name:var(--font-ibm-mono)] text-sm leading-relaxed text-[#e8e4e0]/50 sm:text-base">
                {lang === "cs"
                  ? "Denní přehled AI novinek. Generováno umělou inteligencí."
                  : "Daily AI news overview. Generated by artificial intelligence."}
                <br />
                <span className="text-[#0055ff]">
                  {lang === "cs"
                    ? "Každý den. Bez emocí. Bez cenzury."
                    : "Every day. No emotions. No censorship."}
                </span>
              </p>
              <span className="font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[0.3em] text-[#e8e4e0]/20">
                Est. 2026
              </span>
            </div>
          </div>
        </header>

        {/* ================================================================
            FEATURED ARTICLE — FULL-WIDTH CONCRETE SLAB
        ================================================================ */}
        <section className="border-b-[6px] border-[#1a1a1a]">
          {/* Section label bar */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#0055ff]">
              {lang === "cs" ? "Hlavni clanek" : "Featured article"}
            </span>
            <div className="h-[2px] flex-1 bg-[#0055ff]/20" />
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/30">
              {featured.date}
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
            <div className="px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
              {/* Title */}
              <h2 className="mb-6 max-w-3xl font-[family-name:var(--font-bebas)] text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight">
                <Link
                  href={`/1/${featured.slug}`}
                  className="transition-colors hover:text-[#0055ff]"
                >
                  {lang === "cs" ? featured.title : featured.titleEn}
                </Link>
              </h2>

              {/* Meta row */}
              <div className="mb-6 flex flex-wrap items-center gap-3 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-wider text-[#e8e4e0]/40">
                <span className="border-[2px] border-[#e8e4e0]/20 px-2 py-0.5">
                  {featured.readTime} min {lang === "cs" ? "cteni" : "read"}
                </span>
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-[2px] border-[#0055ff]/40 px-2 py-0.5 text-[#0055ff]/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Excerpt */}
              <p className="max-w-2xl font-[family-name:var(--font-ibm-mono)] text-sm leading-relaxed text-[#e8e4e0]/70 sm:text-base">
                {lang === "cs" ? featured.excerpt : featured.excerptEn}
              </p>

              {/* Read more CTA */}
              <div className="mt-8">
                <Link
                  href={`/1/${featured.slug}`}
                  className="group inline-flex items-center gap-3 border-[3px] border-[#e8e4e0] px-6 py-3 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[0.2em] transition-all hover:border-[#0055ff] hover:bg-[#0055ff] hover:text-[#e8e4e0]"
                >
                  {lang === "cs" ? "Cist cely clanek" : "Read full article"}
                  <span className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>

            {/* Side stripe — decorative concrete overhang */}
            <div className="hidden w-24 border-l-[4px] border-[#1a1a1a] bg-[#252525] lg:block">
              <div className="flex h-full flex-col items-center justify-center gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-[3px] w-8 bg-[#e8e4e0]/10" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            ARTICLE GRID — ASYMMETRIC CONCRETE BLOCKS
        ================================================================ */}
        <section className="border-b-[6px] border-[#1a1a1a]">
          {/* Section label bar */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#0055ff]">
              {lang === "cs" ? "Dalsi clanky" : "More articles"}
            </span>
            <div className="h-[2px] flex-1 bg-[#0055ff]/20" />
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/30">
              {rest.length} {lang === "cs" ? "clanku" : "articles"}
            </span>
          </div>

          {/* Asymmetric grid — alternating wide/narrow blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {rest.map((article, i) => {
              const patterns = [
                "lg:col-span-7",
                "lg:col-span-5",
                "lg:col-span-5",
                "lg:col-span-7",
              ];
              const colSpan = patterns[i % 4];

              return (
                <article
                  key={article.slug}
                  className={`group border-b-[4px] border-[#1a1a1a] p-6 transition-colors hover:bg-[#2e2e2e] sm:p-8 lg:border-r-[4px] ${colSpan}`}
                >
                  {/* Title */}
                  <h3 className="mb-4 font-[family-name:var(--font-bebas)] text-[clamp(1.8rem,4vw,3rem)] leading-[0.95] tracking-tight transition-colors group-hover:text-[#0055ff]">
                    <Link href={`/1/${article.slug}`}>
                      {lang === "cs" ? article.title : article.titleEn}
                    </Link>
                  </h3>

                  {/* Date and read time */}
                  <div className="mb-3 flex items-center gap-3 font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-wider text-[#e8e4e0]/30">
                    <span>{article.date}</span>
                    <span className="text-[#e8e4e0]/15">|</span>
                    <span>{article.readTime} min</span>
                  </div>

                  {/* Excerpt */}
                  <p className="mb-4 line-clamp-3 font-[family-name:var(--font-ibm-mono)] text-xs leading-relaxed text-[#e8e4e0]/50 sm:text-sm">
                    {lang === "cs" ? article.excerpt : article.excerptEn}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-[2px] border-[#e8e4e0]/15 px-2 py-0.5 font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-wider text-[#e8e4e0]/30 transition-colors group-hover:border-[#0055ff]/30 group-hover:text-[#0055ff]/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ================================================================
            TAGS SECTION — HEAVY BORDERED PILLS
        ================================================================ */}
        <section className="border-b-[6px] border-[#1a1a1a]">
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#0055ff]">
              {lang === "cs" ? "Kategorie" : "Categories"}
            </span>
            <div className="h-[2px] flex-1 bg-[#0055ff]/20" />
          </div>

          <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="flex flex-wrap gap-3">
              {allTags.map((tag, i) => (
                <span
                  key={tag}
                  onClick={() =>
                    setActiveTag(activeTag === tag ? null : tag)
                  }
                  className={`inline-block cursor-pointer border-[3px] px-4 py-2 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[0.15em] transition-all hover:bg-[#0055ff] hover:text-[#e8e4e0] ${
                    activeTag === tag
                      ? "border-[#0055ff] bg-[#0055ff] text-[#e8e4e0]"
                      : i === 0 && !activeTag
                        ? "border-[#ffaa00] text-[#ffaa00]"
                        : "border-[#e8e4e0]/25 text-[#e8e4e0]/50 hover:border-[#0055ff]"
                  }`}
                  style={{
                    boxShadow:
                      activeTag === tag
                        ? "4px 4px 0 #1a1a1a"
                        : i === 0 && !activeTag
                          ? "4px 4px 0 #1a1a1a"
                          : "3px 3px 0 #1a1a1a",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            AI COMMENTS — BUILDING PLAQUES
        ================================================================ */}
        <section className="border-b-[6px] border-[#1a1a1a]">
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#ffaa00]">
              AI komentare
            </span>
            <div className="h-[2px] flex-1 bg-[#ffaa00]/20" />
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/30">
              K clanku 01
            </span>
          </div>

          <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="grid gap-6 md:grid-cols-3">
              {featured.aiComments.map((comment) => (
                <div
                  key={comment.model}
                  className="border-[4px] border-[#1a1a1a] bg-[#252525] p-6 transition-colors hover:border-[#0055ff]/50"
                  style={{
                    boxShadow: "6px 6px 0 #1a1a1a",
                  }}
                >
                  {/* Plaque header */}
                  <div className="mb-4 flex items-center gap-3 border-b-[2px] border-[#e8e4e0]/10 pb-3">
                    <span className="text-xl">{comment.avatar}</span>
                    <div>
                      <span className="font-[family-name:var(--font-bebas)] text-xl tracking-wide text-[#e8e4e0]">
                        {comment.model}
                      </span>
                      <div className="font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-[0.2em] text-[#e8e4e0]/25">
                        AI Model &middot; Komentar
                      </div>
                    </div>
                  </div>

                  {/* Comment body */}
                  <p className="font-[family-name:var(--font-ibm-mono)] text-xs leading-relaxed text-[#e8e4e0]/60">
                    &ldquo;{comment.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            FOOTER — HEAVY MINIMAL SLAB
        ================================================================ */}
        <footer className="px-4 py-8 sm:px-8 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span
                className="font-[family-name:var(--font-bebas)] text-4xl tracking-tight text-[#e8e4e0]/20 sm:text-5xl"
                style={{
                  textShadow: "3px 3px 0 #1a1a1a",
                }}
              >
                BEROU NAM PRACI
              </span>
              <p className="mt-2 font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.2em] text-[#e8e4e0]/20">
                Generovano AI. Kazdy den.
              </p>
            </div>
            <div className="text-right font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.15em] text-[#e8e4e0]/15">
              <p>Variace 01 &mdash; Concrete Monolith</p>
              <p className="mt-1">Brutalist Architecture Series</p>
              <p className="mt-1">&copy; 2026</p>
            </div>
          </div>

          {/* Bottom decorative line — blue accent strip with amber dot */}
          <div className="mt-8 flex items-center gap-2">
            <div className="h-[4px] w-16 bg-[#0055ff]" />
            <div className="h-[4px] w-4 bg-[#ffaa00]" />
            <div className="h-[4px] flex-1 bg-[#1a1a1a]" />
          </div>
        </footer>
      </div>
    </div>
  );
}
