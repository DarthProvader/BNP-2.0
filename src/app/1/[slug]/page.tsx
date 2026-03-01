"use client";

import React, { useState } from "react";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { articles } from "@/lib/mockData";
import { notFound } from "next/navigation";

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

const sourceTypeIcons: Record<string, string> = {
  web: "[ WEB ]",
  youtube: "[ YT ]",
  twitter: "[ X ]",
  podcast: "[ POD ]",
};

export default function ArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [lang, setLang] = useState<"cz" | "en">("cz");

  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const title = lang === "cz" ? article.title : article.titleEn;
  const content = lang === "cz" ? article.content : article.contentEn;
  const paragraphs = content.split("\n\n");

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
            NAV BAR — MATCHING /1 STYLE
        ================================================================ */}
        <nav className="flex items-center justify-between border-b-[6px] border-[#1a1a1a] px-4 py-3 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-[0.2em] sm:px-8">
          <Link
            href="/1"
            className="text-[#e8e4e0]/60 transition-colors hover:text-[#0055ff]"
          >
            &larr; Zpet
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="hidden text-[#e8e4e0]/40 sm:inline">
              Variace 01
            </span>
            <span className="hidden text-[#e8e4e0]/40 md:inline">
              Concrete Monolith
            </span>
            <div className="flex border-[2px] border-[#e8e4e0]/30">
              <button
                onClick={() => setLang("cz")}
                className={`px-2 py-0.5 text-[10px] font-bold transition-colors ${
                  lang === "cz"
                    ? "bg-[#e8e4e0] text-[#1a1a1a]"
                    : "text-[#e8e4e0]/50 hover:text-[#0055ff]"
                }`}
              >
                CZ
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 text-[10px] font-bold transition-colors ${
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

        {/* ================================================================
            ARTICLE HEADER — MASSIVE CONCRETE TITLE SLAB
        ================================================================ */}
        <header className="border-b-[6px] border-[#1a1a1a]">
          {/* Section label bar */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#0055ff]">
              Clanek
            </span>
            <div className="h-[2px] flex-1 bg-[#0055ff]/20" />
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/30">
              {article.slug}
            </span>
          </div>

          <div className="px-4 py-8 sm:px-8 sm:py-12 md:py-16">
            {/* Title */}
            <h1
              className="mb-8 max-w-4xl font-[family-name:var(--font-bebas)] text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] tracking-tight text-[#e8e4e0]"
              style={{
                textShadow:
                  "6px 6px 0px #1a1a1a, 8px 8px 20px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 font-[family-name:var(--font-ibm-mono)] text-xs uppercase tracking-wider text-[#e8e4e0]/40">
              <span className="border-[2px] border-[#e8e4e0]/20 px-2 py-0.5">
                {article.date}
              </span>
              <span className="border-[2px] border-[#e8e4e0]/20 px-2 py-0.5">
                {article.readTime} min{" "}
                {lang === "cz" ? "cteni" : "read"}
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-[2px] border-[#0055ff]/40 px-2 py-0.5 text-[#0055ff]/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ================================================================
            ARTICLE BODY — IBM PLEX MONO, GENEROUS SPACING
        ================================================================ */}
        <section className="border-b-[6px] border-[#1a1a1a]">
          {/* Section label bar */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#0055ff]">
              {lang === "cz" ? "Obsah" : "Content"}
            </span>
            <div className="h-[2px] flex-1 bg-[#0055ff]/20" />
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/30">
              {paragraphs.length} {lang === "cz" ? "odstavcu" : "paragraphs"}
            </span>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
            <div className="px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
              <div className="max-w-3xl space-y-6">
                {paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`font-[family-name:var(--font-ibm-mono)] text-sm leading-[1.9] text-[#e8e4e0]/75 sm:text-base ${
                      i === 0 ? "text-[#e8e4e0]/90" : ""
                    }`}
                  >
                    {i === 0 && (
                      <span className="mr-2 inline-block font-[family-name:var(--font-bebas)] text-4xl leading-none text-[#0055ff] align-top">
                        {paragraph.charAt(0)}
                      </span>
                    )}
                    {i === 0 ? paragraph.slice(1) : paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Side stripe — decorative concrete overhang */}
            <div className="hidden w-24 border-l-[4px] border-[#1a1a1a] bg-[#252525] lg:block">
              <div className="flex h-full flex-col items-center justify-center gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-[3px] w-8 bg-[#e8e4e0]/10" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SOURCES — INDUSTRIAL REFERENCE LIST
        ================================================================ */}
        <section className="border-b-[6px] border-[#1a1a1a]">
          {/* Section label bar */}
          <div className="flex items-center gap-3 border-b-[3px] border-[#1a1a1a] px-4 py-2 sm:px-8">
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] uppercase tracking-[0.3em] text-[#0055ff]">
              {lang === "cz" ? "Zdroje" : "Sources"}
            </span>
            <div className="h-[2px] flex-1 bg-[#0055ff]/20" />
            <span className="font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/30">
              {article.sources.length}{" "}
              {lang === "cz" ? "zdroju" : "sources"}
            </span>
          </div>

          <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="max-w-3xl space-y-0">
              {article.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 border-b-[3px] border-[#1a1a1a] py-5 transition-colors first:pt-0 last:border-b-0 last:pb-0 hover:bg-[#2e2e2e]"
                >
                  {/* Source number */}
                  <span className="flex-shrink-0 font-[family-name:var(--font-bebas)] text-2xl text-[#e8e4e0]/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">
                    {/* Source type badge */}
                    <span className="mb-1 inline-block font-[family-name:var(--font-ibm-mono)] text-[9px] uppercase tracking-[0.3em] text-[#0055ff]/60">
                      {sourceTypeIcons[source.type] || "[ REF ]"}
                    </span>

                    {/* Source title */}
                    <p className="font-[family-name:var(--font-ibm-mono)] text-sm text-[#e8e4e0]/60 transition-colors group-hover:text-[#0055ff] sm:text-base">
                      {source.title}
                    </p>

                    {/* URL */}
                    <p className="mt-1 truncate font-[family-name:var(--font-ibm-mono)] text-[10px] text-[#e8e4e0]/20">
                      {source.url}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="flex-shrink-0 font-[family-name:var(--font-ibm-mono)] text-xs text-[#e8e4e0]/20 transition-all group-hover:translate-x-1 group-hover:text-[#0055ff]">
                    &rarr;
                  </span>
                </a>
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
              {article.aiComments.length}{" "}
              {lang === "cz" ? "modelu" : "models"}
            </span>
          </div>

          <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="grid gap-6 md:grid-cols-3">
              {article.aiComments.map((comment) => (
                <div
                  key={comment.model}
                  className="border-[4px] border-[#1a1a1a] bg-[#252525] p-6 transition-colors hover:border-[#ffaa00]/50"
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
