"use client";

import type { Article } from "@/lib/mockData";
import ArticleContent from "@/components/ArticleContent";
import { useState, useEffect } from "react";
import { Exo_2, Inconsolata } from "next/font/google";
import Link from "next/link";

const exo2 = Exo_2({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-exo2",
});

const inconsolata = Inconsolata({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inconsolata",
});

/* ------------------------------------------------------------------ */
/*  Reusable HUD components                                           */
/* ------------------------------------------------------------------ */

function SignalBars({ strength }: { strength: number }) {
  return (
    <span className="inline-flex items-end gap-[2px]">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`inline-block w-[3px] ${
            i <= strength ? "bg-[#00e5ff]" : "bg-[#00e5ff]/20"
          }`}
          style={{ height: `${4 + i * 3}px` }}
        />
      ))}
    </span>
  );
}

function CircularProgress({ value, max }: { value: number; max: number }) {
  const pct = (value / max) * 100;
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="36" height="36" className="inline-block -mt-0.5">
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="#00e5ff20"
        strokeWidth="2"
      />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="#00e5ff"
        strokeWidth="2"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 18 18)"
      />
      <text
        x="18"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-[#00e5ff] text-[8px] font-[family-name:var(--font-inconsolata)]"
      >
        {value}m
      </text>
    </svg>
  );
}

function CornerBrackets({
  children,
  className = "",
  color = "#00e5ff",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span
        className="pointer-events-none absolute -left-1 -top-1 h-3 w-3"
        style={{
          borderLeft: `1px solid ${color}`,
          borderTop: `1px solid ${color}`,
          opacity: 0.6,
        }}
      />
      <span
        className="pointer-events-none absolute -right-1 -top-1 h-3 w-3"
        style={{
          borderRight: `1px solid ${color}`,
          borderTop: `1px solid ${color}`,
          opacity: 0.6,
        }}
      />
      <span
        className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3"
        style={{
          borderLeft: `1px solid ${color}`,
          borderBottom: `1px solid ${color}`,
          opacity: 0.6,
        }}
      />
      <span
        className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3"
        style={{
          borderRight: `1px solid ${color}`,
          borderBottom: `1px solid ${color}`,
          opacity: 0.6,
        }}
      />
      {children}
    </div>
  );
}

function HexBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex h-6 items-center bg-[#00e5ff]/10 px-2 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-wider text-[#00e5ff]/80"
      style={{
        clipPath:
          "polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%)",
      }}
    >
      {label}
    </span>
  );
}

