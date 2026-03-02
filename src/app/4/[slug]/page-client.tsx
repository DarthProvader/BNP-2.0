"use client";

import { useState } from "react";
import { Courier_Prime, Staatliches } from "next/font/google";
import Link from "next/link";
import type { Article } from "@/lib/mockData";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
});

const staatliches = Staatliches({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-staatliches",
});

function getFileNumber(index: number) {
  return `BNP-2026-${String(index + 1).padStart(3, "0")}`;
}

function getClassification(index: number) {
  const levels = [
    "TOP SECRET",
    "SECRET",
    "CONFIDENTIAL",
    "SECRET",
    "CONFIDENTIAL",
  ];
  return levels[index % levels.length];
}

function getAnalystCodename(model: string) {
  const codenames: Record<string, string> = {
    "GPT-4o": "AGENT EMERALD",
    Gemini: "AGENT SAPPHIRE",
    Llama: "AGENT VIOLET",
  };
  return codenames[model] || "AGENT UNKNOWN";
}

function getAnalystDept(model: string) {
  const depts: Record<string, string> = {
    "GPT-4o": "OPENAI LIAISON DIVISION",
    Gemini: "GOOGLE DEEPMIND SECTION",
    Llama: "META OPEN-SOURCE BUREAU",
  };
  return depts[model] || "UNCLASSIFIED DIVISION";
}

