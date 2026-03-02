"use client";

import type { Article } from "@/lib/mockData";
import Link from "next/link";
import { Righteous, Chakra_Petch, Fira_Code } from "next/font/google";
import { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */
const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-righteous",
});

const chakra = Chakra_Petch({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra",
});

const firaCode = Fira_Code({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-fira",
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function sourceIcon(type: string) {
  switch (type) {
    case "youtube":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.9 31.9 0 000 12a31.9 31.9 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.9 31.9 0 0024 12a31.9 31.9 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "podcast":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a9 9 0 00-9 9v7a3 3 0 003 3h3v-8H5v-2a7 7 0 1114 0v2h-4v8h3a3 3 0 003-3v-7a9 9 0 00-9-9z" />
        </svg>
      );
    default:
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
  }
}

const TAG_COLORS: Record<string, string> = {
  anthropic: "#00f0ff",
  llm: "#ff2d7b",
  release: "#ffd000",
  openai: "#00f0ff",
  video: "#ff2d7b",
  "generative-ai": "#ffd000",
  regulace: "#00f0ff",
  eu: "#ff2d7b",
  policy: "#ffd000",
  github: "#00f0ff",
  coding: "#ff2d7b",
  agents: "#ffd000",
  nvidia: "#00f0ff",
  hardware: "#ff2d7b",
  gpu: "#ffd000",
};

function tagColor(tag: string) {
  return TAG_COLORS[tag] || "#00f0ff";
}

const MODEL_NEON: Record<string, string> = {
  "GPT-4o": "#00f0ff",
  Gemini: "#ff2d7b",
  Llama: "#ffd000",
};

/* ------------------------------------------------------------------ */
/*  Rain drop component                                                */
/* ------------------------------------------------------------------ */
function RainEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.07]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-linear-to-b from-transparent via-blue-300 to-transparent"
          style={{
            left: `${(i * 2.5) + Math.random() * 1.5}%`,
            height: `${60 + Math.random() * 100}px`,
            animationName: "rainFall",
            animationDuration: `${0.6 + Math.random() * 0.8}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Neon text component                                                */
/* ------------------------------------------------------------------ */
function NeonText({
  children,
  className = "",
  color = "#00f0ff",
  flicker = false,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  flicker?: boolean;
}) {
  return (
    <span
      className={`${className} ${flicker ? "animate-[neonFlicker_3s_infinite]" : ""}`}
      style={{
        color: color,
        textShadow: `0 0 7px ${color}, 0 0 10px ${color}, 0 0 21px ${color}, 0 0 42px ${color}, 0 0 82px ${color}`,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Reflection component                                               */
/* ------------------------------------------------------------------ */
function WetReflection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{
          transform: "scaleY(-1)",
          opacity: 0.12,
          filter: "blur(3px)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 70%)",
          maxHeight: "60px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Speed lines background                                             */
/* ------------------------------------------------------------------ */
function SpeedLines({ color = "#00f0ff", opacity = 0.06 }: { color?: string; opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: `repeating-linear-gradient(
          -35deg,
          transparent,
          transparent 20px,
          ${color} 20px,
          ${color} 21px
        )`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function AkiraNeonStreetsPage({
  articles,
  allTags,
}: {
  articles: Article[];
  allTags: string[];
}) {
  const [lang, setLang] = useState<"cs" | "en">("cs");
  const [mounted, setMounted] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const featured = articles[0];
  const rest = articles.slice(1);
  const filtered = activeTag
    ? rest.filter((a) => a.tags.includes(activeTag))
    : rest;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`${righteous.variable} ${chakra.variable} ${firaCode.variable} relative min-h-screen overflow-x-hidden`}
      style={{
        fontFamily: "var(--font-chakra), sans-serif",
        backgroundColor: "#05050a",
        color: "#e0e0e0",
      }}
    >
      {/* --- Keyframe animations --- */}
      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100vh + 100%)); opacity: 0; }
        }
        @keyframes neonFlicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
        }
        @keyframes motoTrail {
          0% { transform: translateX(-100%) scaleX(0.3); opacity: 0; }
          50% { opacity: 1; scaleX(1); }
          100% { transform: translateX(200%) scaleX(0.3); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* --- Rain --- */}
      {mounted && <RainEffect />}

      {/* --- Scanline overlay --- */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        }}
      />

      {/* --- Wet street gradient at bottom --- */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-40 z-30"
        style={{
          background:
            "linear-gradient(to top, rgba(0,240,255,0.05) 0%, rgba(255,45,123,0.02) 40%, transparent 100%)",
        }}
      />

      {/* --- Motorcycle light trail --- */}
      <div className="pointer-events-none fixed bottom-8 left-0 right-0 z-30 h-1 overflow-hidden">
        <div
          className="h-full w-1/3"
          style={{
            background: "linear-gradient(to right, transparent, #00f0ff, #00f0ff, transparent)",
            animationName: "motoTrail",
            animationDuration: "4s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/*  HEADER                                                       */}
        {/* ============================================================ */}
        <header className="pt-6 pb-8 border-b border-cyan-900/30">
          {/* Top bar: back + lang */}
          <div className="flex items-center justify-end mb-6">
            <button
              onClick={() => setLang(lang === "cs" ? "en" : "cs")}
              className="relative px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border"
              style={{
                fontFamily: "var(--font-fira)",
                borderColor: "#00f0ff",
                color: "#00f0ff",
                textShadow: "0 0 8px rgba(0,240,255,0.5)",
              }}
            >
              <span>{lang === "cs" ? "EN" : "CZ"}</span>
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: "linear-gradient(135deg, rgba(0,240,255,0.2), transparent)",
                }}
              />
            </button>
          </div>

          {/* Main title neon sign */}
          <WetReflection>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9] animate-[neonFlicker_4s_infinite]"
              style={{
                fontFamily: "var(--font-righteous)",
                color: "#00f0ff",
                textShadow:
                  "0 0 7px #00f0ff, 0 0 10px #00f0ff, 0 0 21px #00f0ff, 0 0 42px #00f0ff, 0 0 82px #00f0ff80, 0 0 92px #00f0ff40",
              }}
            >
              BEROU NÁM PRÁCI
            </h1>
          </WetReflection>

          {/* Subtitle */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-fira)",
                color: "#ffd000",
                textShadow: "0 0 8px rgba(255,208,0,0.4)",
              }}
            >
              AI NEWS TERMINAL
            </span>
          </div>

          {/* Street-sign navigation */}
          <nav className="mt-6 flex items-center gap-1 flex-wrap">
            {["ALL", ...allTags].map((item, i) => {
              const isAll = item === "ALL";
              const isActive = isAll ? activeTag === null : activeTag === item.toLowerCase();
              return (
                <span
                  key={item}
                  onClick={() => setActiveTag(isAll ? null : item.toLowerCase())}
                  className="px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase border transition-all duration-200 cursor-pointer hover:bg-[#00f0ff]/10"
                  style={{
                    fontFamily: "var(--font-fira)",
                    borderColor: isActive ? "#00f0ff" : "#ffffff10",
                    color: isActive ? "#00f0ff" : "#e0e0e080",
                    backgroundColor: isActive ? "rgba(0,240,255,0.08)" : "transparent",
                  }}
                >
                  {item}
                </span>
              );
            })}
            <span
              className="ml-auto text-[10px] tracking-wider"
              style={{ fontFamily: "var(--font-fira)", color: "#e0e0e030" }}
            >
              SEC.06
            </span>
          </nav>
        </header>

        {/* ============================================================ */}
        {/*  FEATURED ARTICLE                                              */}
        {/* ============================================================ */}
        <section className="mt-10 mb-12">
          <div
            className="relative overflow-hidden border"
            style={{
              borderColor: "#00f0ff40",
              background: "linear-gradient(135deg, rgba(0,240,255,0.04) 0%, rgba(5,5,10,0.9) 50%, rgba(255,45,123,0.03) 100%)",
            }}
          >
            {/* Speed lines background */}
            <SpeedLines color="#00f0ff" opacity={0.04} />

            {/* Manga frame corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00f0ff]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00f0ff]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00f0ff]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00f0ff]" />

            <div className="relative p-6 sm:p-8 md:p-10">
              {/* HUD overlay metadata */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase px-2 py-0.5 border animate-[pulseGlow_2s_infinite]"
                  style={{
                    fontFamily: "var(--font-fira)",
                    color: "#00f0ff",
                    borderColor: "#00f0ff",
                    textShadow: "0 0 8px rgba(0,240,255,0.6)",
                  }}
                >
                  FEATURED
                </span>
                <span
                  className="text-[10px] tracking-wider"
                  style={{ fontFamily: "var(--font-fira)", color: "#e0e0e050" }}
                >
                  {featured.date}
                </span>
                <span
                  className="text-[10px] tracking-wider"
                  style={{ fontFamily: "var(--font-fira)", color: "#ffd000" }}
                >
                  {featured.readTime} MIN READ
                </span>
              </div>

              {/* Category */}
              <div
                className="text-xs tracking-[0.5em] mb-3"
                style={{ fontFamily: "var(--font-chakra)", color: "#ff2d7b80" }}
              >
                ARTIFICIAL INTELLIGENCE
              </div>

              {/* Title with neon glow */}
              <WetReflection>
                <Link href={`/6/${featured.slug}`}>
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 transition-colors duration-200 hover:brightness-125"
                    style={{
                      fontFamily: "var(--font-righteous)",
                      color: "#00f0ff",
                      textShadow: "0 0 10px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.3)",
                    }}
                  >
                    {lang === "cs" ? featured.title : featured.titleEn}
                  </h2>
                </Link>
              </WetReflection>

              {/* Excerpt */}
              <p
                className="text-sm sm:text-base leading-relaxed max-w-3xl mb-6"
                style={{
                  fontFamily: "var(--font-chakra)",
                  color: "#e0e0e0b0",
                }}
              >
                {lang === "cs" ? featured.excerpt : featured.excerptEn}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-fira)",
                      color: tagColor(tag),
                      border: `1px solid ${tagColor(tag)}40`,
                      textShadow: `0 0 6px ${tagColor(tag)}60`,
                      background: `linear-gradient(135deg, ${tagColor(tag)}08, transparent)`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Sources */}
              <div className="flex items-center gap-3 flex-wrap">
                {featured.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] tracking-wider transition-colors duration-200 hover:text-[#00f0ff]"
                    style={{
                      fontFamily: "var(--font-fira)",
                      color: "#e0e0e050",
                    }}
                  >
                    {sourceIcon(src.type)}
                    <span className="uppercase">{src.type}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Warning stripe at bottom */}
            <div
              className="h-1.5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #00f0ff 0px, #00f0ff 10px, transparent 10px, transparent 20px, #00f0ff 20px)",
                opacity: 0.3,
              }}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/*  ARTICLE PANELS                                                */}
        {/* ============================================================ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <NeonText color="#00f0ff" className="text-xs tracking-[0.3em] uppercase" flicker={false}>
              <span style={{ fontFamily: "var(--font-fira)" }}>FEED</span>
            </NeonText>
            <div className="flex-1 h-px bg-linear-to-r from-[#00f0ff]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((article, i) => (
              <article
                key={article.slug}
                className="group relative overflow-hidden border transition-all duration-300 hover:border-[#00f0ff]/60"
                style={{
                  borderColor: "#ffffff08",
                  background: `linear-gradient(${135 + i * 20}deg, rgba(0,240,255,0.02) 0%, rgba(5,5,10,0.95) 60%, rgba(255,45,123,0.02) 100%)`,
                  animationName: mounted ? "slideUp" : "none",
                  animationDuration: "0.5s",
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "both",
                  animationTimingFunction: "ease-out",
                  transform: i % 2 === 1 ? "translateY(20px)" : "none",
                }}
              >
                {/* Speed lines on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SpeedLines color="#00f0ff" opacity={0.06} />
                </div>

                {/* Diagonal corner accent */}
                <div
                  className="absolute top-0 right-0 w-16 h-16"
                  style={{
                    background: "linear-gradient(225deg, rgba(0,240,255,0.15) 0%, transparent 60%)",
                  }}
                />

                {/* Content */}
                <div className="relative p-5 sm:p-6">
                  {/* Meta bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[9px] tracking-[0.2em] uppercase"
                      style={{ fontFamily: "var(--font-fira)", color: "#e0e0e040" }}
                    >
                      {article.date}
                    </span>
                    <span
                      className="text-[9px] tracking-wider"
                      style={{ fontFamily: "var(--font-fira)", color: "#ffd000a0" }}
                    >
                      {article.readTime}m
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg sm:text-xl font-bold leading-tight mb-3 transition-all duration-300 group-hover:text-[#00f0ff]"
                    style={{
                      fontFamily: "var(--font-righteous)",
                      color: "#e0e0e0e0",
                    }}
                  >
                    <span className="group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                      {lang === "cs" ? article.title : article.titleEn}
                    </span>
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="text-xs leading-relaxed mb-4 line-clamp-3"
                    style={{
                      fontFamily: "var(--font-chakra)",
                      color: "#e0e0e070",
                    }}
                  >
                    {lang === "cs" ? article.excerpt : article.excerptEn}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5"
                        style={{
                          fontFamily: "var(--font-fira)",
                          color: tagColor(tag),
                          backgroundColor: `${tagColor(tag)}0a`,
                          border: `1px solid ${tagColor(tag)}25`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Sources bar */}
                  <div className="flex items-center gap-2">
                    {article.sources.map((src, si) => (
                      <a
                        key={si}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-200 hover:text-[#00f0ff]"
                        style={{ color: "#e0e0e030" }}
                        title={src.title}
                      >
                        {sourceIcon(src.type)}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to right, transparent, #00f0ff, transparent)",
                    boxShadow: "0 0 8px #00f0ff",
                  }}
                />
              </article>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  TAGS — Graffiti style                                         */}
        {/* ============================================================ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <NeonText color="#ff2d7b" className="text-xs tracking-[0.3em] uppercase" flicker={false}>
              <span style={{ fontFamily: "var(--font-fira)" }}>TAGS</span>
            </NeonText>
            <div className="flex-1 h-px bg-linear-to-r from-[#ff2d7b]/30 to-transparent" />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, i) => {
              const color = tagColor(tag);
              const rotation = ((i % 5) - 2) * 2;
              return (
                <span
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className="relative text-xs font-bold tracking-wider uppercase px-3 py-1.5 cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{
                    fontFamily: "var(--font-righteous)",
                    color: color,
                    border: `1.5px solid ${activeTag === tag ? color : `${color}50`}`,
                    textShadow: `0 0 6px ${color}60`,
                    transform: `rotate(${rotation}deg)`,
                    background: `linear-gradient(135deg, ${color}${activeTag === tag ? "18" : "08"}, transparent 60%)`,
                  }}
                >
                  {/* Spray paint effect dot */}
                  <span
                    className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full"
                    style={{ backgroundColor: color, opacity: 0.4 }}
                  />
                  #{tag}
                </span>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  AI COMMENTS — Transmission Log                                */}
        {/* ============================================================ */}
        <section className="mb-12">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-2">
            <NeonText color="#ffd000" className="text-xs tracking-[0.3em] uppercase" flicker>
              <span style={{ fontFamily: "var(--font-fira)" }}>TRANSMISSION LOG</span>
            </NeonText>
            <div className="flex-1 h-px bg-linear-to-r from-[#ffd000]/30 to-transparent" />
          </div>

          <p
            className="text-[10px] tracking-wider mb-6"
            style={{ fontFamily: "var(--font-fira)", color: "#e0e0e030" }}
          >
            INTERCEPTED AI COMMUNICATIONS // {lang === "cs" ? "Zachycené AI přenosy" : "Intercepted AI transmissions"} — {featured.date}
          </p>

          {/* Warning stripe top */}
          <div
            className="h-1 mb-4"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #00f0ff 0px, #00f0ff 8px, #05050a 8px, #05050a 16px)",
              opacity: 0.25,
            }}
          />

          <div className="space-y-4">
            {featured.aiComments.map((comment, i) => {
              const neonClr = MODEL_NEON[comment.model] || "#00f0ff";
              return (
                <div
                  key={i}
                  className="relative overflow-hidden border-l-2 pl-4 sm:pl-5 py-3 transition-all duration-300"
                  style={{
                    borderLeftColor: neonClr,
                    background: `linear-gradient(90deg, ${neonClr}06, transparent 40%)`,
                  }}
                >
                  {/* Model ID header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{comment.avatar}</span>
                    <span
                      className="text-[11px] font-bold tracking-[0.2em] uppercase"
                      style={{
                        fontFamily: "var(--font-fira)",
                        color: neonClr,
                        textShadow: `0 0 8px ${neonClr}60`,
                      }}
                    >
                      {comment.model}
                    </span>
                    <span
                      className="text-[9px] tracking-wider"
                      style={{ fontFamily: "var(--font-fira)", color: "#e0e0e025" }}
                    >
                      // SIGNAL LOCKED
                    </span>
                  </div>

                  {/* Comment body — manga speech style */}
                  <div
                    className="relative text-xs sm:text-sm leading-relaxed px-3 py-2 border"
                    style={{
                      fontFamily: "var(--font-chakra)",
                      color: "#e0e0e0a0",
                      borderColor: `${neonClr}15`,
                      background: "rgba(5,5,10,0.5)",
                      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
                    }}
                  >
                    &ldquo;{comment.comment}&rdquo;
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning stripe bottom */}
          <div
            className="h-1 mt-4"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #00f0ff 0px, #00f0ff 8px, #05050a 8px, #05050a 16px)",
              opacity: 0.25,
            }}
          />
        </section>

        {/* ============================================================ */}
        {/*  ALL ARTICLES — AI COMMENTS                                    */}
        {/* ============================================================ */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <NeonText color="#00f0ff" className="text-xs tracking-[0.3em] uppercase" flicker={false}>
              <span style={{ fontFamily: "var(--font-fira)" }}>ALL TRANSMISSIONS</span>
            </NeonText>
            <div className="flex-1 h-px bg-linear-to-r from-[#00f0ff]/20 to-transparent" />
          </div>

          <div className="space-y-8">
            {filtered.map((article) => (
              <div key={article.slug} className="border-l border-[#ffffff08] pl-4">
                <h4
                  className="text-sm font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-righteous)",
                    color: "#e0e0e080",
                  }}
                >
                  RE: {lang === "cs" ? article.title : article.titleEn}
                </h4>
                <div className="space-y-3">
                  {article.aiComments.map((comment, ci) => {
                    const neonClr = MODEL_NEON[comment.model] || "#00f0ff";
                    return (
                      <div key={ci} className="flex items-start gap-3">
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          <span className="text-sm">{comment.avatar}</span>
                          <span
                            className="text-[9px] font-bold tracking-wider uppercase"
                            style={{
                              fontFamily: "var(--font-fira)",
                              color: neonClr,
                              textShadow: `0 0 6px ${neonClr}40`,
                            }}
                          >
                            {comment.model}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            fontFamily: "var(--font-chakra)",
                            color: "#e0e0e060",
                          }}
                        >
                          &ldquo;{comment.comment}&rdquo;
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  FOOTER                                                        */}
        {/* ============================================================ */}
        <footer className="border-t border-[#00f0ff]/20 py-8">
          {/* Neon line */}
          <div
            className="h-px mb-6"
            style={{
              background: "linear-gradient(to right, transparent, #00f0ff, transparent)",
              boxShadow: "0 0 10px #00f0ff50, 0 -2px 15px #00f0ff20",
            }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <WetReflection>
                <span
                  className="text-sm font-bold tracking-wider"
                  style={{
                    fontFamily: "var(--font-righteous)",
                    color: "#00f0ff",
                    textShadow: "0 0 8px rgba(0,240,255,0.5)",
                  }}
                >
                  BEROU NÁM PRÁCI
                </span>
              </WetReflection>
              <div
                className="text-[10px] tracking-[0.3em] mt-1"
                style={{ fontFamily: "var(--font-fira)", color: "#e0e0e030" }}
              >
                NEO-TOKYO SECTOR 06
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-[10px] tracking-wider"
                style={{ fontFamily: "var(--font-fira)", color: "#e0e0e025" }}
              >
                AI NEWS TERMINAL
              </div>
              <div
                className="text-[9px] tracking-wider mt-1"
                style={{ fontFamily: "var(--font-chakra)", color: "#e0e0e018" }}
              >
                {lang === "cs" ? "Data z veřejných zdrojů" : "Data from public sources"} • {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
