import { articles, allTags } from "@/lib/mockData";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata = {
  title: "BEROU NÁM PRÁCI — AI žere svět",
  description: "AI žere svět. My o tom píšeme.",
};

export default function Page() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen relative`}
    >
      <style>{`
        :root {
          --brutal-red: #ff2222;
          --brutal-black: #0a0a0a;
          --brutal-white: #f0f0f0;
        }

        .brutal-page {
          background-color: var(--brutal-black);
          color: var(--brutal-white);
          font-family: var(--font-jetbrains), monospace;
        }

        .brutal-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .brutal-page > * {
          position: relative;
          z-index: 1;
        }

        .font-headline {
          font-family: var(--font-instrument), Georgia, serif;
        }

        .font-mono {
          font-family: var(--font-jetbrains), monospace;
        }

        .glitch-text {
          text-shadow:
            2px 2px 0 #ff2222,
            -1px -1px 0 #00ffff;
        }

        .glitch-hover:hover {
          text-shadow:
            3px 3px 0 #ff2222,
            -2px -2px 0 #00ffff,
            5px 0px 0 #ff222244;
          transition: text-shadow 0.1s ease;
        }

        .noise-border {
          border: 2px solid var(--brutal-white);
          box-shadow:
            4px 4px 0 var(--brutal-red),
            -1px -1px 0 var(--brutal-white);
        }

        .cut-out {
          border: 2px solid var(--brutal-white);
          background: var(--brutal-black);
          box-shadow:
            6px 6px 0 var(--brutal-red);
        }

        .tag-sticker {
          border: 1px solid var(--brutal-white);
          padding: 2px 8px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-jetbrains), monospace;
          display: inline-block;
          background: var(--brutal-black);
        }

        .tag-sticker-red {
          border-color: var(--brutal-red);
          color: var(--brutal-red);
        }

        .scanline::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.01) 2px,
            rgba(255,255,255,0.01) 4px
          );
          pointer-events: none;
        }

        .harsh-underline {
          text-decoration: none;
          border-bottom: 3px solid var(--brutal-red);
          padding-bottom: 1px;
        }

        .harsh-underline:hover {
          background: var(--brutal-red);
          color: var(--brutal-black);
        }

        .rotate-1 { transform: rotate(0.7deg); }
        .rotate-2 { transform: rotate(-1.2deg); }
        .rotate-3 { transform: rotate(1.5deg); }
        .rotate-neg { transform: rotate(-0.8deg); }

        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .ai-annotation {
          border-left: 3px solid var(--brutal-red);
          padding-left: 12px;
          position: relative;
        }

        .ai-annotation::before {
          content: '//';
          position: absolute;
          left: -2px;
          top: -14px;
          font-size: 10px;
          color: var(--brutal-red);
          font-family: var(--font-jetbrains), monospace;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .cursor-blink::after {
          content: '█';
          animation: blink 1s infinite;
          color: var(--brutal-red);
          margin-left: 2px;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="brutal-page min-h-screen">
        {/* BACK LINK */}
        <div className="px-4 pt-4 sm:px-8">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-[#ff2222] hover:bg-[#ff2222] hover:text-[#0a0a0a] transition-colors px-2 py-1 border border-[#ff2222]"
          >
            &larr; Zp&#283;t na v&yacute;b&#283;r
          </Link>
        </div>

        {/* MARQUEE TICKER */}
        <div className="overflow-hidden border-b border-[#f0f0f0]/20 py-2 mt-4">
          <div className="flex whitespace-nowrap marquee-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0f0f0]/30 mx-8">
                AI NAHRAZUJE PROGRAMATORY /// AUTOMATIZACE SMAZALA 10K POZIC /// MODELY JSOU CHYTREJSI NEZ LIDE /// BUDOUCNOST JE TED /// AI NAHRAZUJE PROGRAMATORY /// AUTOMATIZACE SMAZALA 10K POZIC ///&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* HEADER */}
        <header className="px-4 sm:px-8 pt-12 pb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="relative">
              {/* Decorative red block */}
              <div className="absolute -left-2 sm:-left-4 top-0 w-2 sm:w-3 h-full bg-[#ff2222]" />

              <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-[120px] leading-[0.85] font-normal tracking-tight text-[#f0f0f0] glitch-text pl-4 sm:pl-6">
                BEROU
                <br />
                <span className="text-[#ff2222]">NÁM</span>
                <br />
                PRÁCI
              </h1>

              <p className="font-mono text-xs sm:text-sm mt-6 pl-4 sm:pl-6 text-[#f0f0f0]/70 max-w-md leading-relaxed">
                AI žere svět. My o tom píšeme.
              </p>
            </div>

            {/* NAV */}
            <nav className="flex flex-col gap-3 lg:items-end pl-4 sm:pl-0">
              <div className="flex gap-4 font-mono text-xs sm:text-sm uppercase tracking-widest">
                <a href="#clanky" className="harsh-underline text-[#f0f0f0]">
                  Články
                </a>
                <a href="#" className="harsh-underline text-[#f0f0f0]">
                  Resources
                </a>
                <a href="#" className="harsh-underline text-[#f0f0f0]">
                  O&nbsp;projektu
                </a>
              </div>
              <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest mt-2">
                <span className="px-2 py-1 border border-[#f0f0f0] bg-[#f0f0f0] text-[#0a0a0a] font-bold">
                  CZ
                </span>
                <span className="px-2 py-1 border border-[#f0f0f0]/30 text-[#f0f0f0]/30 hover:text-[#f0f0f0] hover:border-[#f0f0f0] cursor-pointer transition-colors">
                  EN
                </span>
              </div>
            </nav>
          </div>

          {/* Horizontal rule with label */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-[#f0f0f0]/20" />
            <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-[0.5em]">
              v.01 // {new Date().getFullYear()}
            </span>
            <div className="h-[2px] w-16 bg-[#ff2222]" />
          </div>
        </header>

        {/* TAG BAR */}
        <section className="px-4 sm:px-8 py-6 border-y border-[#f0f0f0]/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-widest mr-4">
              Filtry //
            </span>
            {allTags.map((tag) => (
              <span
                key={tag}
                className="tag-sticker hover:bg-[#f0f0f0] hover:text-[#0a0a0a] cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        <section id="clanky" className="px-4 sm:px-8 py-10 relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-[0.3em]">
              Hlavní zpráva
            </span>
            <div className="h-[1px] flex-1 bg-[#ff2222]/40" />
            <span className="font-mono text-[10px] text-[#f0f0f0]/30">
              {featured.date}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0">
            {/* Main featured content */}
            <div className="lg:col-span-8 cut-out p-6 sm:p-8 relative scanline">
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.tags.map((tag) => (
                  <span key={tag} className="tag-sticker tag-sticker-red">
                    {tag}
                  </span>
                ))}
                <span className="tag-sticker text-[#f0f0f0]/50">
                  {featured.readTime} min čtení
                </span>
                <span className="tag-sticker text-[#f0f0f0]/50">
                  {featured.sources.length} zdrojů
                </span>
              </div>

              <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#f0f0f0] mb-6 glitch-hover cursor-pointer">
                {featured.title}
              </h2>

              <p className="font-mono text-sm sm:text-base leading-relaxed text-[#f0f0f0]/70 max-w-2xl mb-8">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ff2222] harsh-underline cursor-pointer">
                  Číst článek &rarr;
                </span>
              </div>

              {/* Decorative corner marks */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff2222]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff2222]" />
            </div>

            {/* Side annotation - AI Comments for featured */}
            <div className="lg:col-span-4 lg:pl-8 flex flex-col gap-4 lg:-mt-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff2222] mb-2">
                // AI modely komentují
              </div>
              {featured.aiComments.map((comment, idx) => (
                <div
                  key={idx}
                  className={`ai-annotation ${idx === 1 ? "rotate-neg" : idx === 2 ? "rotate-1" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{comment.avatar}</span>
                    <span className="font-mono text-[11px] font-bold text-[#f0f0f0] uppercase tracking-wider">
                      {comment.model}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed text-[#f0f0f0]/60">
                    &ldquo;{comment.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="px-4 sm:px-8">
          <div className="border-t border-[#f0f0f0]/10 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#0a0a0a] px-4 font-mono text-[10px] text-[#f0f0f0]/20 uppercase tracking-[0.5em]">
              Další zprávy
            </span>
          </div>
        </div>

        {/* ARTICLE GRID - Asymmetric brutalist layout */}
        <section className="px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Article 2 - Wide */}
            <div className="md:col-span-7 noise-border p-5 sm:p-6 rotate-1 hover:rotate-0 transition-transform relative group">
              <div className="flex flex-wrap gap-2 mb-4">
                {rest[0].tags.map((tag) => (
                  <span key={tag} className="tag-sticker tag-sticker-red">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                {rest[0].date} // {rest[0].readTime} min
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl leading-tight text-[#f0f0f0] mb-4 group-hover:text-[#ff2222] transition-colors cursor-pointer">
                {rest[0].title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-[#f0f0f0]/50 max-w-lg">
                {rest[0].excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-widest cursor-pointer harsh-underline">
                  Číst &rarr;
                </span>
                <span className="font-mono text-[10px] text-[#f0f0f0]/30">
                  {rest[0].sources.length} zdrojů
                </span>
              </div>
            </div>

            {/* Article 3 - Narrow tall */}
            <div className="md:col-span-5 border-2 border-[#ff2222] p-5 sm:p-6 rotate-2 hover:rotate-0 transition-transform relative group bg-[#ff2222]/5">
              <div className="absolute -top-3 -right-3 bg-[#ff2222] text-[#0a0a0a] font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                Regulace
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {rest[1].tags.map((tag) => (
                  <span key={tag} className="tag-sticker">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                {rest[1].date} // {rest[1].readTime} min
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl leading-tight text-[#f0f0f0] mb-4 group-hover:text-[#ff2222] transition-colors cursor-pointer">
                {rest[1].title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-[#f0f0f0]/50">
                {rest[1].excerpt}
              </p>
              <div className="mt-4">
                <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-widest cursor-pointer harsh-underline">
                  Číst &rarr;
                </span>
              </div>
            </div>

            {/* Article 4 - Medium, offset */}
            <div className="md:col-span-5 md:col-start-1 noise-border p-5 sm:p-6 rotate-neg hover:rotate-0 transition-transform relative group md:-mt-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {rest[2].tags.map((tag) => (
                  <span key={tag} className="tag-sticker tag-sticker-red">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                {rest[2].date} // {rest[2].readTime} min
              </span>
              <h3 className="font-headline text-xl sm:text-2xl leading-tight text-[#f0f0f0] mb-3 group-hover:text-[#ff2222] transition-colors cursor-pointer">
                {rest[2].title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-[#f0f0f0]/50">
                {rest[2].excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-widest cursor-pointer harsh-underline">
                  Číst &rarr;
                </span>
                <span className="font-mono text-[10px] text-[#f0f0f0]/30">
                  {rest[2].sources.length} zdrojů
                </span>
              </div>
            </div>

            {/* Article 5 - Wide, contrasting */}
            <div className="md:col-span-7 border-2 border-[#f0f0f0] p-5 sm:p-6 relative group md:-mt-4">
              {/* Decorative vertical text */}
              <div className="hidden lg:block absolute -right-8 top-0 vertical-text font-mono text-[10px] text-[#f0f0f0]/10 uppercase tracking-[0.5em]">
                Hardware
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {rest[3].tags.map((tag) => (
                  <span key={tag} className="tag-sticker">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest block mb-3">
                {rest[3].date} // {rest[3].readTime} min
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl leading-tight text-[#f0f0f0] mb-4 group-hover:text-[#ff2222] transition-colors cursor-pointer glitch-hover">
                {rest[3].title}
              </h3>
              <p className="font-mono text-xs sm:text-sm leading-relaxed text-[#f0f0f0]/50 max-w-xl">
                {rest[3].excerpt}
              </p>
              <div className="mt-6 flex items-center gap-6">
                <span className="font-mono text-[10px] text-[#ff2222] uppercase tracking-widest cursor-pointer harsh-underline">
                  Číst článek &rarr;
                </span>
                <span className="font-mono text-[10px] text-[#f0f0f0]/30">
                  {rest[3].sources.length} zdrojů
                </span>
              </div>
              {/* Bottom decorative bar */}
              <div className="absolute bottom-0 left-0 h-1 w-1/3 bg-[#ff2222]" />
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="border-y border-[#f0f0f0]/10 py-6 px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="font-headline text-4xl sm:text-5xl text-[#ff2222]">5</div>
              <div className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest mt-1">
                Článků dnes
              </div>
            </div>
            <div>
              <div className="font-headline text-4xl sm:text-5xl text-[#f0f0f0]">
                {allTags.length}
              </div>
              <div className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest mt-1">
                Témat
              </div>
            </div>
            <div>
              <div className="font-headline text-4xl sm:text-5xl text-[#f0f0f0]">3</div>
              <div className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest mt-1">
                AI komentátoři
              </div>
            </div>
            <div>
              <div className="font-headline text-4xl sm:text-5xl text-[#ff2222] cursor-blink">
                24
              </div>
              <div className="font-mono text-[10px] text-[#f0f0f0]/40 uppercase tracking-widest mt-1">
                Hodin non-stop
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-4 sm:px-8 py-12 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <div className="font-headline text-2xl sm:text-3xl text-[#f0f0f0]/20 mb-2">
                BEROU NÁM PRÁCI
              </div>
              <p className="font-mono text-xs text-[#f0f0f0]/30 max-w-sm leading-relaxed">
                Generováno umělou inteligencí. Každý den.
              </p>
            </div>
            <div className="font-mono text-[10px] text-[#f0f0f0]/20 text-right leading-loose">
              <div>verze 01 / 05</div>
              <div>brutalist dark editorial</div>
              <div className="text-[#ff2222]/40">&copy; {new Date().getFullYear()}</div>
            </div>
          </div>
          <div className="mt-8 h-[1px] bg-[#f0f0f0]/5" />
          <div className="mt-4 font-mono text-[9px] text-[#f0f0f0]/10 uppercase tracking-[0.5em]">
            Žádná práce není v bezpečí. Žádná profese není posvátná. Budoucnost je teď.
          </div>
        </footer>
      </div>
    </div>
  );
}
