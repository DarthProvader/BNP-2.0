"use client";

import React, { useState } from "react";
import { Bangers, DM_Sans } from "next/font/google";
import { articles } from "@/lib/mockData";
import Link from "next/link";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const dmSans = DM_Sans({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

/* ── tiny helpers ── */
const sfx = ["BOOM!", "CRACK!", "WHOOSH!", "BAM!", "RUMBLE!", "ZAP!"];
const panelNumber = (n: number) =>
  ["\u2460", "\u2461", "\u2462", "\u2463", "\u2464", "\u2465", "\u2466", "\u2467", "\u2468", "\u2469"][n] ?? `(${n + 1})`;

const sourceIcon: Record<string, string> = {
  web: "\uD83C\uDF10",
  youtube: "\u25B6\uFE0F",
  twitter: "\uD83D\uDCAC",
  podcast: "\uD83C\uDFA7",
};

const sourceBadgeColor: Record<string, string> = {
  web: "bg-[#e60012] text-white",
  youtube: "bg-[#ff0000] text-white",
  twitter: "bg-[#1d9bf0] text-white",
  podcast: "bg-[#9b59b6] text-white",
};

export default function MangaArticleDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [lang, setLang] = useState<"cz" | "en">("cz");

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div
        className={`${bangers.variable} ${dmSans.variable} flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#e8e4e0]`}
        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
      >
        <div className="border-[4px] border-[#333] bg-[#151515] p-12 text-center">
          <p
            className="mb-4 text-6xl"
            style={{
              fontFamily: "var(--font-bangers)",
              textShadow: "2px 2px 0 #e60012",
            }}
          >
            404
          </p>
          <p className="mb-6 text-sm opacity-60">Article not found</p>
          <Link
            href="/10"
            className="border-[3px] border-[#333] bg-[#151515] px-4 py-2 text-sm font-bold tracking-wide transition-colors hover:border-[#e60012] hover:bg-[#e60012] hover:text-white"
            style={{ fontFamily: "var(--font-bangers)" }}
          >
            &larr; Zpet
          </Link>
        </div>
      </div>
    );
  }

  const title = lang === "cz" ? article.title : article.titleEn;
  const content = lang === "cz" ? article.content : article.contentEn;
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <div
      className={`${bangers.variable} ${dmSans.variable} relative min-h-screen bg-[#0a0a0a] text-[#e8e4e0] selection:bg-[#e60012] selection:text-white`}
      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
    >
      {/* ══════ SCREENTONE OVERLAY ══════ */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fff 0.7px, transparent 0.7px)",
          backgroundSize: "6px 6px",
        }}
      />

      {/* ══════ SPEED-LINE BG (subtle, full page) ══════ */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "conic-gradient(from 0deg at 50% 40%, #fff 0deg, transparent 2deg, transparent 10deg, #fff 10deg, transparent 12deg, transparent 20deg, #fff 20deg, transparent 22deg, transparent 30deg, #fff 30deg, transparent 32deg, transparent 40deg, #fff 40deg, transparent 42deg, transparent 50deg, #fff 50deg, transparent 52deg, transparent 60deg, #fff 60deg, transparent 62deg, transparent 70deg, #fff 70deg, transparent 72deg, transparent 80deg, #fff 80deg, transparent 82deg, transparent 90deg, #fff 90deg, transparent 92deg, transparent 100deg, #fff 100deg, transparent 102deg, transparent 110deg, #fff 110deg, transparent 112deg, transparent 120deg, #fff 120deg, transparent 122deg, transparent 130deg, #fff 130deg, transparent 132deg, transparent 140deg, #fff 140deg, transparent 142deg, transparent 150deg, #fff 150deg, transparent 152deg, transparent 160deg, #fff 160deg, transparent 162deg, transparent 170deg, #fff 170deg, transparent 172deg, transparent 180deg, #fff 180deg, transparent 182deg, transparent 190deg, #fff 190deg, transparent 192deg, transparent 200deg, #fff 200deg, transparent 202deg, transparent 210deg, #fff 210deg, transparent 212deg, transparent 220deg, #fff 220deg, transparent 222deg, transparent 230deg, #fff 230deg, transparent 232deg, transparent 240deg, #fff 240deg, transparent 242deg, transparent 250deg, #fff 250deg, transparent 252deg, transparent 260deg, #fff 260deg, transparent 262deg, transparent 270deg, #fff 270deg, transparent 272deg, transparent 280deg, #fff 280deg, transparent 282deg, transparent 290deg, #fff 290deg, transparent 292deg, transparent 300deg, #fff 300deg, transparent 302deg, transparent 310deg, #fff 310deg, transparent 312deg, transparent 320deg, #fff 320deg, transparent 322deg, transparent 330deg, #fff 330deg, transparent 332deg, transparent 340deg, #fff 340deg, transparent 342deg, transparent 350deg, #fff 350deg, transparent 352deg, transparent 360deg)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[900px] px-3 py-4 md:px-6 md:py-8">
        {/* ════════════════════════════════════════════
            PANEL 1 — TITLE (full-width hero)
        ════════════════════════════════════════════ */}
        <section className="relative mb-1 overflow-hidden border-[4px] border-[#333] bg-[#151515]">
          {/* Speed lines radiating from center */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 50% 55%, #fff 0deg, transparent 1.5deg, transparent 5deg, #fff 5deg, transparent 6.5deg, transparent 10deg, #fff 10deg, transparent 11.5deg, transparent 15deg, #fff 15deg, transparent 16.5deg, transparent 20deg, #fff 20deg, transparent 21.5deg, transparent 25deg, #fff 25deg, transparent 26.5deg, transparent 30deg, #fff 30deg, transparent 31.5deg, transparent 35deg, #fff 35deg, transparent 36.5deg, transparent 40deg, #fff 40deg, transparent 41.5deg, transparent 45deg, #fff 45deg, transparent 46.5deg, transparent 50deg, #fff 50deg, transparent 51.5deg, transparent 55deg, #fff 55deg, transparent 56.5deg, transparent 60deg, #fff 60deg, transparent 61.5deg, transparent 65deg, #fff 65deg, transparent 66.5deg, transparent 70deg, #fff 70deg, transparent 71.5deg, transparent 75deg, #fff 75deg, transparent 76.5deg, transparent 80deg, #fff 80deg, transparent 81.5deg, transparent 85deg, #fff 85deg, transparent 86.5deg, transparent 90deg, #fff 90deg, transparent 91.5deg, transparent 95deg, #fff 95deg, transparent 96.5deg, transparent 100deg, #fff 100deg, transparent 101.5deg, transparent 105deg, #fff 105deg, transparent 106.5deg, transparent 110deg, #fff 110deg, transparent 111.5deg, transparent 115deg, #fff 115deg, transparent 116.5deg, transparent 120deg, #fff 120deg, transparent 121.5deg, transparent 125deg, #fff 125deg, transparent 126.5deg, transparent 130deg, #fff 130deg, transparent 131.5deg, transparent 135deg, #fff 135deg, transparent 136.5deg, transparent 140deg, #fff 140deg, transparent 141.5deg, transparent 145deg, #fff 145deg, transparent 146.5deg, transparent 150deg, #fff 150deg, transparent 151.5deg, transparent 155deg, #fff 155deg, transparent 156.5deg, transparent 160deg, #fff 160deg, transparent 161.5deg, transparent 165deg, #fff 165deg, transparent 166.5deg, transparent 170deg, #fff 170deg, transparent 171.5deg, transparent 175deg, #fff 175deg, transparent 176.5deg, transparent 180deg, #fff 180deg, transparent 181.5deg, transparent 185deg, #fff 185deg, transparent 186.5deg, transparent 190deg, #fff 190deg, transparent 191.5deg, transparent 195deg, #fff 195deg, transparent 196.5deg, transparent 200deg, #fff 200deg, transparent 201.5deg, transparent 205deg, #fff 205deg, transparent 206.5deg, transparent 210deg, #fff 210deg, transparent 211.5deg, transparent 215deg, #fff 215deg, transparent 216.5deg, transparent 220deg, #fff 220deg, transparent 221.5deg, transparent 225deg, #fff 225deg, transparent 226.5deg, transparent 230deg, #fff 230deg, transparent 231.5deg, transparent 235deg, #fff 235deg, transparent 236.5deg, transparent 240deg, #fff 240deg, transparent 241.5deg, transparent 245deg, #fff 245deg, transparent 246.5deg, transparent 250deg, #fff 250deg, transparent 251.5deg, transparent 255deg, #fff 255deg, transparent 256.5deg, transparent 260deg, #fff 260deg, transparent 261.5deg, transparent 265deg, #fff 265deg, transparent 266.5deg, transparent 270deg, #fff 270deg, transparent 271.5deg, transparent 275deg, #fff 275deg, transparent 276.5deg, transparent 280deg, #fff 280deg, transparent 281.5deg, transparent 285deg, #fff 285deg, transparent 286.5deg, transparent 290deg, #fff 290deg, transparent 291.5deg, transparent 295deg, #fff 295deg, transparent 296.5deg, transparent 300deg, #fff 300deg, transparent 301.5deg, transparent 305deg, #fff 305deg, transparent 306.5deg, transparent 310deg, #fff 310deg, transparent 311.5deg, transparent 315deg, #fff 315deg, transparent 316.5deg, transparent 320deg, #fff 320deg, transparent 321.5deg, transparent 325deg, #fff 325deg, transparent 326.5deg, transparent 330deg, #fff 330deg, transparent 331.5deg, transparent 335deg, #fff 335deg, transparent 336.5deg, transparent 340deg, #fff 340deg, transparent 341.5deg, transparent 345deg, #fff 345deg, transparent 346.5deg, transparent 350deg, #fff 350deg, transparent 351.5deg, transparent 355deg, #fff 355deg, transparent 356.5deg, transparent 360deg)",
            }}
          />

          {/* Impact starburst behind title */}
          <div
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              background: "#fff",
            }}
          />

          <div className="relative flex flex-col items-center px-4 py-10 md:py-16 text-center">
            {/* Corner panels -- nav + lang */}
            <div className="absolute left-3 top-3 flex gap-2">
              <Link
                href="/10"
                className="border-[3px] border-[#333] bg-[#151515] px-3 py-1 text-sm font-bold tracking-wide transition-colors hover:bg-[#e60012] hover:text-white hover:border-[#e60012]"
                style={{ fontFamily: "var(--font-bangers)" }}
              >
                &larr; Zpet
              </Link>
            </div>
            <div className="absolute right-3 top-3">
              <div className="flex border-[3px] border-[#333]">
                <button
                  onClick={() => setLang("cz")}
                  className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    lang === "cz"
                      ? "bg-[#e8e4e0] text-[#0a0a0a]"
                      : "bg-[#151515] text-[#e8e4e0] hover:bg-[#222]"
                  }`}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    lang === "en"
                      ? "bg-[#e8e4e0] text-[#0a0a0a]"
                      : "bg-[#151515] text-[#e8e4e0] hover:bg-[#222]"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* SFX decoration */}
            <span
              className="absolute left-6 top-14 -rotate-12 text-4xl font-black opacity-[0.07] md:text-6xl"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              BOOM!
            </span>
            <span
              className="absolute bottom-6 right-8 rotate-6 text-3xl font-black opacity-[0.07] md:text-5xl"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              CRACK!
            </span>

            {/* Date + meta */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <span className="border-[2px] border-[#e60012] bg-[#e60012] px-3 py-1 text-xs font-bold text-white">
                {article.date}
              </span>
              <span className="text-xs font-bold opacity-50">
                {article.readTime} min read
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-[2px] border-[#444] px-2 py-0.5 text-xs font-bold uppercase text-[#e8e4e0]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Main title with impact */}
            <div className="relative max-w-3xl">
              {/* Red impact flash */}
              <div
                className="absolute left-1/2 top-1/2 h-[120%] w-[110%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  clipPath:
                    "polygon(50% 0%, 63% 28%, 100% 15%, 75% 50%, 100% 85%, 63% 72%, 50% 100%, 37% 72%, 0% 85%, 25% 50%, 0% 15%, 37% 28%)",
                  background: "#e60012",
                  opacity: 0.08,
                }}
              />
              <h1
                className="relative text-3xl leading-tight tracking-wider md:text-5xl lg:text-6xl"
                style={{
                  fontFamily: "var(--font-bangers)",
                  textShadow: "2px 2px 0 #e60012, -1px -1px 0 #000",
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          {/* Bottom red accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#e60012]" />
        </section>

        {/* ════════════════════════════════════════════
            PANEL 2 — ARTICLE CONTENT
        ════════════════════════════════════════════ */}
        <section className="relative mb-1 overflow-hidden border-[4px] border-[#333] bg-[#151515]">
          {/* Screentone on right side */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-1/4 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "5px 5px",
            }}
          />

          {/* Panel number */}
          <span className="absolute right-4 top-3 text-2xl font-black opacity-20">
            {panelNumber(0)}
          </span>

          <div className="relative px-5 py-8 md:px-10 md:py-12">
            {/* Narration box header */}
            <div className="mb-8 inline-block border-[2px] border-[#333] bg-[#e8e4e0] px-5 py-2 text-[#0a0a0a]">
              <span
                className="text-xs tracking-[0.3em] uppercase md:text-sm"
                style={{ fontFamily: "var(--font-bangers)" }}
              >
                THE STORY SO FAR...
              </span>
            </div>

            {/* Article paragraphs as sub-panels */}
            <div className="space-y-4">
              {paragraphs.map((paragraph, i) => {
                const isEven = i % 2 === 0;
                const hasBorderLeft = i % 3 === 0;
                const hasBorderRight = i % 3 === 1;

                return (
                  <div
                    key={i}
                    className={`relative border-[3px] border-[#2a2a2a] bg-[#111] p-5 md:p-6 ${
                      hasBorderLeft
                        ? "border-l-[5px] border-l-[#e60012]"
                        : hasBorderRight
                          ? "border-r-[5px] border-r-[#e60012]"
                          : ""
                    }`}
                  >
                    {/* Sub-panel number */}
                    <span className="absolute right-3 top-2 text-sm font-black opacity-10">
                      {panelNumber(i)}
                    </span>

                    {/* Subtle screentone on alternating panels */}
                    {isEven && (
                      <div
                        className="pointer-events-none absolute inset-0 opacity-[0.03]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, #fff 0.6px, transparent 0.6px)",
                          backgroundSize: "4px 4px",
                        }}
                      />
                    )}

                    {/* SFX watermark on some panels */}
                    {i < sfx.length && (
                      <span
                        className="absolute bottom-2 right-4 text-2xl font-black opacity-[0.03] md:text-3xl"
                        style={{ fontFamily: "var(--font-bangers)" }}
                      >
                        {sfx[i % sfx.length]}
                      </span>
                    )}

                    <p
                      className="relative text-sm leading-relaxed md:text-base opacity-85"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {paragraph}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PANEL 3 — SOURCES (narration strip)
        ════════════════════════════════════════════ */}
        <section className="relative mb-1 overflow-hidden border-[4px] border-[#333] bg-[#151515]">
          {/* Panel number */}
          <span className="absolute right-4 top-3 text-2xl font-black opacity-20">
            {panelNumber(1)}
          </span>

          {/* Narration box header */}
          <div className="border-b-[3px] border-[#333] bg-[#e8e4e0] px-5 py-3 text-[#0a0a0a]">
            <span
              className="text-sm tracking-[0.2em] uppercase md:text-base"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              SOURCES &amp; REFERENCES
            </span>
          </div>

          {/* Speed lines from right */}
          <div
            className="pointer-events-none absolute -right-[150px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 opacity-[0.04]"
            style={{
              backgroundImage:
                "conic-gradient(from 180deg at 0% 50%, #fff 0deg, transparent 1.5deg, transparent 8deg, #fff 8deg, transparent 9.5deg, transparent 16deg, #fff 16deg, transparent 17.5deg, transparent 24deg, #fff 24deg, transparent 25.5deg, transparent 32deg, #fff 32deg, transparent 33.5deg, transparent 40deg, #fff 40deg, transparent 41.5deg, transparent 48deg, #fff 48deg, transparent 49.5deg, transparent 360deg)",
            }}
          />

          <div className="relative px-5 py-6 md:px-8">
            <div className="space-y-3">
              {article.sources.map((source, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-[2px] border-[#2a2a2a] bg-[#111] px-4 py-3 transition-colors hover:border-[#444]"
                >
                  {/* Type badge */}
                  <span
                    className={`shrink-0 border-[2px] border-[#333] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sourceBadgeColor[source.type]}`}
                  >
                    {sourceIcon[source.type]} {source.type}
                  </span>

                  {/* Source title + url */}
                  <div className="min-w-0 flex-1">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold leading-snug transition-colors hover:text-[#e60012]"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {source.title}
                    </a>
                    <p className="mt-0.5 truncate text-xs opacity-30">
                      {source.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SFX */}
          <span
            className="absolute bottom-3 right-6 text-4xl font-black opacity-[0.04] md:text-5xl"
            style={{ fontFamily: "var(--font-bangers)" }}
          >
            WHOOSH!
          </span>
        </section>

        {/* ════════════════════════════════════════════
            PANEL 4 — AI COMMENTS (speech bubbles)
        ════════════════════════════════════════════ */}
        <section className="mb-1 border-[4px] border-[#333] bg-[#151515]">
          {/* Panel header -- narration box */}
          <div className="border-b-[3px] border-[#333] bg-[#e8e4e0] px-5 py-3 text-[#0a0a0a]">
            <span
              className="text-sm tracking-[0.2em] uppercase md:text-base"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              Meanwhile, at the AI Labs...
            </span>
          </div>

          {/* Panel number */}
          <div className="relative">
            <span className="absolute right-4 top-3 text-2xl font-black opacity-20">
              {panelNumber(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {article.aiComments.map((comment, i) => {
              const bubbleStyles = [
                /* Normal speech bubble */
                "rounded-2xl rounded-bl-sm",
                /* Spiky / emphasis bubble */
                "",
                /* Thought bubble */
                "rounded-[40%]",
              ];
              const bubbleClass = bubbleStyles[i % 3];
              const isSpiky = i % 3 === 1;
              const isThought = i % 3 === 2;

              return (
                <div
                  key={comment.model}
                  className={`relative flex flex-col items-center px-5 py-8 md:py-10 ${
                    i < article.aiComments.length - 1
                      ? "border-b-[3px] border-[#333] md:border-b-0 md:border-r-[3px]"
                      : ""
                  }`}
                >
                  {/* SFX behind avatar */}
                  <span
                    className="absolute left-1/2 top-6 -translate-x-1/2 text-4xl font-black opacity-[0.04] md:text-5xl"
                    style={{ fontFamily: "var(--font-bangers)" }}
                  >
                    {sfx[(i + 3) % sfx.length]}
                  </span>

                  {/* Avatar circle */}
                  <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#444] bg-[#1a1a1a] text-2xl shadow-[3px_3px_0_#e60012]">
                    {comment.avatar}
                  </div>

                  {/* Model name */}
                  <span
                    className="mb-3 text-sm tracking-wider"
                    style={{ fontFamily: "var(--font-bangers)" }}
                  >
                    {comment.model}
                  </span>

                  {/* Speech bubble */}
                  {isSpiky ? (
                    /* Spiky emphasis bubble */
                    <div className="relative w-full max-w-[260px]">
                      <div
                        className="relative border-[3px] border-[#444] bg-[#1a1a1a] px-4 py-3"
                        style={{
                          clipPath:
                            "polygon(3% 8%, 8% 0%, 15% 10%, 25% 2%, 33% 8%, 45% 0%, 55% 7%, 65% 1%, 73% 9%, 82% 2%, 90% 8%, 97% 3%, 100% 15%, 98% 30%, 100% 45%, 97% 58%, 100% 72%, 98% 85%, 100% 92%, 93% 100%, 82% 95%, 70% 100%, 58% 96%, 45% 100%, 33% 96%, 20% 100%, 8% 96%, 0% 100%, 2% 88%, 0% 72%, 3% 58%, 0% 45%, 2% 30%, 0% 15%)",
                        }}
                      >
                        <p
                          className="text-xs leading-relaxed opacity-80"
                          style={{
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div
                        className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2"
                        style={{
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderBottom: "12px solid #444",
                        }}
                      />
                    </div>
                  ) : isThought ? (
                    /* Thought bubble */
                    <div className="relative w-full max-w-[260px]">
                      <div className="rounded-[40%] border-[3px] border-[#444] bg-[#1a1a1a] px-5 py-4">
                        <p
                          className="text-center text-xs leading-relaxed opacity-80"
                          style={{
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* Thought dots */}
                      <div className="absolute -top-2 left-1/2 -translate-x-3">
                        <div className="h-3 w-3 rounded-full border-[2px] border-[#444] bg-[#1a1a1a]" />
                      </div>
                      <div className="absolute -top-5 left-1/2 translate-x-1">
                        <div className="h-2 w-2 rounded-full border-[2px] border-[#444] bg-[#1a1a1a]" />
                      </div>
                    </div>
                  ) : (
                    /* Normal speech bubble */
                    <div className="relative w-full max-w-[260px]">
                      <div
                        className={`border-[3px] border-[#444] bg-[#1a1a1a] px-4 py-3 ${bubbleClass}`}
                      >
                        <p
                          className="text-xs leading-relaxed opacity-80"
                          style={{
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div
                        className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2"
                        style={{
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderBottom: "10px solid #444",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER — Branding panel
        ════════════════════════════════════════════ */}
        <footer className="relative overflow-hidden border-[4px] border-[#333] bg-[#151515]">
          {/* Speed lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 80% 50%, #fff 0deg, transparent 1deg, transparent 6deg, #fff 6deg, transparent 7deg, transparent 12deg, #fff 12deg, transparent 13deg, transparent 18deg, #fff 18deg, transparent 19deg, transparent 24deg, #fff 24deg, transparent 25deg, transparent 30deg, #fff 30deg, transparent 31deg, transparent 36deg, #fff 36deg, transparent 37deg, transparent 42deg, #fff 42deg, transparent 43deg, transparent 48deg, #fff 48deg, transparent 49deg, transparent 360deg)",
            }}
          />

          <div className="relative flex flex-col items-center px-6 py-10 md:py-14 text-center">
            <p
              className="text-4xl md:text-6xl"
              style={{
                fontFamily: "var(--font-bangers)",
                textShadow: "2px 2px 0 #e60012",
              }}
            >
              BEROU NAM PRACI
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest opacity-50">
              AI News &middot; Daily &middot; Generated by AI
            </p>
            <p className="mt-2 text-xs opacity-30">
              &copy; 2026 BEROU NAM PRACI
            </p>
          </div>

          {/* Bottom red accent bar */}
          <div className="h-2 bg-[#e60012]" />
        </footer>
      </div>
    </div>
  );
}
