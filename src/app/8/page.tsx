"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Audiowide, Quicksand } from "next/font/google";
import { articles, allTags } from "@/lib/mockData";

const audiowide = Audiowide({ weight: "400", subsets: ["latin"], display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700"] });

function VHSTimestamp({ date }: { date: string }) {
  const [time, setTime] = useState("00:00");
  useEffect(() => {
    const now = new Date();
    setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
  }, []);
  const formatted = date.replace(/-/g, ".");
  return (
    <span className="font-mono text-xs tracking-widest text-[#ff9a8b] opacity-80">
      REC <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse align-middle" /> {formatted} {time}
    </span>
  );
}

function ChromeText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-linear-to-r from-[#e8e8e8] via-[#c0c0c0] to-[#a0a0a0] drop-shadow-[0_0_20px_rgba(192,192,192,0.3)] ${className}`}
    >
      {children}
    </span>
  );
}

export default function VaporwaveTokyo() {
  const [lang, setLang] = useState<"cz" | "en">("cz");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [vhsOffset, setVhsOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVhsOffset(Math.random() * 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const featured = articles[0];
  const rest = articles.slice(1);
  const filtered = selectedTag ? rest.filter((a) => a.tags.includes(selectedTag)) : rest;

  return (
    <div className={`${quicksand.className} relative min-h-screen bg-[#1a0a2e] text-white overflow-hidden`}>
      {/* ── Global Styles ── */}
      <style>{`
        @keyframes vhsTrack {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.4; }
          15% { opacity: 0; }
          50% { transform: translateY(${vhsOffset}vh); opacity: 0.3; }
          55% { opacity: 0; }
          80% { transform: translateY(30vh); opacity: 0.2; }
          85% { opacity: 0; }
        }
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 50px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes softGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255,110,199,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,110,199,0.6)); }
        }
        @keyframes palmSway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .vhs-line {
          animation: vhsTrack 8s ease-in-out infinite;
        }
        .vhs-line-2 {
          animation: vhsTrack 6s ease-in-out 2s infinite;
        }
        .vhs-line-3 {
          animation: vhsTrack 10s ease-in-out 4s infinite;
        }
        .chrome-hover:hover {
          text-shadow: -2px 0 #ff6ec7, 2px 0 #40e0d0;
        }
        .card-dream:hover {
          box-shadow: 0 20px 60px rgba(255,110,199,0.2), 0 0 40px rgba(196,113,245,0.15);
          transform: translateY(-6px);
        }
        .pill-glow:hover {
          box-shadow: 0 0 20px rgba(64,224,208,0.4), 0 0 40px rgba(255,110,199,0.2);
        }
      `}</style>

      {/* ── Scanline Overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(255,110,199,0.1) 0px, transparent 1px, transparent 3px, rgba(255,110,199,0.1) 4px)",
          animation: "scanlines 0.5s linear infinite",
        }}
      />

      {/* ── VHS Tracking Lines ── */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="vhs-line absolute left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[rgba(255,110,199,0.5)] to-transparent" style={{ top: "20%" }} />
        <div className="vhs-line-2 absolute left-0 right-0 h-[3px] bg-linear-to-r from-transparent via-[rgba(64,224,208,0.4)] to-transparent" style={{ top: "60%" }} />
        <div className="vhs-line-3 absolute left-0 right-0 h-[1px] bg-linear-to-r from-transparent via-[rgba(255,154,139,0.4)] to-transparent" style={{ top: "80%" }} />
      </div>

      {/* ── Perspective Grid Floor ── */}
      <div className="fixed inset-0 z-0" style={{ perspective: "500px" }}>
        <div
          className="absolute left-0 right-0 bottom-0 h-[60vh]"
          style={{
            transform: "rotateX(60deg)",
            transformOrigin: "bottom center",
            background: `
              linear-gradient(90deg, rgba(255,110,199,0.15) 1px, transparent 1px),
              linear-gradient(0deg, rgba(196,113,245,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 40px",
            animation: "gridScroll 3s linear infinite",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}
        />
      </div>

      {/* ── Sunset Gradient Atmosphere ── */}
      <div className="fixed top-0 left-0 right-0 h-[50vh] z-0 bg-linear-to-b from-[#ff6ec7]/10 via-[#ff9a8b]/5 to-transparent" />
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(255,110,199,0.08),transparent_70%)] z-0" />
      <div className="fixed top-[10vh] left-[10vw] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(196,113,245,0.06),transparent_70%)] z-0" />

      {/* ── Decorative Palm Silhouettes ── */}
      <div className="fixed top-[5vh] right-[5vw] text-6xl opacity-10 z-0" style={{ animation: "palmSway 6s ease-in-out infinite" }}>
        🌴
      </div>
      <div className="fixed top-[15vh] left-[3vw] text-5xl opacity-[0.07] z-0" style={{ animation: "palmSway 8s ease-in-out 1s infinite" }}>
        🌴
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10">

        {/* ══════════════ HEADER ══════════════ */}
        <header className="relative overflow-hidden">
          {/* Sunset band */}
          <div className="absolute inset-0 bg-linear-to-r from-[#ff6ec7]/20 via-[#ff9a8b]/15 to-[#c471f5]/20" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#1a0a2e]" />

          <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-12">
              <Link
                href="/"
                className="text-sm text-[#ff9a8b]/70 hover:text-[#ff6ec7] transition-colors duration-300 flex items-center gap-2"
              >
                <span className="text-lg">←</span> Zpět
              </Link>

              {/* CZ/EN toggle */}
              <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-full p-1 border border-[#ff6ec7]/20">
                <button
                  onClick={() => setLang("cz")}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    lang === "cz"
                      ? "bg-linear-to-r from-[#ff6ec7]/30 to-[#c471f5]/30 text-white shadow-[0_0_15px_rgba(255,110,199,0.3)]"
                      : "text-[#c0c0c0]/60 hover:text-white"
                  }`}
                >
                  CZ
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    lang === "en"
                      ? "bg-linear-to-r from-[#ff6ec7]/30 to-[#c471f5]/30 text-white shadow-[0_0_15px_rgba(255,110,199,0.3)]"
                      : "text-[#c0c0c0]/60 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Main title */}
            <div className="text-center">
              <p className="text-[#ff9a8b]/60 text-sm tracking-[0.3em] uppercase mb-4">
                ネオ・トーキョー &bull; Neo Tokyo &bull; V A P O R W A V E
              </p>
              <h1 className={`${audiowide.className} text-5xl md:text-7xl lg:text-8xl font-bold mb-4`}>
                <ChromeText>BEROU NÁM PRÁCI</ChromeText>
              </h1>
              <p className="text-2xl md:text-3xl text-[#ff6ec7]/50 tracking-[0.2em] mb-6">
                未来のニュース
              </p>
              <p className="text-[#c0c0c0]/40 text-sm tracking-widest">
                {lang === "cz" ? "Zprávy z budoucnosti" : "News from the future"} &bull; テクノロジー
              </p>
            </div>

            {/* Nav pills */}
            <nav className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                { label: lang === "cz" ? "Nejnovější" : "Latest", id: "latest" },
                { label: lang === "cz" ? "Technologie" : "Technology", id: "tech" },
                { label: "AI Models", id: "models" },
                { label: lang === "cz" ? "Regulace" : "Policy", id: "policy" },
              ].map((item) => (
                <button
                  key={item.id}
                  className="pill-glow px-6 py-2 rounded-full text-sm font-medium bg-white/5 backdrop-blur-sm border border-[#c471f5]/20 text-[#c0c0c0]/80 hover:text-white hover:border-[#ff6ec7]/40 transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Decorative columns */}
          <div className="absolute bottom-0 left-8 w-3 h-24 bg-linear-to-b from-[#c0c0c0]/10 to-transparent rounded-t-full hidden lg:block" />
          <div className="absolute bottom-0 right-8 w-3 h-24 bg-linear-to-b from-[#c0c0c0]/10 to-transparent rounded-t-full hidden lg:block" />
          <div className="absolute bottom-4 left-12 text-xl opacity-10 hidden lg:block">🏛️</div>
          <div className="absolute bottom-4 right-12 text-xl opacity-10 hidden lg:block">🏛️</div>
        </header>

        {/* ══════════════ FEATURED ARTICLE ══════════════ */}
        <section className="max-w-5xl mx-auto px-6 -mt-4 mb-20">
          <div
            className="card-dream relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(255,110,199,0.08), rgba(26,10,46,0.95) 30%)",
              boxShadow: "0 15px 50px rgba(255,110,199,0.12), 0 0 30px rgba(196,113,245,0.08)",
            }}
          >
            {/* Sunset gradient top border */}
            <div className="h-1 bg-linear-to-r from-[#ff6ec7] via-[#ff9a8b] to-[#c471f5]" />

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-linear-to-r from-[#ff6ec7]/20 to-[#c471f5]/20 text-[#ff6ec7] border border-[#ff6ec7]/20">
                  {lang === "cz" ? "Hlavní zpráva" : "Featured"}
                </span>
                <VHSTimestamp date={featured.date} />
              </div>

              <h2 className={`${audiowide.className} text-2xl md:text-4xl font-bold mb-6 leading-tight chrome-hover transition-all duration-300`}>
                <ChromeText>{lang === "cz" ? featured.title : featured.titleEn}</ChromeText>
              </h2>

              <p className="text-[#c0c0c0]/60 text-lg leading-relaxed mb-8 max-w-3xl">
                {lang === "cz" ? featured.excerpt : featured.excerptEn}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-linear-to-r from-[#ff9a8b]/10 to-[#c471f5]/10 text-[#ff9a8b]/80 border border-[#ff9a8b]/15"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="ml-auto text-[#40e0d0]/50 text-sm">
                  {featured.readTime} min {lang === "cz" ? "čtení" : "read"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ ARTICLE GRID ══════════════ */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#ff6ec7]/20 to-transparent" />
            <h3 className={`${audiowide.className} text-lg tracking-widest`}>
              <ChromeText>{lang === "cz" ? "VŠECHNY ZPRÁVY" : "ALL STORIES"}</ChromeText>
            </h3>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#ff6ec7]/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((article, i) => (
              <article
                key={article.slug}
                className="card-dream group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
                style={{
                  background: "linear-gradient(160deg, rgba(196,113,245,0.06), rgba(26,10,46,0.9) 40%)",
                  boxShadow: `0 ${12 + i * 3}px ${35 + i * 5}px rgba(255,110,199,${0.06 + i * 0.02})`,
                  animation: `float ${5 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                {/* Accent bar */}
                <div className="h-0.5 bg-linear-to-r from-[#ff6ec7]/60 via-[#ff9a8b]/40 to-[#c471f5]/60 opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <VHSTimestamp date={article.date} />
                    <span className="text-[#40e0d0]/40 text-xs">
                      {article.readTime}m
                    </span>
                  </div>

                  <h3 className={`${audiowide.className} text-lg md:text-xl font-bold mb-4 leading-snug chrome-hover transition-all duration-300`}>
                    <ChromeText>{lang === "cz" ? article.title : article.titleEn}</ChromeText>
                  </h3>

                  <p className="text-[#c0c0c0]/50 text-sm leading-relaxed mb-5 line-clamp-3">
                    {lang === "cz" ? article.excerpt : article.excerptEn}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-[10px] font-medium bg-white/5 text-[#c471f5]/60 border border-[#c471f5]/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ══════════════ TAGS ══════════════ */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          {/* Sunset divider */}
          <div className="h-px bg-linear-to-r from-transparent via-[#ff6ec7]/30 to-transparent mb-12" />

          <h3 className={`${audiowide.className} text-center text-lg tracking-widest mb-8`}>
            <ChromeText>{lang === "cz" ? "TÉMATA" : "TOPICS"}</ChromeText>
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedTag(null)}
              className={`pill-glow px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                selectedTag === null
                  ? "bg-linear-to-r from-[#ff6ec7]/25 to-[#40e0d0]/25 border-[#ff6ec7]/30 text-white shadow-[0_0_20px_rgba(255,110,199,0.2)]"
                  : "bg-white/5 border-[#c471f5]/15 text-[#c0c0c0]/50 hover:text-white hover:border-[#ff6ec7]/30"
              }`}
            >
              {lang === "cz" ? "Vše" : "All"}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`pill-glow px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  selectedTag === tag
                    ? "bg-linear-to-r from-[#ff6ec7]/25 to-[#40e0d0]/25 border-[#ff6ec7]/30 text-white shadow-[0_0_20px_rgba(255,110,199,0.2)]"
                    : "bg-white/5 border-[#c471f5]/15 text-[#c0c0c0]/50 hover:text-white hover:border-[#ff6ec7]/30"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════ AI TRANSMISSIONS ══════════════ */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <p className="text-[#ff9a8b]/40 text-xs tracking-[0.4em] uppercase mb-3">
              人工知能 &bull; Artificial Intelligence
            </p>
            <h3 className={`${audiowide.className} text-2xl md:text-3xl tracking-wider`}>
              <ChromeText>TRANSMISSIONS</ChromeText>
            </h3>
            <p className="text-[#c0c0c0]/30 text-sm mt-2">
              {lang === "cz" ? "Co si o tom myslí AI modely" : "What the AI models think"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.aiComments.map((ai, i) => {
              const gradients = [
                "from-[#ff6ec7]/20 to-[#ff9a8b]/20",
                "from-[#40e0d0]/20 to-[#c471f5]/20",
                "from-[#c471f5]/20 to-[#ff6ec7]/20",
              ];
              const borderColors = [
                "border-[#ff6ec7]/25",
                "border-[#40e0d0]/25",
                "border-[#c471f5]/25",
              ];
              const glowColors = [
                "rgba(255,110,199,0.1)",
                "rgba(64,224,208,0.1)",
                "rgba(196,113,245,0.1)",
              ];

              return (
                <div
                  key={ai.model}
                  className={`relative rounded-2xl overflow-hidden border ${borderColors[i]} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]`}
                  style={{
                    background: `linear-gradient(180deg, rgba(26,10,46,0.6), rgba(26,10,46,0.95))`,
                    boxShadow: `0 10px 40px ${glowColors[i]}`,
                  }}
                >
                  {/* Pastel gradient top */}
                  <div className={`h-1 bg-linear-to-r ${gradients[i]}`} />

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-white/5">
                        {ai.avatar}
                      </div>
                      <div>
                        <p className={`${audiowide.className} text-sm`}>
                          <ChromeText>{ai.model}</ChromeText>
                        </p>
                        <p className="text-[10px] text-[#ff9a8b]/40 tracking-widest">AI MODEL</p>
                      </div>
                    </div>

                    <p className="text-[#c0c0c0]/60 text-sm leading-relaxed">
                      &ldquo;{ai.comment}&rdquo;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="relative overflow-hidden">
          {/* Sunset gradient band */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#ff6ec7]/5 to-[#1a0a2e]" />
          <div className="h-px bg-linear-to-r from-transparent via-[#ff6ec7]/20 to-transparent" />

          <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
            {/* Decorative grid fade */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                background: `
                  linear-gradient(90deg, rgba(255,110,199,0.3) 1px, transparent 1px),
                  linear-gradient(0deg, rgba(196,113,245,0.2) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                maskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
              }}
            />

            <div className="relative">
              <p className={`${audiowide.className} text-lg tracking-[0.3em] text-[#c0c0c0]/30 mb-4`}>
                TOKYO &bull; 2026 &bull; AI DREAMS
              </p>
              <p className="text-[#ff6ec7]/20 text-sm tracking-widest mb-6">
                夢 &bull; ドリーム &bull; D R E A M S
              </p>
              <p className={`${audiowide.className} text-2xl mb-2`}>
                <ChromeText>BEROU NÁM PRÁCI</ChromeText>
              </p>
              <p className="text-[#c0c0c0]/20 text-xs tracking-widest">
                {lang === "cz"
                  ? "Vytvořeno s láskou a umělou inteligencí"
                  : "Made with love and artificial intelligence"}
              </p>

              {/* VHS footer stamp */}
              <div className="mt-8 font-mono text-[10px] text-[#ff9a8b]/30 tracking-widest">
                PLAY ▶ &bull; SP &bull; HI-FI STEREO &bull; 🌴
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
