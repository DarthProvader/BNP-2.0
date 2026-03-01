"use client";

import { articles, allTags } from "@/lib/mockData";
import Link from "next/link";
import { Outfit, Nunito } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
});

/* ------------------------------------------------------------------ */
/*  Helper: source type icon                                          */
/* ------------------------------------------------------------------ */
function sourceIcon(type: string) {
  switch (type) {
    case "youtube":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.4-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.8 15.5V8.5l6.2 3.5-6.2 3.5Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L12 13.4l-5.3 5.3-1.4-1.4L11.6 12 5.3 5.7l1.4-1.4L12 10.6l5.3-5.3 1.4 1.4h.6Z" />
        </svg>
      );
    case "podcast":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1a7 7 0 0 0-7 7v4a7 7 0 0 0 14 0V8a7 7 0 0 0-7-7Zm5 11a5 5 0 1 1-10 0V8a5 5 0 1 1 10 0v4Zm-6 8.9V17h2v3.9A9 9 0 0 0 21 12h-2a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.9Z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2v1.93Zm6.9-2.54A1.99 1.99 0 0 0 16 16h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a8 8 0 0 1 2.9 12.8Z" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Helper: tag color dot                                             */
/* ------------------------------------------------------------------ */
function tagDotColor(tag: string) {
  const map: Record<string, string> = {
    anthropic: "bg-violet-400",
    llm: "bg-indigo-400",
    release: "bg-teal-400",
    openai: "bg-emerald-400",
    video: "bg-rose-400",
    "generative-ai": "bg-pink-400",
    regulace: "bg-amber-400",
    eu: "bg-blue-400",
    policy: "bg-cyan-400",
    github: "bg-gray-300",
    coding: "bg-lime-400",
    agents: "bg-fuchsia-400",
    nvidia: "bg-green-400",
    hardware: "bg-orange-400",
    gpu: "bg-yellow-400",
  };
  return map[tag] || "bg-white/50";
}

/* ------------------------------------------------------------------ */
/*  Helper: model avatar color                                        */
/* ------------------------------------------------------------------ */
function modelColor(model: string) {
  switch (model) {
    case "GPT-4o":
      return "from-emerald-400 to-green-500";
    case "Gemini":
      return "from-blue-400 to-cyan-500";
    case "Llama":
      return "from-purple-400 to-fuchsia-500";
    default:
      return "from-gray-400 to-gray-500";
  }
}

/* ================================================================== */
/*  PAGE COMPONENT                                                     */
/* ================================================================== */
export default function GlassmorphismAuroraPage() {
  const featured = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div
      className={`${outfit.variable} ${nunito.variable} relative min-h-screen overflow-x-hidden`}
      style={{
        fontFamily: "var(--font-nunito), sans-serif",
        background: "#050510",
        color: "#fff",
      }}
    >
      {/* ------------------------------------------------------------ */}
      {/*  ANIMATED AURORA BACKGROUND                                   */}
      {/* ------------------------------------------------------------ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
        <div className="aurora-blob aurora-blob-4" />
        <div className="aurora-blob aurora-blob-5" />
      </div>

      {/* Subtle grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ------------------------------------------------------------ */}
      {/*  CONTENT                                                      */}
      {/* ------------------------------------------------------------ */}
      <div className="relative z-10">
        {/* ---------------------------------------------------------- */}
        {/*  NAV                                                        */}
        {/* ---------------------------------------------------------- */}
        <nav className="sticky top-0 z-50 px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
            {/* Back link */}
            <Link
              href="/"
              className="mr-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <span className="text-base leading-none">&larr;</span>
              <span>Zpět</span>
            </Link>

            {/* Logo */}
            <span
              className="hidden text-lg font-bold sm:block"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Berou nám práci
            </span>

            {/* Nav items */}
            <div className="flex items-center gap-2">
              {["Články", "Resources", "O projektu"].map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-white/0 bg-white/0 px-4 py-1.5 text-sm text-white/60 transition-all hover:border-white/10 hover:bg-white/10 hover:text-white"
                  style={{ fontFamily: "var(--font-nunito), sans-serif" }}
                >
                  {item}
                </button>
              ))}
              <div className="ml-2 flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  CZ
                </button>
                <button className="rounded-full px-3 py-1 text-xs text-white/50 transition-colors hover:text-white">
                  EN
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* ---------------------------------------------------------- */}
        {/*  HERO SECTION                                               */}
        {/* ---------------------------------------------------------- */}
        <section className="relative px-4 pb-12 pt-20 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #f43f5e 50%, #14b8a6 75%, #6366f1 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradient-shift 8s ease infinite",
              }}
            >
              Berou nám práci
            </h1>

            <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-xl">
              <p
                className="text-lg text-white/60 sm:text-xl"
                style={{ fontFamily: "var(--font-nunito), sans-serif" }}
              >
                AI zpravodajství bez humbuku. Sledujeme, jak umělá inteligence mění svět
                &mdash;&nbsp;objektivně, srozumitelně, v&nbsp;češtině.
              </p>
            </div>

            <p className="mt-6 text-sm text-white/30">
              verze 4 / 5 &mdash; glassmorphism aurora
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  FEATURED ARTICLE                                           */}
        {/* ---------------------------------------------------------- */}
        <section className="px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08]">
              {/* Gradient accent line */}
              <div
                className="h-1"
                style={{
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6, #14b8a6, #f43f5e)",
                }}
              />

              <div className="p-8 sm:p-12">
                {/* Meta */}
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                    Hlavní článek
                  </span>
                  <span className="text-sm text-white/40">{featured.date}</span>
                  <span className="flex items-center gap-1.5 text-sm text-white/40">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {featured.readTime} min čtení
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-white/40">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    {featured.sources.length} zdrojů
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="mb-4 text-3xl font-bold leading-snug sm:text-4xl"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    background: "linear-gradient(135deg, #e0e7ff, #ffffff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {featured.title}
                </h2>

                {/* Excerpt */}
                <p className="mb-6 max-w-3xl text-lg leading-relaxed text-white/50">
                  {featured.excerpt}
                </p>

                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                    >
                      <span className={`inline-block h-2 w-2 rounded-full ${tagDotColor(tag)}`} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Sources */}
                <div className="flex flex-wrap gap-3">
                  {featured.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white/80"
                    >
                      {sourceIcon(src.type)}
                      <span className="max-w-[180px] truncate">{src.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Hover glow */}
              <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99,102,241,0.06), transparent 40%)",
                }}
              />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  ARTICLE GRID                                               */}
        {/* ---------------------------------------------------------- */}
        <section className="px-4 pb-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h3
              className="mb-8 text-2xl font-bold text-white/80"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Další články
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  {/* Gradient top accent */}
                  <div
                    className="h-0.5 opacity-60"
                    style={{
                      background:
                        "linear-gradient(90deg, #6366f1, #8b5cf6, #14b8a6)",
                    }}
                  />

                  <div className="flex flex-1 flex-col p-6">
                    {/* Date + source type */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-white/40">{article.date}</span>
                      <div className="flex gap-1.5">
                        {[...new Set(article.sources.map((s) => s.type))].map((t) => (
                          <span
                            key={t}
                            className="text-white/30"
                            title={t}
                          >
                            {sourceIcon(t)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <h4
                      className="mb-3 text-lg font-bold leading-snug text-white/90"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      {article.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-white/40">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/50"
                        >
                          <span
                            className={`inline-block h-1.5 w-1.5 rounded-full ${tagDotColor(tag)}`}
                          />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read time */}
                    <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {article.readTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {article.sources.length} zdrojů
                      </span>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      boxShadow: "inset 0 0 60px rgba(99,102,241,0.05), 0 0 40px rgba(139,92,246,0.05)",
                    }}
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  TAG CLOUD                                                  */}
        {/* ---------------------------------------------------------- */}
        <section className="px-4 pb-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h3
              className="mb-6 text-xl font-bold text-white/70"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Témata
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${tagDotColor(tag)}`} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  AI COMMENTARY PANEL                                        */}
        {/* ---------------------------------------------------------- */}
        <section className="px-4 pb-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
              {/* Header */}
              <div className="border-b border-white/5 px-8 py-6 sm:px-12">
                <h3
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    background: "linear-gradient(135deg, #8b5cf6, #14b8a6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  AI komentáře k hlavnímu článku
                </h3>
                <p className="mt-1 text-sm text-white/40">
                  Jak hodnotí hlavní článek přední AI modely
                </p>
              </div>

              {/* Comments */}
              <div className="grid gap-4 p-8 sm:grid-cols-3 sm:p-12">
                {featured.aiComments.map((comment, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    {/* Model avatar */}
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br ${modelColor(comment.model)} text-lg`}
                      >
                        {comment.avatar}
                      </div>
                      <div>
                        <span
                          className="text-sm font-bold text-white/90"
                          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                        >
                          {comment.model}
                        </span>
                        <span className="block text-xs text-white/30">AI komentář</span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-sm leading-relaxed text-white/50">
                      &ldquo;{comment.comment}&rdquo;
                    </p>

                    {/* Gradient border on hover */}
                    <div
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(99,102,241,0.1), transparent, rgba(20,184,166,0.1))",
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "exclude",
                        WebkitMaskComposite: "xor",
                        padding: "1px",
                        borderRadius: "1rem",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  FOOTER                                                     */}
        {/* ---------------------------------------------------------- */}
        <footer className="border-t border-white/5 px-4 py-10 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #14b8a6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Berou nám práci
            </span>
            <p className="text-sm text-white/30">
              Poháněno umělou inteligencí &middot; verze 4 / 5
            </p>
            <div className="mt-2 flex gap-6 text-xs text-white/20">
              <span>Články</span>
              <span>Resources</span>
              <span>O projektu</span>
            </div>

            {/* Subtle aurora glow */}
            <div
              className="mt-6 h-px w-64"
              style={{
                background: "linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #14b8a6, transparent)",
                opacity: 0.4,
              }}
            />
          </div>
        </footer>
      </div>

      {/* ------------------------------------------------------------ */}
      {/*  STYLES: Aurora blobs + animations                            */}
      {/* ------------------------------------------------------------ */}
      <style jsx global>{`
        /* ---- Aurora blob base ---- */
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
          will-change: transform;
        }

        .aurora-blob-1 {
          width: 700px;
          height: 700px;
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          animation: aurora-drift-1 20s ease-in-out infinite;
        }

        .aurora-blob-2 {
          width: 600px;
          height: 600px;
          top: 5%;
          right: -5%;
          background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
          animation: aurora-drift-2 25s ease-in-out infinite;
        }

        .aurora-blob-3 {
          width: 500px;
          height: 500px;
          top: 40%;
          left: 20%;
          background: radial-gradient(circle, #14b8a6 0%, transparent 70%);
          animation: aurora-drift-3 22s ease-in-out infinite;
        }

        .aurora-blob-4 {
          width: 550px;
          height: 550px;
          top: 60%;
          right: 10%;
          background: radial-gradient(circle, #f43f5e 0%, transparent 70%);
          animation: aurora-drift-4 28s ease-in-out infinite;
        }

        .aurora-blob-5 {
          width: 400px;
          height: 400px;
          top: 80%;
          left: -5%;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          animation: aurora-drift-5 18s ease-in-out infinite;
        }

        /* ---- Keyframes ---- */
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, 60px) scale(1.1); }
          66% { transform: translate(-40px, 80px) scale(0.95); }
        }

        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 50px) scale(1.05); }
          66% { transform: translate(50px, -60px) scale(1.1); }
        }

        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -70px) scale(1.08); }
          66% { transform: translate(-80px, 40px) scale(0.92); }
        }

        @keyframes aurora-drift-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, -50px) scale(1.12); }
          66% { transform: translate(70px, 60px) scale(0.98); }
        }

        @keyframes aurora-drift-5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(90px, -40px) scale(1.05); }
          66% { transform: translate(-50px, -70px) scale(1.1); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ---- Fade-in animation ---- */
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        section {
          animation: fade-in-up 0.8s ease-out both;
        }

        section:nth-child(2) { animation-delay: 0.1s; }
        section:nth-child(3) { animation-delay: 0.2s; }
        section:nth-child(4) { animation-delay: 0.3s; }
        section:nth-child(5) { animation-delay: 0.4s; }
        section:nth-child(6) { animation-delay: 0.5s; }

        /* ---- Scrollbar ---- */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
}