function formatDateStamp(dateStr: string) {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function getSourceIcon(type: string) {
  switch (type) {
    case "youtube":
      return "[VIDEO]";
    case "twitter":
      return "[SIGINT]";
    case "podcast":
      return "[AUDIO]";
    default:
      return "[OSINT]";
  }
}

export default function PageClient({ article }: { article: Article }) {
  const [lang, setLang] = useState<"cs" | "en">("cs");

  const fileNum = getFileNumber(0);
  const classification = getClassification(0);
  const title = lang === "cs" ? article.title : article.titleEn;
  const content = lang === "cs" ? article.content : article.contentEn;
  const excerpt = lang === "cs" ? article.excerpt : article.excerptEn;

  return (
    <div
      className={`${courierPrime.variable} ${staatliches.variable} min-h-screen relative`}
    >
      <style>{classifiedStyles}</style>

      <div className="classified-page min-h-screen">
        {/* ===== HEADER ===== */}
        <header className="relative border-b border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Return to index */}
            <div className="mb-4">
              <Link
                href="/4"
                className="text-neutral-500 hover:text-neutral-300 text-xs tracking-[0.2em] uppercase transition-colors"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                &larr; RETURN TO INDEX
              </Link>
            </div>

            {/* Manila strip with title */}
            <div className="bg-[#d4c5a9] px-6 py-4 relative inline-block">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#b8a88a]" />
              <h1
                className="text-[#1a1a1a] text-2xl sm:text-3xl tracking-[0.15em] leading-none"
                style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
              >
                BEROU NAM PRACI
              </h1>
              <div
                className="text-[#3a3a3a] text-[0.65rem] tracking-[0.25em] mt-1 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                DIVISION OF AI INTELLIGENCE &bull; DOSSIER VIEW
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b8a88a]" />
            </div>

            {/* File reference */}
            <div
              className="text-neutral-600 text-[0.6rem] tracking-[0.3em] mt-3 uppercase"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              REF: {fileNum} &nbsp;&nbsp;|&nbsp;&nbsp; CLASSIFICATION:{" "}
              {classification}
            </div>

            {/* Language toggle as document tabs */}
            <div className="flex items-end gap-0 mt-6 border-b border-[#b8a88a]">
              <div className="doc-tab font-bold" style={{ background: "#e8dcc8" }}>
                DOSSIER {fileNum}
              </div>
              <div className="flex-1" />
              <div className="flex gap-1 pb-1">
                <button
                  onClick={() => setLang("cs")}
                  className={`text-[0.6rem] tracking-[0.15em] border px-2 py-1 cursor-pointer transition-colors ${
                    lang === "cs"
                      ? "text-neutral-200 border-neutral-400 bg-neutral-800"
                      : "text-neutral-600 border-neutral-800 hover:text-neutral-300 hover:border-neutral-500"
                  }`}
                  style={{ fontFamily: "var(--font-courier), monospace" }}
                >
                  CZ-01
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`text-[0.6rem] tracking-[0.15em] border px-2 py-1 cursor-pointer transition-colors ${
                    lang === "en"
                      ? "text-neutral-200 border-neutral-400 bg-neutral-800"
                      : "text-neutral-600 border-neutral-800 hover:text-neutral-300 hover:border-neutral-500"
                  }`}
                  style={{ fontFamily: "var(--font-courier), monospace" }}
                >
                  EN-02
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ===== FULL DOCUMENT ===== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="paper-bg p-6 sm:p-10 relative shadow-2xl overflow-hidden">
            {/* Watermark */}
            <div className="watermark">EYES ONLY</div>

            {/* Coffee stain */}
            <div
              className="coffee-stain"
              style={{ top: "-30px", right: "80px" }}
            />
            {/* Second coffee stain, lower */}
            <div
              className="coffee-stain"
              style={{ bottom: "120px", left: "-40px", width: "90px", height: "90px" }}
            />

            {/* Paper burn effect */}
            <div className="paper-burn-bottom" />

            {/* Classified stamp */}
            <div className="stamp-classified">CLASSIFIED</div>

            {/* Staple mark */}
            <div
              className="absolute top-3 left-4 w-[3px] h-[14px] rounded-sm"
              style={{
                background: "linear-gradient(to bottom, #999, #666, #999)",
                transform: "rotate(-5deg)",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            />
            {/* Second staple */}
            <div
              className="absolute top-8 left-5 w-[3px] h-[14px] rounded-sm"
              style={{
                background: "linear-gradient(to bottom, #888, #555, #888)",
                transform: "rotate(-3deg)",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            />

            {/* Document header */}
            <div className="doc-header-line relative z-[4]">
              <div
                className="text-[0.65rem] tracking-[0.3em] text-[#3a3a3a] uppercase mb-1"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                FILE NO. {fileNum} &nbsp;&nbsp;&bull;&nbsp;&nbsp; DIVISION OF AI
                INTELLIGENCE
              </div>
            </div>

            {/* Article title */}
            <h2
              className="text-[1.6rem] sm:text-[2.2rem] leading-tight text-[#1a1a1a] tracking-[0.04em] mt-4 mb-6 relative z-[4]"
              style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
            >
              {title.toUpperCase()}
            </h2>

            {/* Metadata table */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6 mb-6 p-4 border border-[#b8a88a] bg-[rgba(212,197,169,0.3)] text-[0.7rem] tracking-wider relative z-[4]"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              <div>
                <span className="text-[#666] block text-[0.6rem] tracking-[0.2em]">
                  DATE:
                </span>
                <span className="text-[#1a1a1a] font-bold">
                  {formatDateStamp(article.date)}
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[0.6rem] tracking-[0.2em]">
                  SUBJECT:
                </span>
                <span className="text-[#1a1a1a] font-bold">
                  {article.tags[0]?.toUpperCase() || "GENERAL"}
                </span>
              </div>
              <div>
                <span className="text-[#666] block text-[0.6rem] tracking-[0.2em]">
                  CLASSIFICATION:
                </span>
                <span className="text-[#cc0000] font-bold">{classification}</span>
              </div>
              <div>
                <span className="text-[#666] block text-[0.6rem] tracking-[0.2em]">
                  SOURCES:
                </span>
                <span className="text-[#1a1a1a] font-bold">
                  {article.sources.length} VERIFIED
                </span>
              </div>
            </div>

            {/* Department tags */}
            <div className="flex flex-wrap gap-2 mb-6 relative z-[4]">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="dept-tag text-[#3a3a3a] border-[#999]"
                >
                  DEPT: {tag.toUpperCase()}
                </span>
              ))}
              <span
                className="text-[0.6rem] tracking-[0.15em] text-[#888] uppercase ml-2 self-center"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                EST. READ TIME: {article.readTime} MIN
              </span>
            </div>

            <div className="w-full h-[2px] bg-[#1a1a1a] mb-8 relative z-[4]" />

            {/* BRIEFING SUMMARY */}
            <div className="mb-8 relative z-[4]">
              <div
                className="text-[0.6rem] tracking-[0.3em] text-[#666] uppercase mb-2"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                EXECUTIVE SUMMARY:
              </div>
              <p
                className="text-[0.85rem] text-[#3a3a3a] leading-relaxed tracking-wide italic border-l-2 border-[#b8a88a] pl-4"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                {excerpt}
              </p>
            </div>

            <div className="w-full h-[1px] bg-[#b8a88a] mb-8 relative z-[4]" />

            {/* Full document body */}
            <div
              className="text-[0.6rem] tracking-[0.3em] text-[#666] uppercase mb-4 relative z-[4]"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              FULL INTELLIGENCE REPORT:
            </div>
            <div className="typewriter-text text-sm text-[#1a1a1a] relative z-[4]">
              {content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Sources section */}
            <div className="mt-10 pt-6 border-t-2 border-[#1a1a1a] relative z-[4]">
              <div
                className="text-[0.65rem] tracking-[0.3em] text-[#3a3a3a] uppercase mb-4"
                style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
              >
                REFERENCED MATERIALS
              </div>
              <div className="space-y-2">
                {article.sources.map((source, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-[0.7rem] tracking-wider"
                    style={{ fontFamily: "var(--font-courier), monospace" }}
                  >
                    <span className="text-[#cc0000] font-bold whitespace-nowrap">
                      {getSourceIcon(source.type)}
                    </span>
                    <span className="text-[#1a1a1a]">
                      <span className="font-bold">SRC-{String(i + 1).padStart(2, "0")}:</span>{" "}
                      {source.title}
                    </span>
                    <span className="text-[#888] ml-auto whitespace-nowrap">
                      {source.type.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="text-[0.55rem] tracking-[0.2em] text-[#888] uppercase mt-3"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                ALL SOURCES INDEPENDENTLY VERIFIED BY DIVISION ANALYSTS
              </div>
            </div>

            {/* End of document marker */}
            <div className="mt-8 pt-4 border-t border-[#b8a88a] flex items-center justify-between relative z-[4]">
              <span
                className="text-[0.6rem] tracking-[0.2em] text-[#666] uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                END OF REPORT &mdash; FILE {fileNum}
              </span>
              <div
                className="text-[#cc0000] border-2 border-[#cc0000] px-3 py-0.5 text-[0.7rem] tracking-[0.15em] uppercase"
                style={{
                  fontFamily: "var(--font-staatliches), sans-serif",
                  transform: "rotate(2deg)",
                  opacity: 0.8,
                }}
              >
                {classification}
              </div>
            </div>
          </div>
        </section>

        {/* ===== ANALYST REPORTS (AI Comments) ===== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="border-t border-neutral-800 pt-8">
            <div
              className="text-[0.6rem] tracking-[0.3em] text-neutral-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              SECTION II — ANALYST REPORTS
            </div>
            <h2
              className="text-[1.4rem] text-neutral-300 tracking-[0.1em] mb-8"
              style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
            >
              INTELLIGENCE ANALYST ASSESSMENTS
            </h2>

            <div className="space-y-6">
              {article.aiComments.map((comment, i) => (
                <div
                  key={i}
                  className="analyst-report p-5 sm:p-6 shadow-lg relative overflow-hidden"
                  style={{
                    transform: `rotate(${i === 0 ? -0.4 : i === 1 ? 0.3 : -0.2}deg)`,
                  }}
                >
                  {/* Paper burn */}
                  <div className="paper-burn-bottom" />

                  {/* Staple */}
                  <div
                    className="absolute top-3 left-4 w-[3px] h-[12px] rounded-sm"
                    style={{
                      background:
                        "linear-gradient(to bottom, #888, #555, #888)",
                      transform: "rotate(-5deg)",
                      boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Report header */}
                  <div className="doc-header-line mb-4">
                    <div className="flex items-start justify-between">
                      <div
                        className="text-[0.55rem] tracking-[0.25em] text-[#666] uppercase"
                        style={{
                          fontFamily: "var(--font-courier), monospace",
                        }}
                      >
                        ANALYST REPORT &mdash; REF: AR-{fileNum}-
                        {String(i + 1).padStart(3, "0")}
                      </div>
                      <div
                        className="text-[0.5rem] tracking-[0.15em] text-[#cc0000] border border-[#cc0000] px-2 py-0.5 uppercase"
                        style={{
                          fontFamily: "var(--font-staatliches), sans-serif",
                          transform: "rotate(2deg)",
                        }}
                      >
                        INTERNAL USE ONLY
                      </div>
                    </div>
                  </div>

                  {/* Analyst identity */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-2xl">{comment.avatar}</div>
                    <div>
                      <div
                        className="text-[0.85rem] font-bold text-[#1a1a1a] tracking-[0.15em] uppercase"
                        style={{
                          fontFamily: "var(--font-staatliches), sans-serif",
                        }}
                      >
                        {getAnalystCodename(comment.model)}
                      </div>
                      <div
                        className="text-[0.55rem] text-[#666] tracking-[0.1em] uppercase"
                        style={{
                          fontFamily: "var(--font-courier), monospace",
                        }}
                      >
                        {getAnalystDept(comment.model)} &bull; CLEARANCE:{" "}
                        {classification}
                      </div>
                      <div
                        className="text-[0.5rem] text-[#888] tracking-[0.1em]"
                        style={{
                          fontFamily: "var(--font-courier), monospace",
                        }}
                      >
                        MODEL DESIGNATION: {comment.model}
                      </div>
                    </div>
                  </div>

                  {/* Report text */}
                  <div
                    className="text-[0.6rem] tracking-[0.25em] text-[#666] uppercase mb-2"
                    style={{
                      fontFamily: "var(--font-courier), monospace",
                    }}
                  >
                    ASSESSMENT:
                  </div>
                  <div className="typewriter-text relative z-[4]">
                    <p className="text-[0.8rem] text-[#3a3a3a] leading-relaxed tracking-wide !text-indent-0">
                      &ldquo;{comment.comment}&rdquo;
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    className="mt-4 pt-3 border-t border-[#b8a88a] flex items-center justify-between text-[0.5rem] tracking-[0.2em] text-[#888] uppercase relative z-[4]"
                    style={{
                      fontFamily: "var(--font-courier), monospace",
                    }}
                  >
                    <span>
                      ASSESSMENT FILED: {formatDateStamp(article.date)}
                    </span>
                    <span>
                      REPORT STATUS: VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-neutral-800 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-[1px] bg-neutral-700 mx-auto" />
              <p
                className="text-[0.6rem] tracking-[0.3em] text-neutral-600 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                END OF FILE &mdash; DOSSIER {fileNum}
              </p>
              <p
                className="text-[0.55rem] tracking-[0.25em] text-neutral-700 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                DOCUMENT CLASSIFICATION: {classification} &bull; DISTRIBUTION:
                DIVISION PERSONNEL ONLY
              </p>
              <p
                className="text-[0.5rem] tracking-[0.2em] text-neutral-700 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                DIVISION OF AI INTELLIGENCE &bull; BEROU NAM PRACI &bull; EST.
                2026
              </p>
              <p
                className="text-[0.5rem] tracking-[0.15em] text-neutral-800 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                UNAUTHORIZED REPRODUCTION IS SUBJECT TO PENALTIES UNDER SECTION
                7.4.1
              </p>
              <div className="w-16 h-[1px] bg-neutral-700 mx-auto" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const classifiedStyles = `
  :root {
    --charcoal: #1a1a1a;
    --manila: #d4c5a9;
    --manila-dark: #b8a88a;
    --stamp-red: #cc0000;
    --stamp-green: #2d5016;
    --paper: #e8dcc8;
    --paper-dark: #d4c5a9;
    --paper-lines: #c4b494;
    --ink: #1a1a1a;
    --ink-faded: #3a3a3a;
    --desk: #111111;
  }

  .classified-page {
    background-color: var(--desk);
    color: #c0c0c0;
    font-family: var(--font-courier), 'Courier New', monospace;
  }

  /* Desk texture */
  .classified-page::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .classified-page > * {
    position: relative;
    z-index: 1;
  }

  /* Paper texture with lined background */
  .paper-bg {
    background-color: var(--paper);
    background-image:
      repeating-linear-gradient(
        transparent,
        transparent 27px,
        var(--paper-lines) 27px,
        var(--paper-lines) 28px
      );
    color: var(--ink);
    position: relative;
  }

  /* Manila folder tab */
  .manila-tab {
    background-color: var(--manila);
    color: var(--ink);
    position: relative;
  }
  .manila-tab::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 8px;
    height: 100%;
    background: var(--manila);
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
  }
  .manila-tab::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 0;
    width: 8px;
    height: 100%;
    background: var(--manila);
    clip-path: polygon(0 0, 100% 100%, 0 100%);
  }

  /* Classified stamp */
  .stamp-classified {
    font-family: var(--font-staatliches), sans-serif;
    color: var(--stamp-red);
    border: 3px double var(--stamp-red);
    padding: 4px 16px;
    transform: rotate(-6deg);
    display: inline-block;
    font-size: 1.5rem;
    letter-spacing: 4px;
    opacity: 0.85;
    text-transform: uppercase;
    line-height: 1.2;
    position: absolute;
    top: 16px;
    right: 24px;
    z-index: 10;
    text-shadow: 1px 1px 0 rgba(204, 0, 0, 0.3);
  }

  /* Coffee stain */
  .coffee-stain {
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(ellipse at center,
      transparent 40%,
      rgba(139, 90, 43, 0.08) 42%,
      rgba(139, 90, 43, 0.12) 50%,
      rgba(139, 90, 43, 0.06) 58%,
      transparent 60%
    );
    pointer-events: none;
    z-index: 5;
  }

  /* EYES ONLY watermark */
  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-35deg);
    font-family: var(--font-staatliches), sans-serif;
    font-size: 5rem;
    color: rgba(204, 0, 0, 0.04);
    letter-spacing: 16px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
    user-select: none;
  }

  /* Paper edge burn */
  .paper-burn-bottom {
    background: linear-gradient(to bottom,
      transparent 85%,
      rgba(139, 100, 50, 0.15) 92%,
      rgba(80, 50, 20, 0.25) 100%
    );
    position: absolute;
    bottom: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 3;
  }

  /* Typewriter uneven spacing */
  .typewriter-text {
    letter-spacing: 0.04em;
    word-spacing: 0.12em;
    line-height: 1.85;
    font-family: var(--font-courier), 'Courier New', monospace;
  }

  .typewriter-text p {
    text-indent: 2em;
    margin-bottom: 0.75em;
  }

  .typewriter-text p.\\!text-indent-0 {
    text-indent: 0;
  }

  /* Document header line */
  .doc-header-line {
    border-bottom: 2px solid var(--ink);
    padding-bottom: 8px;
    margin-bottom: 12px;
  }

  /* Navigation tabs as document tabs */
  .doc-tab {
    background: var(--manila);
    color: var(--ink);
    border: 1px solid var(--manila-dark);
    border-bottom: none;
    padding: 6px 16px;
    font-family: var(--font-courier), monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    top: 1px;
  }

  /* Department tags */
  .dept-tag {
    font-family: var(--font-courier), monospace;
    font-size: 0.65rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid var(--ink-faded);
    padding: 2px 8px;
    background: rgba(26, 26, 26, 0.06);
    display: inline-block;
  }

  /* Analyst report */
  .analyst-report {
    background-color: var(--paper);
    background-image:
      repeating-linear-gradient(
        transparent,
        transparent 23px,
        var(--paper-lines) 23px,
        var(--paper-lines) 24px
      );
    color: var(--ink);
    position: relative;
  }
`;
