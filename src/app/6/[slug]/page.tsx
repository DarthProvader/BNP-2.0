"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Righteous, Chakra_Petch, Fira_Code } from "next/font/google";
import { articles } from "@/lib/mockData";

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
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
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
/*  Source icon helper                                                  */
/* ------------------------------------------------------------------ */
function sourceIcon(type: string) {
  switch (type) {
    case "youtube":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31.9 31.9 0 000 12a31.9 31.9 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31.9 31.9 0 0024 12a31.9 31.9 0 00-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "podcast":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a9 9 0 00-9 9v7a3 3 0 003 3h3v-8H5v-2a7 7 0 1114 0v2h-4v8h3a3 3 0 003-3v-7a9 9 0 00-9-9z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Rain effect component                                              */
/* ------------------------------------------------------------------ */
function RainEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.07]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-linear-to-b from-transparent via-blue-300 to-transparent"
          style={{
            left: `${i * 2.5 + Math.random() * 1.5}%`,
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
/*  Speed lines background                                             */
/* ------------------------------------------------------------------ */
function SpeedLines({
  color = "#00f0ff",
  opacity = 0.06,
}: {
  color?: string;
  opacity?: number;
}) {
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
/*  Main article detail page                                           */
/* ------------------------------------------------------------------ */
export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const article = articles.find((a) => a.slug === slug);

  const [lang, setLang] = useState<"cs" | "en">("cs");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!article) {
    return (
      <div
        className={`${righteous.variable} ${chakra.variable} ${firaCode.variable} min-h-screen flex items-center justify-center`}
        style={{
          fontFamily: "var(--font-chakra), sans-serif",
          backgroundColor: "#05050a",
          color: "#e0e0e0",
        }}
      >
        <div className="text-center">
          <h1
            className="text-4xl mb-4"
            style={{
              fontFamily: "var(--font-righteous)",
              color: "#ff2d7b",
              textShadow:
                "0 0 7px #ff2d7b, 0 0 10px #ff2d7b, 0 0 21px #ff2d7b",
            }}
          >
            SIGNAL LOST
          </h1>
          <p
            className="text-sm tracking-wider mb-6"
            style={{ fontFamily: "var(--font-fira)", color: "#e0e0e050" }}
          >
            // ARTICLE NOT FOUND IN SECTOR 06
          </p>
          <Link
            href="/6"
            className="text-sm tracking-wider transition-colors hover:text-[#00f0ff]"
            style={{ fontFamily: "var(--font-fira)", color: "#00f0ff" }}
          >
            &larr; zpet na terminal
          </Link>
        </div>
      </div>
    );
  }

  const title = lang === "cs" ? article.title : article.titleEn;
  const content = lang === "cs" ? article.content : article.contentEn;
  const paragraphs = content.split("\n\n").filter(Boolean);

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
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
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

      {/* --- Main content --- */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/*  HEADER                                                       */}
        {/* ============================================================ */}
        <header className="pt-6 pb-6 border-b border-cyan-900/30">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/6"
              className="flex items-center gap-2 text-sm tracking-wide transition-colors hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
              style={{ fontFamily: "var(--font-chakra)", color: "#00f0ff" }}
            >
              <span className="text-lg">&larr;</span>
              <span>zpet</span>
            </Link>

            <button
              onClick={() => setLang(lang === "cs" ? "en" : "cs")}
              className="relative px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border cursor-pointer"
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
                  background:
                    "linear-gradient(135deg, rgba(0,240,255,0.2), transparent)",
                }}
              />
            </button>
          </div>

          {/* Neon title glow */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight animate-[neonFlicker_4s_infinite]"
            style={{
              fontFamily: "var(--font-righteous)",
              color: "#00f0ff",
              textShadow:
                "0 0 7px #00f0ff, 0 0 10px #00f0ff, 0 0 21px #00f0ff, 0 0 42px #00f0ff, 0 0 82px #00f0ff80, 0 0 92px #00f0ff40",
            }}
          >
            {title}
          </h1>
        </header>

        {/* ============================================================ */}
        {/*  META BAR                                                      */}
        {/* ============================================================ */}
        <div className="flex items-center gap-4 flex-wrap py-5 border-b border-[#ffffff08]">
          <span
            className="text-xs tracking-wider uppercase"
            style={{
              fontFamily: "var(--font-fira)",
              color: "#ffd000",
              textShadow: "0 0 6px rgba(255,208,0,0.4)",
            }}
          >
            {article.date}
          </span>
          <span
            className="text-xs tracking-wider uppercase"
            style={{
              fontFamily: "var(--font-fira)",
              color: "#ffd000",
              textShadow: "0 0 6px rgba(255,208,0,0.4)",
            }}
          >
            {article.readTime} MIN READ
          </span>
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {article.tags.map((tag) => (
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
        </div>

        {/* ============================================================ */}
        {/*  ARTICLE CONTENT AREA                                          */}
        {/* ============================================================ */}
        <section
          className="relative mt-8 mb-10"
          style={{
            animationName: mounted ? "slideUp" : "none",
            animationDuration: "0.6s",
            animationFillMode: "both",
            animationTimingFunction: "ease-out",
          }}
        >
          {/* Manga frame with speed lines */}
          <div
            className="relative overflow-hidden border border-[#ffffff06]"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,240,255,0.03) 0%, rgba(5,5,10,0.95) 50%, rgba(255,45,123,0.02) 100%)",
            }}
          >
            {/* Speed lines behind content */}
            <SpeedLines color="#00f0ff" opacity={0.03} />

            {/* Manga frame corners */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#00f0ff]" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#00f0ff]" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#00f0ff]" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#00f0ff]" />

            {/* Article body */}
            <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="space-y-5">
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base leading-relaxed"
                    style={{
                      fontFamily: "var(--font-chakra)",
                      color: "#e0e0e0b0",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Warning stripe at bottom of content */}
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
        {/*  SOURCES                                                       */}
        {/* ============================================================ */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-xs tracking-[0.3em] uppercase animate-[pulseGlow_2s_infinite]"
              style={{
                fontFamily: "var(--font-fira)",
                color: "#ff2d7b",
                textShadow:
                  "0 0 7px #ff2d7b, 0 0 10px #ff2d7b, 0 0 21px #ff2d7b",
              }}
            >
              SOURCES
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-[#ff2d7b]/30 to-transparent" />
          </div>

          <div className="space-y-3">
            {article.sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-3 border transition-all duration-300 hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/5"
                style={{
                  borderColor: "#ffffff08",
                  background:
                    "linear-gradient(90deg, rgba(0,240,255,0.02), transparent)",
                }}
              >
                <span
                  className="transition-colors duration-300 group-hover:text-[#00f0ff] group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                  style={{ color: "#e0e0e040" }}
                >
                  {sourceIcon(src.type)}
                </span>
                <span
                  className="text-[10px] font-bold tracking-[0.15em] uppercase shrink-0 transition-colors duration-300 group-hover:text-[#00f0ff]"
                  style={{ fontFamily: "var(--font-fira)", color: "#e0e0e050" }}
                >
                  [{src.type}]
                </span>
                <span
                  className="text-xs sm:text-sm transition-colors duration-300 group-hover:text-[#00f0ff]"
                  style={{ fontFamily: "var(--font-chakra)", color: "#e0e0e080" }}
                >
                  {src.title}
                </span>
                <svg
                  className="w-3 h-3 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  AI COMMENTS - TRANSMISSION LOG                                */}
        {/* ============================================================ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs tracking-[0.3em] uppercase animate-[neonFlicker_3s_infinite]"
              style={{
                fontFamily: "var(--font-fira)",
                color: "#ffd000",
                textShadow:
                  "0 0 7px #ffd000, 0 0 10px #ffd000, 0 0 21px #ffd000",
              }}
            >
              TRANSMISSION LOG
            </span>
            <div className="flex-1 h-px bg-linear-to-r from-[#ffd000]/30 to-transparent" />
          </div>

          <p
            className="text-[10px] tracking-wider mb-6"
            style={{ fontFamily: "var(--font-fira)", color: "#e0e0e030" }}
          >
            INTERCEPTED AI COMMUNICATIONS //{" "}
            {lang === "cs"
              ? "Zachycene AI prenosy"
              : "Intercepted AI transmissions"}{" "}
            -- {article.date}
          </p>

          {/* Warning stripe top */}
          <div
            className="h-1 mb-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #00f0ff 0px, #00f0ff 8px, #05050a 8px, #05050a 16px)",
              opacity: 0.25,
            }}
          />

          <div className="space-y-5">
            {article.aiComments.map((comment, i) => {
              const neonClr = MODEL_NEON[comment.model] || "#00f0ff";
              return (
                <div
                  key={i}
                  className="relative overflow-hidden border-l-2 pl-5 sm:pl-6 py-4 transition-all duration-300"
                  style={{
                    borderLeftColor: neonClr,
                    background: `linear-gradient(90deg, ${neonClr}06, transparent 40%)`,
                  }}
                >
                  {/* Model ID header */}
                  <div className="flex items-center gap-2 mb-3">
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
                      style={{
                        fontFamily: "var(--font-fira)",
                        color: "#e0e0e025",
                      }}
                    >
                      // SIGNAL LOCKED
                    </span>
                  </div>

                  {/* Comment body - manga speech style with clip-path */}
                  <div
                    className="relative text-xs sm:text-sm leading-relaxed px-4 py-3 border"
                    style={{
                      fontFamily: "var(--font-chakra)",
                      color: "#e0e0e0a0",
                      borderColor: `${neonClr}15`,
                      background: "rgba(5,5,10,0.5)",
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
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
            className="h-1 mt-5"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #00f0ff 0px, #00f0ff 8px, #05050a 8px, #05050a 16px)",
              opacity: 0.25,
            }}
          />
        </section>

        {/* ============================================================ */}
        {/*  FOOTER                                                        */}
        {/* ============================================================ */}
        <footer className="border-t border-[#00f0ff]/20 py-8">
          {/* Neon line */}
          <div
            className="h-px mb-6"
            style={{
              background:
                "linear-gradient(to right, transparent, #00f0ff, transparent)",
              boxShadow: "0 0 10px #00f0ff50, 0 -2px 15px #00f0ff20",
            }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span
                className="text-sm font-bold tracking-wider"
                style={{
                  fontFamily: "var(--font-righteous)",
                  color: "#00f0ff",
                  textShadow: "0 0 8px rgba(0,240,255,0.5)",
                }}
              >
                BEROU NAM PRACI
              </span>
              <div
                className="text-[10px] tracking-[0.3em] mt-1"
                style={{
                  fontFamily: "var(--font-fira)",
                  color: "#e0e0e030",
                }}
              >
                NEO-TOKYO SECTOR 06
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-[10px] tracking-wider"
                style={{
                  fontFamily: "var(--font-fira)",
                  color: "#e0e0e025",
                }}
              >
                AI NEWS TERMINAL
              </div>
              <div
                className="text-[9px] tracking-wider mt-1"
                style={{
                  fontFamily: "var(--font-chakra)",
                  color: "#e0e0e018",
                }}
              >
                {lang === "cs"
                  ? "Data z verejnych zdroju"
                  : "Data from public sources"}{" "}
                * {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
