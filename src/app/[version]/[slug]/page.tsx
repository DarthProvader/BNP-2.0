"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { articles } from "@/lib/mockData";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const VERSION_ACCENTS: Record<string, string> = {
  "1": "#0055ff",
  "4": "#cc0000",
  "6": "#00f0ff",
  "7": "#00e5ff",
  "10": "#e60012",
};

const VERSION_NAMES: Record<string, string> = {
  "1": "Concrete Monolith",
  "4": "Neon Pulse",
  "6": "Frost Glass",
  "7": "Terminal Green",
  "10": "Tokyo Drift",
};

function SourceIcon({ type }: { type: string }) {
  switch (type) {
    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 shrink-0"
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "twitter":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 shrink-0"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "podcast":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 shrink-0"
        >
          <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2a7 7 0 1 1 14 0v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 shrink-0"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
  }
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ version: string; slug: string }>;
}) {
  const { version, slug } = React.use(params);
  const [lang, setLang] = useState<"cz" | "en">("cz");

  const article = articles.find((a) => a.slug === slug);
  const accent = VERSION_ACCENTS[version] || "#888888";
  const versionName = VERSION_NAMES[version] || `Version ${version}`;

  if (!article) {
    return (
      <div
        className={`${instrumentSerif.variable} ${jetbrainsMono.variable} flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#e8e4e0]`}
      >
        <div className="text-center">
          <p
            className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-sm uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            404
          </p>
          <h1 className="mb-6 font-[family-name:var(--font-instrument-serif)] text-4xl">
            Clanek nenalezen
          </h1>
          <Link
            href={`/${version}`}
            className="font-[family-name:var(--font-jetbrains-mono)] text-sm uppercase tracking-[0.2em] transition-colors hover:opacity-70"
            style={{ color: accent }}
          >
            &larr; Zpet na prehled
          </Link>
        </div>
      </div>
    );
  }

  const title = lang === "cz" ? article.title : article.titleEn;
  const content = lang === "cz" ? article.content : article.contentEn;
  const paragraphs = content.split("\n\n");

  return (
    <div
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen bg-[#0a0a0a] text-[#e8e4e0] selection:text-[#0a0a0a]`}
      style={{ ["--accent" as string]: accent }}
    >
      <style>{`
        ::selection {
          background: ${accent};
          color: #0a0a0a;
        }
      `}</style>

      {/* ================================================================
          TOP BAR
      ================================================================ */}
      <nav className="sticky top-0 z-50 border-b border-[#e8e4e0]/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href={`/${version}`}
            className="group flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.2em] text-[#e8e4e0]/50 transition-colors"
            style={{ ["--link-accent" as string]: accent }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = accent)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "")
            }
          >
            <span className="transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            Zpet
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.3em] text-[#e8e4e0]/25 sm:inline">
              {versionName}
            </span>

            {/* Language toggle */}
            <div className="flex overflow-hidden rounded-sm border border-[#e8e4e0]/20">
              <button
                onClick={() => setLang("cz")}
                className="px-2.5 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-bold uppercase tracking-wider transition-all"
                style={
                  lang === "cz"
                    ? { background: accent, color: "#0a0a0a" }
                    : { color: "rgba(232,228,224,0.4)" }
                }
              >
                CZ
              </button>
              <button
                onClick={() => setLang("en")}
                className="px-2.5 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] font-bold uppercase tracking-wider transition-all"
                style={
                  lang === "en"
                    ? { background: accent, color: "#0a0a0a" }
                    : { color: "rgba(232,228,224,0.4)" }
                }
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================================================================
          ARTICLE HEADER
      ================================================================ */}
      <header className="mx-auto max-w-4xl px-6 pb-10 pt-16 sm:pt-20">
        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm px-2.5 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.15em]"
              style={{
                border: `1px solid ${accent}40`,
                color: `${accent}aa`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="mb-8 font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.01em] text-[#e8e4e0]">
          {title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#e8e4e0]/40">
          <time>{article.date}</time>
          <span className="text-[#e8e4e0]/15">|</span>
          <span>
            {article.readTime} min {lang === "cz" ? "cteni" : "read"}
          </span>
          <span className="text-[#e8e4e0]/15">|</span>
          <span style={{ color: `${accent}88` }}>
            {lang === "cz" ? "Hlavni clanek" : "Featured"}
          </span>
        </div>

        {/* Accent divider */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-[2px] w-12" style={{ background: accent }} />
          <div className="h-[1px] flex-1 bg-[#e8e4e0]/10" />
        </div>
      </header>

      {/* ================================================================
          ARTICLE BODY
      ================================================================ */}
      <article className="mx-auto max-w-4xl px-6 pb-16">
        <div className="max-w-[680px]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`mb-6 font-[family-name:var(--font-instrument-serif)] text-lg leading-[1.8] text-[#e8e4e0]/85 sm:text-xl sm:leading-[1.85] ${
                i === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:leading-none sm:first-letter:text-5xl" : ""
              }`}
              style={
                i === 0
                  ? { ["--first-letter-color" as string]: accent }
                  : undefined
              }
            >
              {p}
            </p>
          ))}
        </div>
      </article>

      {/* ================================================================
          SOURCES
      ================================================================ */}
      <section className="border-t border-[#e8e4e0]/10">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2
            className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {lang === "cz" ? "Zdroje" : "Sources"}
          </h2>

          <div className="grid gap-3">
            {article.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-sm border border-[#e8e4e0]/8 bg-[#e8e4e0]/[0.02] px-5 py-4 transition-all hover:border-[#e8e4e0]/15 hover:bg-[#e8e4e0]/[0.04]"
              >
                <span
                  className="opacity-50 transition-opacity group-hover:opacity-80"
                  style={{ color: accent }}
                >
                  <SourceIcon type={source.type} />
                </span>
                <div className="flex-1">
                  <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-[#e8e4e0]/70 transition-colors group-hover:text-[#e8e4e0]/90">
                    {source.title}
                  </span>
                  <span className="ml-3 font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-[#e8e4e0]/25">
                    {source.type}
                  </span>
                </div>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[#e8e4e0]/20 transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          AI COMMENTS
      ================================================================ */}
      <section className="border-t border-[#e8e4e0]/10">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h2
            className="mb-8 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {lang === "cz" ? "AI komentare" : "AI Comments"}
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {article.aiComments.map((comment) => (
              <div
                key={comment.model}
                className="rounded-sm border border-[#e8e4e0]/8 bg-[#e8e4e0]/[0.02] p-5 transition-all hover:border-[#e8e4e0]/15"
              >
                {/* Comment header */}
                <div className="mb-4 flex items-center gap-3 border-b border-[#e8e4e0]/8 pb-3">
                  <span className="text-lg">{comment.avatar}</span>
                  <div>
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-[#e8e4e0]/90">
                      {comment.model}
                    </span>
                    <div className="font-[family-name:var(--font-jetbrains-mono)] text-[9px] uppercase tracking-[0.2em] text-[#e8e4e0]/25">
                      AI Model
                    </div>
                  </div>
                </div>

                {/* Comment body */}
                <p className="font-[family-name:var(--font-instrument-serif)] text-sm leading-relaxed text-[#e8e4e0]/55 italic">
                  &ldquo;{comment.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="border-t border-[#e8e4e0]/10">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-between">
            <Link
              href={`/${version}`}
              className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.2em] text-[#e8e4e0]/30 transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = accent)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "")
              }
            >
              &larr; {lang === "cz" ? "Zpet na prehled" : "Back to overview"}
            </Link>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] uppercase tracking-[0.2em] text-[#e8e4e0]/15">
              Berou Nam Praci &copy; 2026
            </span>
          </div>

          {/* Accent line */}
          <div className="mt-6 flex items-center gap-2">
            <div
              className="h-[2px] w-12"
              style={{ background: accent }}
            />
            <div className="h-[1px] flex-1 bg-[#e8e4e0]/5" />
          </div>
        </div>
      </footer>
    </div>
  );
}
