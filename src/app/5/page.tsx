"use client";

import { articles, allTags } from "@/lib/mockData";
import Link from "next/link";
import { Orbitron, Rajdhani, Fira_Code } from "next/font/google";

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const firaCode = Fira_Code({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira",
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const NEON_COLORS = ["#ff00ff", "#00ffff", "#ccff00", "#ff6600", "#00ff88"];

function neonColor(i: number) {
  return NEON_COLORS[i % NEON_COLORS.length];
}

function sourceBreakdown(sources: { type: string }[]) {
  const counts: Record<string, number> = {};
  sources.forEach((s) => {
    counts[s.type] = (counts[s.type] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([t, c]) => `${c} ${t.toUpperCase()}`)
    .join(" / ");
}

function sourceIcon(type: string) {
  switch (type) {
    case "youtube":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.4-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.8 15.5V8.5l6.2 3.5-6.2 3.5Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "web":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "podcast":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a7 7 0 0 0-7 7v4a7 7 0 0 0 14 0V8a7 7 0 0 0-7-7zm5 11a5 5 0 0 1-10 0V8a5 5 0 0 1 10 0v4zm-5 8a9 9 0 0 1-9-9h2a7 7 0 0 0 14 0h2a9 9 0 0 1-9 9zm-1 2v2h2v-2h-2z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Fake model specs for AI commentary dashboard                       */
/* ------------------------------------------------------------------ */
const MODEL_SPECS: Record<string, { params: string; ctx: string; speed: string; color: string }> = {
  "GPT-4o": { params: "1.8T", ctx: "128K", speed: "92 tok/s", color: "#00ff88" },
  Gemini: { params: "1.5T", ctx: "1M", speed: "105 tok/s", color: "#4488ff" },
  Llama: { params: "405B", ctx: "128K", speed: "140 tok/s", color: "#cc66ff" },
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function NeoTokyoBlog() {
  const featured = articles[0];
  const rest = articles.slice(1);

  const tickerText = articles.map((a) => a.title).join("   ///   ");

  return (
    <div
      className={`${orbitron.variable} ${rajdhani.variable} ${firaCode.variable} min-h-screen relative`}
      style={{
        fontFamily: "var(--font-rajdhani), sans-serif",
        background: "#08080c",
        color: "#e0e0e0",
      }}
    >
      {/* ---- CSS-only animations & scanline overlay ---- */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-neon {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes scanline {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        @keyframes glow-border {
          0%, 100% { box-shadow: 0 0 5px var(--glow-color), 0 0 10px var(--glow-color); }
          50% { box-shadow: 0 0 10px var(--glow-color), 0 0 25px var(--glow-color), 0 0 40px var(--glow-color); }
        }
        @keyframes data-pulse {
          0% { width: 0%; }
          100% { width: var(--bar-width); }
        }
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 0.9; }
          98% { opacity: 0.3; }
          99% { opacity: 0.8; }
        }
        .ticker-track {
          display: flex;
          animation: ticker 60s linear infinite;
          width: max-content;
        }
        .scanline-overlay {
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,255,0.015) 2px,
            rgba(0,255,255,0.015) 4px
          );
        }
        .scanline-overlay::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 200%;
          background: linear-gradient(transparent 40%, rgba(0,255,255,0.03) 50%, transparent 60%);
          animation: scanline 8s linear infinite;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .neon-card {
          transition: all 0.3s ease;
          position: relative;
        }
        .neon-card:hover {
          transform: translateY(-2px);
          z-index: 10;
        }
        .neon-glow-text {
          text-shadow: 0 0 7px currentColor, 0 0 15px currentColor, 0 0 30px currentColor;
        }
        .neon-glow-text-sm {
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
        }
        .neon-border {
          border: 1px solid var(--glow-color);
          box-shadow: 0 0 5px var(--glow-color), inset 0 0 5px rgba(0,0,0,0.5);
        }
        .neon-border:hover {
          animation: glow-border 2s ease-in-out infinite;
        }
        .progress-bar {
          animation: data-pulse 1.5s ease-out forwards;
        }
        .flicker {
          animation: flicker 4s infinite;
        }
        .tag-pill {
          transition: all 0.2s ease;
        }
        .tag-pill:hover {
          transform: scale(1.1);
          filter: brightness(1.3);
        }
      `}</style>

      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Grid background */}
      <div className="grid-bg fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* ================================================================ */}
      {/*  ROW 1 — Scrolling Ticker                                        */}
      {/* ================================================================ */}
      <div
        className="relative overflow-hidden whitespace-nowrap"
        style={{
          zIndex: 10,
          background: "linear-gradient(90deg, #08080c, #0d0015, #08080c)",
          borderBottom: "1px solid #ff00ff44",
          boxShadow: "0 2px 20px rgba(255,0,255,0.15)",
        }}
      >
        <div className="py-1.5">
          <div className="ticker-track">
            {[0, 1].map((dup) => (
              <span
                key={dup}
                className="inline-block px-4 text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-fira), monospace",
                  color: "#00ffff",
                  textShadow: "0 0 6px #00ffff",
                }}
              >
                {tickerText}{"   ///   "}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  ROW 2 — Main Nav Bar                                            */}
      {/* ================================================================ */}
      <header
        className="relative"
        style={{
          zIndex: 10,
          background: "linear-gradient(180deg, #0a0012, #08080c)",
          borderBottom: "1px solid #00ffff33",
        }}
      >
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Back link */}
          <Link
            href="/"
            className="text-xs uppercase tracking-widest flex items-center gap-1.5 shrink-0"
            style={{
              fontFamily: "var(--font-fira), monospace",
              color: "#ff00ff",
              textShadow: "0 0 8px #ff00ff",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>&larr;</span> BACK
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs opacity-40 hidden md:inline"
              style={{ fontFamily: "var(--font-fira), monospace", color: "#00ffff" }}
            >
              ニュース //
            </span>
            <h1
              className="text-xl md:text-2xl lg:text-3xl font-black tracking-wider uppercase"
              style={{
                fontFamily: "var(--font-orbitron), sans-serif",
                color: "#ff00ff",
                textShadow: "0 0 10px #ff00ff, 0 0 30px #ff00ff, 0 0 60px #ff00ff55",
              }}
            >
              BEROU NAM PRACI
            </h1>
            <span
              className="text-xs opacity-40 hidden md:inline"
              style={{ fontFamily: "var(--font-fira), monospace", color: "#00ffff" }}
            >
              // テクノロジー
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-4 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-fira), monospace" }}>
            {["FEED", "MODELS", "SOURCES", "ABOUT"].map((item) => (
              <span
                key={item}
                className="cursor-pointer hover:underline"
                style={{ color: "#00ffff", textShadow: "0 0 5px #00ffff55" }}
              >
                {item}
              </span>
            ))}
            <span className="px-2 py-0.5 border text-[10px]" style={{ borderColor: "#ccff00", color: "#ccff00" }}>
              CZ
            </span>
            <span className="px-2 py-0.5 text-[10px] opacity-40" style={{ color: "#ccff00" }}>
              EN
            </span>
            {/* Clock */}
            <span className="flicker" style={{ color: "#ff00ff", textShadow: "0 0 5px #ff00ff" }}>
              23:47:12
            </span>
          </nav>
        </div>
      </header>

      {/* ================================================================ */}
      {/*  ROW 3 — Stats Bar                                               */}
      {/* ================================================================ */}
      <div
        className="relative overflow-hidden"
        style={{
          zIndex: 10,
          background: "#0a0a12",
          borderBottom: "1px solid #ccff0033",
        }}
      >
        <div
          className="max-w-[1800px] mx-auto px-4 py-1.5 flex items-center justify-between gap-6 flex-wrap text-[11px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-fira), monospace" }}
        >
          <div className="flex items-center gap-6">
            {[
              { label: "ARTICLES", value: String(articles.length), color: "#ff00ff" },
              { label: "SOURCES", value: String(articles.reduce((s, a) => s + a.sources.length, 0)), color: "#00ffff" },
              { label: "AI MODELS", value: "3", color: "#ccff00" },
              { label: "TAGS", value: String(allTags.length), color: "#ff6600" },
            ].map((stat) => (
              <span key={stat.label} className="flex items-center gap-1.5">
                <span style={{ color: stat.color, textShadow: `0 0 6px ${stat.color}` }}>{stat.value}</span>
                <span className="opacity-50">{stat.label}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88" }}
            />
            <span>LAST UPDATE: 2026-02-28 // SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  MAIN CONTENT — 3-Column Dense Layout                            */}
      {/* ================================================================ */}
      <main
        className="relative max-w-[1800px] mx-auto px-3 py-6"
        style={{ zIndex: 1 }}
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: "200px 1fr 320px" }}>

          {/* -------------------------------------------------------------- */}
          {/*  LEFT SIDEBAR                                                   */}
          {/* -------------------------------------------------------------- */}
          <aside className="space-y-4">
            {/* Tag list */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#ff00ff", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-3 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#ff00ff",
                  textShadow: "0 0 6px #ff00ff",
                  borderBottom: "1px solid #ff00ff33",
                }}
              >
                // TAGS データ
              </h3>
              <div className="flex flex-col gap-1.5">
                {allTags.map((tag, i) => {
                  const c = neonColor(i);
                  return (
                    <span
                      key={tag}
                      className="tag-pill px-2 py-1 text-[10px] uppercase tracking-wider cursor-pointer"
                      style={{
                        fontFamily: "var(--font-fira), monospace",
                        border: `1px solid ${c}55`,
                        color: c,
                        textShadow: `0 0 4px ${c}66`,
                        background: `${c}08`,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* AI Model List */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#00ffff", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-3 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#00ffff",
                  textShadow: "0 0 6px #00ffff",
                  borderBottom: "1px solid #00ffff33",
                }}
              >
                // AI MODELS モデル
              </h3>
              {Object.entries(MODEL_SPECS).map(([name, spec]) => (
                <div
                  key={name}
                  className="mb-3 last:mb-0 p-2"
                  style={{ border: `1px solid ${spec.color}33`, background: `${spec.color}05` }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: spec.color, boxShadow: `0 0 6px ${spec.color}` }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-orbitron), sans-serif",
                        color: spec.color,
                        textShadow: `0 0 4px ${spec.color}`,
                      }}
                    >
                      {name}
                    </span>
                  </div>
                  <div className="text-[10px] space-y-0.5 opacity-70" style={{ fontFamily: "var(--font-fira), monospace" }}>
                    <div>PARAMS: {spec.params}</div>
                    <div>CTX: {spec.ctx}</div>
                    <div>SPEED: {spec.speed}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#ccff00", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-3 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#ccff00",
                  textShadow: "0 0 6px #ccff00",
                  borderBottom: "1px solid #ccff0033",
                }}
              >
                // STATS 統計
              </h3>
              {[
                { label: "AVG READ TIME", value: `${(articles.reduce((s, a) => s + a.readTime, 0) / articles.length).toFixed(1)} MIN`, pct: 65, color: "#ff00ff" },
                { label: "TOTAL SOURCES", value: String(articles.reduce((s, a) => s + a.sources.length, 0)), pct: 80, color: "#00ffff" },
                { label: "AI CONFIDENCE", value: "94.7%", pct: 95, color: "#ccff00" },
                { label: "COVERAGE SCORE", value: "87/100", pct: 87, color: "#ff6600" },
                { label: "THREAT LEVEL", value: "ELEVATED", pct: 72, color: "#ff0055" },
              ].map((stat) => (
                <div key={stat.label} className="mb-2.5 last:mb-0">
                  <div className="flex justify-between text-[9px] uppercase tracking-wider mb-0.5 opacity-60" style={{ fontFamily: "var(--font-fira), monospace" }}>
                    <span>{stat.label}</span>
                    <span style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                  <div className="h-1 w-full" style={{ background: `${stat.color}15` }}>
                    <div
                      className="h-full progress-bar"
                      style={{
                        "--bar-width": `${stat.pct}%`,
                        background: stat.color,
                        boxShadow: `0 0 6px ${stat.color}`,
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Japanese Deco */}
            <div className="text-center py-4 opacity-20" style={{ fontFamily: "var(--font-fira), monospace" }}>
              <div className="text-lg" style={{ color: "#ff00ff" }}>未来</div>
              <div className="text-[9px] tracking-[0.5em] mt-1" style={{ color: "#00ffff" }}>FUTURE</div>
            </div>
          </aside>

          {/* -------------------------------------------------------------- */}
          {/*  CENTER — Article Feed                                          */}
          {/* -------------------------------------------------------------- */}
          <div className="space-y-4">

            {/* ---- FEATURED ARTICLE ---- */}
            <article
              className="neon-card neon-border p-5 relative overflow-hidden"
              style={{
                "--glow-color": "#ff00ff",
                background: "linear-gradient(135deg, #0d0015 0%, #08080c 50%, #000d14 100%)",
              } as React.CSSProperties}
            >
              {/* Japanese decoration */}
              <div
                className="absolute top-3 right-4 text-5xl font-bold opacity-[0.04] pointer-events-none select-none"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                最新ニュース
              </div>

              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div
                    className="text-[10px] uppercase tracking-[0.3em] mb-1"
                    style={{
                      fontFamily: "var(--font-fira), monospace",
                      color: "#ff00ff",
                      textShadow: "0 0 6px #ff00ff",
                    }}
                  >
                    最新ニュース // FEATURED ARTICLE // #{`001`}
                  </div>
                  <h2
                    className="text-xl md:text-2xl font-bold leading-tight"
                    style={{
                      fontFamily: "var(--font-orbitron), sans-serif",
                      color: "#ffffff",
                      textShadow: "0 0 10px rgba(255,0,255,0.3)",
                    }}
                  >
                    {featured.title}
                  </h2>
                </div>
                <div
                  className="shrink-0 px-3 py-1 text-xs font-bold"
                  style={{
                    fontFamily: "var(--font-fira), monospace",
                    border: "1px solid #ccff00",
                    color: "#ccff00",
                    textShadow: "0 0 6px #ccff00",
                  }}
                >
                  {featured.readTime} MIN
                </div>
              </div>

              {/* Meta row */}
              <div
                className="flex items-center gap-4 mb-3 text-[10px] uppercase tracking-wider opacity-70"
                style={{ fontFamily: "var(--font-fira), monospace" }}
              >
                <span style={{ color: "#00ffff" }}>{featured.date}</span>
                <span>|</span>
                <span>{featured.sources.length} SOURCES</span>
                <span>|</span>
                <span>{sourceBreakdown(featured.sources)}</span>
                <span>|</span>
                <span>{featured.aiComments.length} AI REVIEWS</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {featured.tags.map((tag, i) => {
                  const c = neonColor(i);
                  return (
                    <span
                      key={tag}
                      className="tag-pill px-2 py-0.5 text-[10px] uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-fira), monospace",
                        border: `1px solid ${c}`,
                        color: c,
                        textShadow: `0 0 4px ${c}66`,
                        background: `${c}11`,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>

              {/* Excerpt */}
              <p className="text-sm leading-relaxed opacity-80 mb-4" style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}>
                {featured.excerpt}
              </p>

              {/* Sources */}
              <div className="flex flex-wrap gap-2">
                {featured.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 text-[10px] transition-all hover:brightness-125"
                    style={{
                      fontFamily: "var(--font-fira), monospace",
                      border: "1px solid #ffffff15",
                      color: "#00ffff",
                      background: "#00ffff08",
                    }}
                  >
                    {sourceIcon(src.type)}
                    <span className="truncate max-w-[200px]">{src.title}</span>
                  </a>
                ))}
              </div>

              {/* Bottom neon line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent)" }}
              />
            </article>

            {/* ---- ARTICLE LIST ---- */}
            <div className="space-y-3">
              {rest.map((article, idx) => {
                const accent = neonColor(idx + 1);
                return (
                  <article
                    key={article.slug}
                    className="neon-card neon-border p-4 relative"
                    style={{
                      "--glow-color": accent,
                      background: "#0a0a14",
                    } as React.CSSProperties}
                  >
                    {/* Decorative number */}
                    <div
                      className="absolute top-2 right-3 text-4xl font-black opacity-[0.06] pointer-events-none select-none"
                      style={{ fontFamily: "var(--font-orbitron)" }}
                    >
                      {String(idx + 2).padStart(3, "0")}
                    </div>

                    {/* Header */}
                    <div className="flex items-start gap-3 mb-2">
                      <span
                        className="shrink-0 text-[10px] font-bold px-1.5 py-0.5"
                        style={{
                          fontFamily: "var(--font-fira), monospace",
                          color: "#08080c",
                          background: accent,
                          boxShadow: `0 0 8px ${accent}66`,
                        }}
                      >
                        #{String(idx + 2).padStart(3, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-sm md:text-base font-bold leading-snug mb-1"
                          style={{
                            fontFamily: "var(--font-orbitron), sans-serif",
                            color: "#ffffff",
                          }}
                        >
                          {article.title}
                        </h3>
                        <div
                          className="flex items-center gap-3 text-[10px] uppercase tracking-wider opacity-60 mb-2"
                          style={{ fontFamily: "var(--font-fira), monospace" }}
                        >
                          <span style={{ color: accent }}>{article.date}</span>
                          <span>{article.readTime} MIN</span>
                          <span>{article.sources.length} SRC</span>
                          <span>{sourceBreakdown(article.sources)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs leading-relaxed opacity-60 mb-2.5 ml-10" style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}>
                      {article.excerpt}
                    </p>

                    {/* Tags + Sources row */}
                    <div className="flex items-center gap-2 flex-wrap ml-10">
                      {article.tags.map((tag, ti) => {
                        const tc = neonColor(ti + idx);
                        return (
                          <span
                            key={tag}
                            className="tag-pill px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                            style={{
                              fontFamily: "var(--font-fira), monospace",
                              border: `1px solid ${tc}66`,
                              color: tc,
                              background: `${tc}08`,
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                      <span className="flex-1" />
                      <div className="flex items-center gap-1.5">
                        {article.sources.map((src, si) => (
                          <span
                            key={si}
                            className="opacity-40 hover:opacity-100 transition-opacity"
                            style={{ color: accent }}
                            title={src.title}
                          >
                            {sourceIcon(src.type)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/*  RIGHT SIDEBAR                                                  */}
          {/* -------------------------------------------------------------- */}
          <aside className="space-y-4">

            {/* AI Commentary Dashboard */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#00ffff", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-1 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#00ffff",
                  textShadow: "0 0 6px #00ffff",
                  borderBottom: "1px solid #00ffff33",
                }}
              >
                // AI COMMENTARY コメント
              </h3>
              <div
                className="text-[9px] uppercase tracking-wider opacity-40 mb-3"
                style={{ fontFamily: "var(--font-fira), monospace" }}
              >
                RE: {featured.title.slice(0, 40)}...
              </div>

              {featured.aiComments.map((comment) => {
                const spec = MODEL_SPECS[comment.model] || { color: "#ffffff", params: "?", ctx: "?", speed: "?" };
                return (
                  <div
                    key={comment.model}
                    className="neon-card mb-3 last:mb-0 p-3"
                    style={{
                      border: `1px solid ${spec.color}44`,
                      background: `${spec.color}05`,
                    }}
                  >
                    {/* Model header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{comment.avatar}</span>
                        <span
                          className="text-[11px] font-bold uppercase tracking-wider"
                          style={{
                            fontFamily: "var(--font-orbitron), sans-serif",
                            color: spec.color,
                            textShadow: `0 0 4px ${spec.color}`,
                          }}
                        >
                          {comment.model}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1 text-[9px]"
                        style={{ fontFamily: "var(--font-fira), monospace", color: spec.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: spec.color, boxShadow: `0 0 4px ${spec.color}` }}
                        />
                        ONLINE
                      </span>
                    </div>

                    {/* Fake specs bar */}
                    <div
                      className="flex gap-2 mb-2 text-[8px] uppercase tracking-wider opacity-50"
                      style={{ fontFamily: "var(--font-fira), monospace" }}
                    >
                      <span>{spec.params}</span>
                      <span>|</span>
                      <span>{spec.ctx} CTX</span>
                      <span>|</span>
                      <span>{spec.speed}</span>
                    </div>

                    {/* Comment text */}
                    <p
                      className="text-xs leading-relaxed opacity-75"
                      style={{
                        fontFamily: "var(--font-rajdhani), sans-serif",
                        borderLeft: `2px solid ${spec.color}44`,
                        paddingLeft: "8px",
                      }}
                    >
                      {comment.comment}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Source Breakdown */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#ff6600", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-3 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#ff6600",
                  textShadow: "0 0 6px #ff6600",
                  borderBottom: "1px solid #ff660033",
                }}
              >
                // SOURCE ANALYSIS ソース
              </h3>
              {(["web", "youtube", "twitter", "podcast"] as const).map((type) => {
                const count = articles.reduce(
                  (sum, a) => sum + a.sources.filter((s) => s.type === type).length,
                  0
                );
                const total = articles.reduce((s, a) => s + a.sources.length, 0);
                const pct = Math.round((count / total) * 100);
                const colors: Record<string, string> = {
                  web: "#00ffff",
                  youtube: "#ff0044",
                  twitter: "#ffffff",
                  podcast: "#ccff00",
                };
                const c = colors[type] || "#ffffff";
                return (
                  <div key={type} className="mb-2.5 last:mb-0">
                    <div
                      className="flex justify-between text-[9px] uppercase tracking-wider mb-0.5"
                      style={{ fontFamily: "var(--font-fira), monospace" }}
                    >
                      <span className="flex items-center gap-1.5" style={{ color: c }}>
                        {sourceIcon(type)} {type}
                      </span>
                      <span className="opacity-60">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1 w-full" style={{ background: `${c}15` }}>
                      <div
                        className="h-full progress-bar"
                        style={{
                          "--bar-width": `${pct}%`,
                          background: c,
                          boxShadow: `0 0 4px ${c}`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trending / Hot Topics */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#ccff00", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-3 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#ccff00",
                  textShadow: "0 0 6px #ccff00",
                  borderBottom: "1px solid #ccff0033",
                }}
              >
                // TRENDING トレンド
              </h3>
              {[
                { topic: "Claude 4 Opus", heat: 98, color: "#ff00ff" },
                { topic: "Sora 2 Video", heat: 91, color: "#00ffff" },
                { topic: "EU AI Act", heat: 85, color: "#ccff00" },
                { topic: "AI Agents", heat: 79, color: "#ff6600" },
                { topic: "GPU Wars", heat: 74, color: "#00ff88" },
              ].map((item, i) => (
                <div key={item.topic} className="flex items-center gap-2 mb-2 last:mb-0">
                  <span
                    className="text-[10px] w-5 text-right font-bold"
                    style={{ fontFamily: "var(--font-fira), monospace", color: item.color }}
                  >
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[11px] font-semibold truncate"
                      style={{ fontFamily: "var(--font-rajdhani), sans-serif", color: item.color }}
                    >
                      {item.topic}
                    </div>
                    <div className="h-0.5 w-full mt-0.5" style={{ background: `${item.color}15` }}>
                      <div
                        className="h-full progress-bar"
                        style={{
                          "--bar-width": `${item.heat}%`,
                          background: item.color,
                          boxShadow: `0 0 4px ${item.color}`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  <span
                    className="text-[9px] opacity-50 shrink-0"
                    style={{ fontFamily: "var(--font-fira), monospace" }}
                  >
                    {item.heat}%
                  </span>
                </div>
              ))}
            </div>

            {/* System Terminal */}
            <div
              className="neon-border p-3"
              style={{ "--glow-color": "#00ff88", background: "#0a0a14" } as React.CSSProperties}
            >
              <h3
                className="text-[10px] uppercase tracking-[0.2em] mb-2 pb-1"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#00ff88",
                  textShadow: "0 0 6px #00ff88",
                  borderBottom: "1px solid #00ff8833",
                }}
              >
                // SYSTEM ターミナル
              </h3>
              <div
                className="text-[9px] leading-relaxed space-y-0.5 opacity-60"
                style={{ fontFamily: "var(--font-fira), monospace", color: "#00ff88" }}
              >
                <div>&gt; initializing feed_aggregator.v2</div>
                <div>&gt; loading neural_parser... OK</div>
                <div>&gt; connecting to 12 source nodes...</div>
                <div>&gt; AI models synced [3/3]</div>
                <div>&gt; cache: 847 entries (23.4 MB)</div>
                <div>&gt; uptime: 99.97%</div>
                <div className="flicker">&gt; status: <span style={{ color: "#ccff00" }}>OPERATIONAL</span></div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ================================================================ */}
      {/*  FOOTER                                                          */}
      {/* ================================================================ */}
      <footer
        className="relative mt-8"
        style={{
          zIndex: 10,
          background: "#06060a",
          borderTop: "1px solid #ff00ff33",
        }}
      >
        {/* Neon separator line */}
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #ff00ff, #00ffff, #ccff00, #ff00ff, transparent)",
            boxShadow: "0 0 10px #ff00ff55, 0 0 20px #00ffff33",
          }}
        />

        <div className="max-w-[1800px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand */}
            <div>
              <div
                className="text-sm font-bold tracking-widest uppercase mb-2"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#ff00ff",
                  textShadow: "0 0 6px #ff00ff",
                }}
              >
                BEROU NAM PRACI
              </div>
              <div
                className="text-xs opacity-40"
                style={{ fontFamily: "var(--font-fira), monospace" }}
              >
                ベロウ・ナム・プラーツィ // POWERED BY AI // v2.0.0
              </div>
              <div
                className="text-[10px] mt-2 opacity-30"
                style={{ fontFamily: "var(--font-fira), monospace" }}
              >
                &copy; 2026 // ALL RIGHTS RESERVED // NODE: CZ-PRAGUE-01
              </div>
            </div>

            {/* System Stats */}
            <div>
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-2"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#00ffff",
                  textShadow: "0 0 4px #00ffff",
                }}
              >
                SYSTEM METRICS
              </div>
              <div
                className="text-[10px] space-y-0.5 opacity-50"
                style={{ fontFamily: "var(--font-fira), monospace" }}
              >
                <div>CPU: 23.4% | MEM: 4.2 GB / 16 GB | NET: 847 Mbps</div>
                <div>ARTICLES PROCESSED: 1,247 | MODELS QUERIED: 8,412</div>
                <div>LATENCY: 12ms AVG | ERRORS: 0.03% | CACHE HIT: 94.2%</div>
              </div>
            </div>

            {/* Network Nodes */}
            <div>
              <div
                className="text-[10px] uppercase tracking-[0.2em] mb-2"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  color: "#ccff00",
                  textShadow: "0 0 4px #ccff00",
                }}
              >
                NETWORK NODES
              </div>
              <div
                className="text-[10px] space-y-0.5 opacity-50"
                style={{ fontFamily: "var(--font-fira), monospace" }}
              >
                {[
                  { node: "CZ-PRAGUE-01", status: "ACTIVE", color: "#00ff88" },
                  { node: "DE-FRANKFURT-02", status: "ACTIVE", color: "#00ff88" },
                  { node: "US-VIRGINIA-03", status: "STANDBY", color: "#ccff00" },
                  { node: "JP-TOKYO-04", status: "ACTIVE", color: "#00ff88" },
                ].map((n) => (
                  <div key={n.node} className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ background: n.color, boxShadow: `0 0 4px ${n.color}` }}
                    />
                    <span>{n.node}</span>
                    <span style={{ color: n.color }}>[{n.status}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-6 pt-3 flex items-center justify-between text-[9px] uppercase tracking-widest opacity-30"
            style={{
              fontFamily: "var(--font-fira), monospace",
              borderTop: "1px solid #ffffff0a",
            }}
          >
            <span>テクノロジー // TECHNOLOGY // 未来 // FUTURE</span>
            <span>BUILD: 2026.02.28.NEON // PROTOCOL: BNP-2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