function DiamondRule() {
  return (
    <div className="flex items-center gap-2 py-3">
      <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#00e5ff]/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[#00e5ff]/50" />
      <span className="h-1 w-1 rotate-45 bg-[#00e5ff]/30" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[#00e5ff]/50" />
      <div className="h-px flex-1 bg-linear-to-r from-[#00e5ff]/30 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Article Detail Page                                          */
/* ------------------------------------------------------------------ */

export default function ArticleDetail({
  article,
}: {
  article: Article;
}) {
  const [scanLine, setScanLine] = useState(0);
  const [hudTime, setHudTime] = useState("00:00:00");
  const [locked, setLocked] = useState(false);
  const [lang, setLang] = useState<"cs" | "en">("cs");

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setHudTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const anim = setInterval(() => {
      setScanLine((p) => (p >= 100 ? 0 : p + 0.5));
    }, 30);
    const lockTimer = setTimeout(() => setLocked(true), 2000);
    return () => {
      clearInterval(anim);
      clearTimeout(lockTimer);
    };
  }, []);

  const title = lang === "cs" ? article.title : article.titleEn;
  const content = lang === "cs" ? article.content : article.contentEn;
  const excerpt = lang === "cs" ? article.excerpt : article.excerptEn;
  // paragraphs split removed — using ArticleContent with react-markdown

  return (
    <div
      className={`${exo2.variable} ${inconsolata.variable} relative min-h-screen bg-[#030308] text-[#00e5ff] selection:bg-[#00e5ff] selection:text-[#030308]`}
    >
      {/* ── Global Styles ── */}
      <style jsx global>{`
        @keyframes hud-scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        @keyframes hud-pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes hud-ping {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes hud-flicker {
          0%,
          100% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          93% {
            opacity: 0.3;
          }
          94% {
            opacity: 1;
          }
          96% {
            opacity: 0.5;
          }
          97% {
            opacity: 1;
          }
        }
        .hud-flicker {
          animation: hud-flicker 4s infinite;
        }
      `}</style>

      {/* ── Dotted Grid BG ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #00e5ff 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Edge data readouts ── */}
      <div className="pointer-events-none fixed left-2 top-1/2 z-40 -translate-y-1/2 font-[family-name:var(--font-inconsolata)] text-[9px] text-[#00e5ff]/30 [writing-mode:vertical-lr]">
        SYS.LOAD: 42% | MEM: 2.4GB | NET: 128ms | FPS: 60
      </div>
      <div className="pointer-events-none fixed right-2 top-1/2 z-40 -translate-y-1/2 font-[family-name:var(--font-inconsolata)] text-[9px] text-[#00e5ff]/30 [writing-mode:vertical-rl]">
        FREQ: 2.4GHz | UPLINK: STABLE | LAT: 12ms | BAND: 5G-NR
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-3 pb-8 sm:px-6 lg:px-8">
        {/* ================================================================
            SYSTEM BAR
        ================================================================ */}
        <div className="flex items-center justify-between border-b border-[#00e5ff]/15 py-2 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.2em] text-[#00e5ff]/40">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#00e5ff]/60"
              style={{ animation: "hud-pulse 2s infinite" }}
            />
            SYS.STATUS: NOMINAL
          </span>
          <span className="hidden sm:inline">
            50.0755N, 14.4378E PRAHA
          </span>
          <span className="flex items-center gap-2">
            {hudTime}
            <SignalBars strength={4} />
          </span>
        </div>

        {/* ================================================================
            HEADER
        ================================================================ */}
        <header className="relative border-b border-[#00e5ff]/20 pb-3 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CornerBrackets className="inline-block px-3 py-1">
                <h1 className="font-[family-name:var(--font-exo2)] text-lg font-800 tracking-wider text-[#00e5ff] sm:text-xl hud-flicker">
                  DATA READOUT
                </h1>
              </CornerBrackets>
              <p className="mt-1 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.3em] text-[#00e5ff]/40">
                Article Intelligence // Detailed Analysis View
              </p>
            </div>

            <nav className="flex items-center gap-2 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.15em]">
              <Link
                href="/holographic"
                className="group flex items-center gap-1 border border-[#00e5ff]/20 px-2 py-1 text-[#00e5ff]/50 transition-all hover:border-[#00e5ff]/60 hover:text-[#00e5ff]"
              >
                <span className="text-[#ffc400]/60">&larr;</span> EXIT HUD
              </Link>
              <span className="border border-[#00e5ff]/20 px-2 py-1 text-[#00e5ff]/50">
                VAR.07
              </span>
              <div className="flex border border-[#00e5ff]/20">
                <button
                  onClick={() => setLang("cs")}
                  className={`px-2 py-1 transition-colors ${
                    lang === "cs"
                      ? "bg-[#00e5ff]/15 text-[#00e5ff]"
                      : "text-[#00e5ff]/30 hover:text-[#00e5ff]"
                  }`}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 transition-colors ${
                    lang === "en"
                      ? "bg-[#00e5ff]/15 text-[#00e5ff]"
                      : "text-[#00e5ff]/30 hover:text-[#00e5ff]"
                  }`}
                >
                  EN
                </button>
              </div>
            </nav>
          </div>

          <div className="absolute -bottom-px left-1/2 h-4 w-px bg-linear-to-b from-[#00e5ff]/40 to-transparent" />
        </header>

        {/* ================================================================
            TARGET PANEL
        ================================================================ */}
        <section className="relative mt-8">
          {/* Scan line */}
          <div
            className="pointer-events-none absolute left-0 z-20 h-px w-full bg-linear-to-r from-transparent via-[#00e5ff]/60 to-transparent"
            style={{ top: `${scanLine}%`, transition: "top 30ms linear" }}
          />

          <CornerBrackets className="relative overflow-hidden border border-[#00e5ff]/20 bg-[#00e5ff]/[0.03] p-4 sm:p-6 lg:p-8">
            {/* Status bar */}
            <div className="mb-4 flex flex-wrap items-center justify-between font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${locked ? "bg-[#ffc400]" : "bg-[#00e5ff]"}`}
                  style={{
                    animation: locked ? "none" : "hud-pulse 1.5s infinite",
                  }}
                />
                <span
                  className={locked ? "text-[#ffc400]" : "text-[#00e5ff]/60"}
                >
                  {locked ? "TARGET LOCKED" : "SCANNING..."}
                </span>
              </span>
              <span className="text-[#00e5ff]/40">
                ID: TGT-001 |
                PRI: HIGH | <SignalBars strength={4} />
              </span>
            </div>

            {/* Targeting reticle */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="h-40 w-40 rounded-full border border-[#00e5ff]/10 sm:h-56 sm:w-56" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5ff]/15 sm:h-36 sm:w-36" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5ff]/20 sm:h-16 sm:w-16" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-[#00e5ff]/10" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-[#00e5ff]/10" />
              {locked && (
                <div
                  className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffc400]/40"
                  style={{ animation: "hud-ping 2s infinite" }}
                />
              )}
            </div>

            {/* Content */}
            <div className="relative z-20">
              <p className="mb-2 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.3em] text-[#ffc400]/70">
                Target Acquired // Full Analysis
              </p>

              {/* ── Article Title ── */}
              <h2 className="mb-4 font-[family-name:var(--font-exo2)] text-xl font-700 leading-tight text-[#00e5ff] sm:text-2xl lg:text-3xl">
                {title}
              </h2>

              {/* ── Meta Data Readout ── */}
              <div className="mb-4 flex flex-wrap items-center gap-4 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.15em] text-[#00e5ff]/50">
                <span>DATE: {article.date}</span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-1">
                  READ: <CircularProgress value={article.readTime} max={10} />
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="flex items-center gap-1">
                  SRC: {article.sources.length} VERIFIED{" "}
                  <SignalBars strength={article.sources.length} />
                </span>
              </div>

              {/* ── Tags as HexBadges ── */}
              <div className="mb-4 flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <HexBadge key={t} label={t} />
                ))}
              </div>

              {/* ── Excerpt Panel ── */}
              <CornerBrackets className="border border-[#00e5ff]/15 bg-[#00e5ff]/[0.04] p-3 sm:p-4">
                <p className="font-[family-name:var(--font-inconsolata)] text-xs leading-relaxed text-[#00e5ff]/70 sm:text-sm">
                  {excerpt}
                </p>
              </CornerBrackets>
            </div>
          </CornerBrackets>

          <div className="mx-auto h-8 w-px bg-linear-to-b from-[#00e5ff]/30 to-transparent" />
        </section>

        {/* ================================================================
            BODY TEXT
        ================================================================ */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-3 font-[family-name:var(--font-inconsolata)] text-[10px] uppercase tracking-[0.3em] text-[#00e5ff]/40">
            <span>Data Stream // Full Content</span>
            <div className="h-px flex-1 bg-linear-to-r from-[#00e5ff]/20 to-transparent" />
          </div>

          <CornerBrackets className="border border-[#00e5ff]/15 bg-[#00e5ff]/[0.02] p-4 sm:p-6">
            <ArticleContent
              content={content}
              headingClassName="mt-6 mb-3 font-[family-name:var(--font-exo2)] text-base sm:text-lg font-bold text-[#00e5ff] uppercase tracking-wider first:mt-0"
              paragraphClassName="mb-4 font-[family-name:var(--font-inconsolata)] text-xs leading-relaxed text-[#00e5ff]/70 sm:text-sm"
              strongClassName="font-bold text-[#00e5ff]/90"
              emClassName="italic text-[#00e5ff]/50"
              linkClassName="text-[#00e5ff] underline"
            />
          </CornerBrackets>
        </section>

        <DiamondRule />

        {/* ================================================================
            SOURCES
        ================================================================ */}
        <section className="mb-6 mt-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-[family-name:var(--font-exo2)] text-sm font-700 uppercase tracking-[0.3em] text-[#00e5ff]/70">
              Sources
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-[#00e5ff]/20 to-transparent" />
            <span className="font-[family-name:var(--font-inconsolata)] text-[9px] uppercase tracking-[0.2em] text-[#00e5ff]/30">
              {article.sources.length} Verified
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {article.sources.map((s, i) => {
              const typeAbbr =
                s.type === "youtube"
                  ? "YT"
                  : s.type === "twitter"
                    ? "TW"
                    : s.type === "podcast"
                      ? "POD"
                      : "WEB";
              return (
                <CornerBrackets
                  key={i}
                  className="flex items-center gap-3 border border-[#00e5ff]/10 bg-[#00e5ff]/[0.02] px-3 py-2"
                >
                  <span className="flex h-8 w-10 shrink-0 items-center justify-center border border-[#ffc400]/20 bg-[#ffc400]/[0.08] font-[family-name:var(--font-exo2)] text-xs font-700 text-[#ffc400]/80">
                    {typeAbbr}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-[family-name:var(--font-inconsolata)] text-[11px] text-[#00e5ff]/60">
                      {s.title}
                    </p>
                    <p className="truncate font-[family-name:var(--font-inconsolata)] text-[9px] text-[#00e5ff]/25">
                      {s.url}
                    </p>
                  </div>
                  <span className="font-[family-name:var(--font-inconsolata)] text-[9px] text-[#00e5ff]/20">
                    SRC-{String(i + 1).padStart(2, "0")}
                  </span>
                </CornerBrackets>
              );
            })}
          </div>
        </section>

        <DiamondRule />

        {/* ================================================================
            AI COMMENTS -- ANALYST FEED
        ================================================================ */}
        <section className="mb-8 mt-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-[family-name:var(--font-exo2)] text-sm font-700 uppercase tracking-[0.3em] text-[#00e5ff]/70">
              Analyst Feed
            </span>
            <div className="h-px flex-1 bg-linear-to-r from-[#00e5ff]/20 to-transparent" />
            <span className="font-[family-name:var(--font-inconsolata)] text-[9px] uppercase tracking-[0.2em] text-[#00e5ff]/30">
              {article.aiComments.length} Channels Active
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {article.aiComments.map((ai, idx) => (
              <CornerBrackets
                key={ai.model}
                className="border border-[#00e5ff]/15 bg-[#00e5ff]/[0.03] p-4"
                color={
                  idx === 0 ? "#00e5ff" : idx === 1 ? "#ffc400" : "#00e5ff"
                }
              >
                {/* Channel header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{ai.avatar}</span>
                    <span className="font-[family-name:var(--font-exo2)] text-xs font-700 uppercase tracking-wider text-[#00e5ff]/80">
                      {ai.model}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 font-[family-name:var(--font-inconsolata)] text-[9px] uppercase tracking-wider text-[#004d40]">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[#00e5ff]/60"
                      style={{ animation: "hud-pulse 2s infinite" }}
                    />
                    ONLINE
                  </span>
                </div>

                {/* Comment body */}
                <div className="border-t border-[#00e5ff]/10 pt-3">
                  <p className="font-[family-name:var(--font-inconsolata)] text-[11px] leading-relaxed text-[#00e5ff]/55">
                    {ai.comment}
                  </p>
                </div>

                {/* Footer meta */}
                <div className="mt-3 flex items-center justify-between font-[family-name:var(--font-inconsolata)] text-[8px] uppercase tracking-[0.2em] text-[#00e5ff]/20">
                  <span>CH-{String(idx + 1).padStart(2, "0")}</span>
                  <span>
                    SIGNAL: <SignalBars strength={3 + (idx % 2)} />
                  </span>
                </div>
              </CornerBrackets>
            ))}
          </div>
        </section>

        <DiamondRule />

        {/* ================================================================
            FOOTER -- SYSTEM STATUS BAR
        ================================================================ */}
        <footer className="mt-6 border-t border-[#00e5ff]/15 pt-4 pb-6">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 font-[family-name:var(--font-inconsolata)] text-[9px] uppercase tracking-[0.25em] text-[#00e5ff]/25">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#00e5ff]/50"
                style={{ animation: "hud-pulse 2s infinite" }}
              />
              All Systems Nominal
              <span className="text-[#00e5ff]/15">|</span>
              Data Stream Complete
              <span className="text-[#00e5ff]/15">|</span>
              Uplink Active
            </div>
            <div className="font-[family-name:var(--font-inconsolata)] text-[9px] uppercase tracking-[0.2em] text-[#00e5ff]/15">
              HUD v7.0 // NEO-TOKYO // {hudTime}
            </div>
          </div>

          {/* Bottom edge decoration */}
          <div className="mt-4 flex items-center justify-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="inline-block h-0.5 w-3 bg-[#00e5ff]/10"
                style={{
                  opacity: Math.abs(i - 10) < 5 ? 0.2 : 0.05,
                }}
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
