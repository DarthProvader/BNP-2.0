import { articles, allTags } from "@/lib/mockData";
import { Permanent_Marker, Special_Elite, Anton } from "next/font/google";
import Link from "next/link";

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata = {
  title: "BEROU NAM PRACI — PUNK ZINE #01",
  description: "AI zere svet. DIY zine o umele inteligenci.",
};

/* Deterministic pseudo-random rotations per card */
const rotations = [-3, 2.5, -1.5, 4, -2, 3.5];
const noteColors = ["#ff1493", "#ffe000", "#f2efe8", "#ff1493", "#ffe000"];
const tapePositions = ["top-left", "top-right", "bottom-left", "bottom-right"] as const;

export default function Page() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${permanentMarker.variable} ${specialElite.variable} ${anton.variable} min-h-screen relative`}
    >
      <style>{`
        :root {
          --zine-black: #0d0d0d;
          --zine-paper: #f2efe8;
          --zine-pink: #ff1493;
          --zine-yellow: #ffe000;
          --zine-gray: #888;
          --zine-dark-gray: #333;
        }

        .zine-page {
          background-color: var(--zine-black);
          color: var(--zine-paper);
          font-family: var(--font-typewriter), 'Courier New', monospace;
        }

        /* Photocopy noise texture overlay */
        .zine-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .zine-page > * {
          position: relative;
          z-index: 1;
        }

        .font-marker {
          font-family: var(--font-marker), cursive;
        }

        .font-typewriter {
          font-family: var(--font-typewriter), 'Courier New', monospace;
        }

        .font-display {
          font-family: var(--font-anton), sans-serif;
        }

        /* Torn paper edges via clip-path */
        .torn-top {
          clip-path: polygon(
            0% 4%, 3% 0%, 7% 3%, 11% 1%, 15% 4%, 19% 0%, 23% 2%, 27% 0%, 31% 3%, 35% 1%, 39% 4%, 43% 0%, 47% 3%, 51% 1%, 55% 0%, 59% 3%, 63% 1%, 67% 4%, 71% 0%, 75% 2%, 79% 0%, 83% 3%, 87% 1%, 91% 4%, 95% 0%, 100% 3%,
            100% 100%, 0% 100%
          );
        }

        .torn-bottom {
          clip-path: polygon(
            0% 0%, 100% 0%,
            100% 96%, 97% 100%, 93% 97%, 89% 100%, 85% 96%, 81% 100%, 77% 98%, 73% 100%, 69% 97%, 65% 100%, 61% 96%, 57% 100%, 53% 98%, 49% 100%, 45% 97%, 41% 100%, 37% 96%, 33% 100%, 29% 98%, 25% 100%, 21% 97%, 17% 100%, 13% 96%, 9% 100%, 5% 98%, 1% 100%, 0% 97%
          );
        }

        .torn-all {
          clip-path: polygon(
            0% 3%, 3% 0%, 7% 2%, 11% 0%, 15% 3%, 19% 1%, 23% 3%, 27% 0%, 31% 2%, 35% 0%, 39% 3%, 43% 1%, 47% 0%, 51% 2%, 55% 0%, 59% 3%, 63% 1%, 67% 0%, 71% 2%, 75% 0%, 79% 3%, 83% 1%, 87% 0%, 91% 2%, 95% 0%, 100% 3%,
            100% 97%, 97% 100%, 93% 98%, 89% 100%, 85% 97%, 81% 100%, 77% 98%, 73% 100%, 69% 97%, 65% 100%, 61% 98%, 57% 100%, 53% 97%, 49% 100%, 45% 98%, 41% 100%, 37% 97%, 33% 100%, 29% 98%, 25% 100%, 21% 97%, 17% 100%, 13% 98%, 9% 100%, 5% 97%, 1% 100%, 0% 97%
          );
        }

        /* Tape strip decoration */
        .tape {
          position: absolute;
          width: 80px;
          height: 22px;
          background: rgba(255, 224, 0, 0.45);
          z-index: 10;
          pointer-events: none;
        }

        .tape-tl {
          top: -8px;
          left: 15px;
          transform: rotate(-15deg);
        }

        .tape-tr {
          top: -6px;
          right: 20px;
          transform: rotate(12deg);
        }

        .tape-bl {
          bottom: -8px;
          left: 25px;
          transform: rotate(8deg);
        }

        .tape-br {
          bottom: -6px;
          right: 15px;
          transform: rotate(-10deg);
        }

        /* Yellow highlighter effect */
        .highlight-marker {
          background: linear-gradient(180deg, transparent 55%, rgba(255, 224, 0, 0.5) 55%, rgba(255, 224, 0, 0.5) 90%, transparent 90%);
          padding: 0 4px;
        }

        /* Pink highlighter */
        .highlight-pink {
          background: linear-gradient(180deg, transparent 55%, rgba(255, 20, 147, 0.4) 55%, rgba(255, 20, 147, 0.4) 90%, transparent 90%);
          padding: 0 4px;
        }

        /* X marks */
        .x-mark::before {
          content: 'X';
          font-family: var(--font-marker), cursive;
          color: var(--zine-pink);
          font-size: 28px;
          position: absolute;
          opacity: 0.6;
        }

        /* Circle drawn around text */
        .hand-circle {
          border: 2px solid var(--zine-pink);
          border-radius: 50%;
          padding: 4px 12px;
          display: inline-block;
          transform: rotate(-2deg);
          position: relative;
        }

        .hand-circle::after {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border: 1px solid var(--zine-pink);
          border-radius: 50%;
          transform: rotate(3deg);
          opacity: 0.5;
        }

        /* Safety pin CSS decoration */
        .safety-pin {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 30px;
        }

        .safety-pin::before {
          content: '';
          position: absolute;
          width: 14px;
          height: 20px;
          border: 2px solid var(--zine-gray);
          border-radius: 0 0 50% 50%;
          top: 5px;
          left: 3px;
        }

        .safety-pin::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 12px;
          background: var(--zine-gray);
          top: 0;
          left: 3px;
        }

        /* Staple decoration */
        .staple {
          position: absolute;
          width: 4px;
          height: 14px;
          background: linear-gradient(to right, #999, #ccc, #999);
          border-radius: 1px;
          z-index: 10;
        }

        /* Paper scrap base */
        .paper-scrap {
          background: var(--zine-paper);
          color: var(--zine-black);
          position: relative;
          box-shadow: 3px 3px 8px rgba(0,0,0,0.5);
        }

        .paper-dark {
          background: var(--zine-dark-gray);
          color: var(--zine-paper);
          box-shadow: 3px 3px 8px rgba(0,0,0,0.5);
        }

        /* Sticky note */
        .sticky-note {
          padding: 16px 18px;
          position: relative;
          box-shadow: 3px 3px 10px rgba(0,0,0,0.4);
          min-width: 200px;
        }

        .sticky-note::after {
          content: '';
          position: absolute;
          bottom: -3px;
          right: 5px;
          width: 60%;
          height: 8px;
          background: rgba(0,0,0,0.15);
          filter: blur(3px);
          transform: rotate(1deg);
        }

        /* Ransom note: alternating font styles within words */
        .ransom-word-marker {
          font-family: var(--font-marker), cursive;
          display: inline;
        }

        .ransom-word-display {
          font-family: var(--font-anton), sans-serif;
          display: inline;
          text-transform: uppercase;
        }

        .ransom-word-typewriter {
          font-family: var(--font-typewriter), 'Courier New', monospace;
          display: inline;
        }

        /* Spray paint drip effect on text */
        .spray-text {
          font-family: var(--font-marker), cursive;
          text-shadow:
            0 0 10px rgba(255, 20, 147, 0.4),
            0 0 20px rgba(255, 20, 147, 0.2),
            2px 3px 0 rgba(0, 0, 0, 0.3);
          letter-spacing: 0.05em;
        }

        /* Xerox/photocopy look */
        .xerox {
          filter: contrast(1.3) brightness(0.95);
          text-shadow: 0.5px 0.5px 0 rgba(0,0,0,0.3);
        }

        /* Star decoration */
        .punk-star {
          display: inline-block;
          position: relative;
          color: var(--zine-yellow);
          font-size: 24px;
          line-height: 1;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
          75% { opacity: 0.95; }
        }

        .flicker {
          animation: flicker 3s infinite;
        }

        /* Stamp effect */
        .stamp {
          border: 3px solid currentColor;
          border-radius: 4px;
          padding: 4px 12px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          display: inline-block;
          position: relative;
          font-weight: bold;
        }

        .stamp::before {
          content: '';
          position: absolute;
          inset: 2px;
          border: 1px solid currentColor;
          border-radius: 2px;
          opacity: 0.5;
        }
      `}</style>

      <div className="zine-page min-h-screen">
        {/* ====== HEADER ====== */}
        <header className="relative px-4 sm:px-8 pt-6 pb-8 overflow-hidden">
          {/* Back link - looks hand-labeled */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="font-typewriter text-sm tracking-wider text-[#ffe000] hover:text-[#ff1493] transition-colors inline-flex items-center gap-2"
              style={{ transform: "rotate(-1deg)" }}
            >
              <span className="text-xl">&larr;</span>
              <span className="border-b-2 border-dashed border-[#ffe000]">Zpet na vyber</span>
            </Link>

            {/* CZ/EN toggle - circled options */}
            <div className="flex items-center gap-3" style={{ transform: "rotate(2deg)" }}>
              <span className="hand-circle font-marker text-sm text-[#ff1493] font-bold">CZ</span>
              <span className="font-typewriter text-xs text-[#f2efe8]/40 line-through">EN</span>
            </div>
          </div>

          {/* Spray-painted title */}
          <div className="relative" style={{ transform: "rotate(-1.5deg)" }}>
            {/* Decorative X marks */}
            <div className="absolute -left-2 -top-4 font-marker text-[#ff1493] text-4xl opacity-40 select-none" aria-hidden="true">X</div>
            <div className="absolute right-8 top-2 font-marker text-[#ffe000] text-3xl opacity-30 select-none" aria-hidden="true">X</div>

            <h1 className="spray-text text-6xl sm:text-8xl md:text-9xl lg:text-[140px] leading-[0.85] text-[#ff1493] tracking-wide flicker">
              BEROU
            </h1>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] text-[#ffe000] mt-1" style={{ transform: "rotate(1.5deg) translateX(20px)" }}>
              NAM
            </h1>
            <h1 className="spray-text text-6xl sm:text-8xl md:text-9xl lg:text-[140px] leading-[0.85] text-[#f2efe8] mt-1" style={{ transform: "rotate(-0.5deg)" }}>
              PRACI
            </h1>

            {/* Punk stars */}
            <span className="punk-star absolute top-4 right-4 sm:right-16" aria-hidden="true">&#9733;</span>
            <span className="punk-star absolute bottom-2 right-1/4 text-[#ff1493]" aria-hidden="true">&#9733;</span>
          </div>

          {/* Typed subtitle */}
          <div className="mt-6 ml-2 sm:ml-8" style={{ transform: "rotate(0.5deg)" }}>
            <p className="font-typewriter text-sm sm:text-base text-[#f2efe8]/80 max-w-md leading-relaxed xerox">
              AI zere svet. My o tom piseme.<br />
              <span className="text-[#ff1493]">Cislo #01</span> // <span className="text-[#ffe000]">unor 2026</span> // <span className="text-[#f2efe8]/50">xeroxovano v garazi</span>
            </p>
          </div>

          {/* Nav - hand-labeled tabs */}
          <nav className="mt-8 flex flex-wrap gap-3" style={{ transform: "rotate(0.8deg)" }}>
            {["Clanky", "Zdroje", "O zinu"].map((item, i) => (
              <span
                key={item}
                className="font-marker text-base sm:text-lg px-4 py-2 cursor-pointer transition-colors"
                style={{
                  background: i === 0 ? "#ff1493" : "transparent",
                  color: i === 0 ? "#0d0d0d" : "#f2efe8",
                  border: i === 0 ? "none" : "2px solid #f2efe8",
                  transform: `rotate(${i === 0 ? -2 : i === 1 ? 1.5 : -1}deg)`,
                }}
              >
                {item}
              </span>
            ))}
          </nav>

          {/* Decorative torn strip */}
          <div className="mt-8 h-6 bg-[#f2efe8]/10 torn-bottom" />
        </header>

        {/* ====== FEATURED ARTICLE — large paper scrap pinned to page ====== */}
        <section className="px-4 sm:px-8 py-6 relative">
          <div className="relative" style={{ transform: "rotate(-1deg)" }}>
            {/* Paper scrap */}
            <div className="paper-scrap torn-all p-6 sm:p-10 md:p-14 relative">
              {/* Tape strips */}
              <div className="tape tape-tl" />
              <div className="tape tape-tr" />

              {/* Staple */}
              <div className="staple" style={{ top: "20px", left: "8px", transform: "rotate(-5deg)" }} />

              {/* "HLAVNI ZPRAVA" stamp */}
              <div className="absolute top-4 right-6 sm:top-6 sm:right-10 stamp text-[#ff1493] text-[10px] sm:text-xs font-typewriter" style={{ transform: "rotate(12deg)" }}>
                Hlavni zprava
              </div>

              {/* Ransom-note title */}
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6 mt-6">
                <span className="ransom-word-marker text-[#0d0d0d]" style={{ fontSize: "1.1em" }}>Claude 4 </span>
                <span className="ransom-word-display text-[#ff1493]" style={{ fontSize: "0.95em" }}>Opus </span>
                <span className="ransom-word-typewriter text-[#0d0d0d]">meni </span>
                <span className="ransom-word-marker highlight-marker" style={{ fontSize: "1.05em" }}>pravidla</span>
                <span className="ransom-word-display text-[#0d0d0d]"> hry</span>
              </h2>

              {/* Metadata - typed look */}
              <div className="font-typewriter text-xs sm:text-sm text-[#0d0d0d]/60 mb-6 flex flex-wrap gap-x-4 gap-y-1">
                <span>{featured.date}</span>
                <span>//</span>
                <span>{featured.readTime} min cteni</span>
                <span>//</span>
                <span>{featured.sources.length} zdroju</span>
              </div>

              {/* Tags as stickers/stamps */}
              <div className="flex flex-wrap gap-2 mb-6">
                {featured.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className="font-marker text-xs px-3 py-1 border-2 border-[#0d0d0d] inline-block"
                    style={{ transform: `rotate(${i % 2 === 0 ? -3 : 4}deg)`, background: i === 0 ? "#ff1493" : i === 1 ? "#ffe000" : "transparent", color: i === 2 ? "#0d0d0d" : "#0d0d0d" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Excerpt on a DIFFERENT angled scrap, overlapping */}
            <div
              className="paper-dark torn-top p-6 sm:p-8 mt-[-30px] sm:mt-[-40px] ml-4 sm:ml-12 md:ml-20 mr-2 sm:mr-4 relative"
              style={{ transform: "rotate(1.5deg)" }}
            >
              <div className="tape tape-tr" />
              <p className="font-typewriter text-sm sm:text-base leading-relaxed text-[#f2efe8]/90 max-w-2xl">
                &ldquo;{featured.excerpt}&rdquo;
              </p>
              <div className="mt-4">
                <span className="font-marker text-[#ff1493] text-sm cursor-pointer hover:text-[#ffe000] transition-colors">
                  CIST CLANEK &#8594;
                </span>
              </div>
              {/* Hand-drawn circle around arrow */}
              <div className="absolute bottom-3 left-[calc(100%-90px)] w-8 h-8 border-2 border-[#ff1493] rounded-full opacity-40" style={{ transform: "rotate(5deg)" }} />
            </div>
          </div>
        </section>

        {/* ====== ARTICLE CARDS — each a different paper scrap ====== */}
        <section className="px-4 sm:px-8 py-8">
          {/* Section label - typewritten */}
          <div className="font-typewriter text-xs text-[#ffe000] uppercase tracking-[0.4em] mb-8 ml-2" style={{ transform: "rotate(-0.5deg)" }}>
            --- dalsi clanky --------- <span className="text-[#ff1493]">*</span> --------
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">
            {rest.map((article, i) => {
              const isOnPaper = i % 2 === 0;
              const rotation = rotations[i] || 0;
              const hasTapeTL = i === 0 || i === 3;
              const hasTapeTR = i === 1 || i === 2;
              const hasTapeBR = i === 0 || i === 2;
              const hasStaple = i === 1 || i === 3;

              return (
                <div
                  key={article.slug}
                  className={`relative ${
                    i === 0
                      ? "md:col-span-7"
                      : i === 1
                        ? "md:col-span-5"
                        : i === 2
                          ? "md:col-span-5"
                          : "md:col-span-7"
                  } ${isOnPaper ? "paper-scrap" : "paper-dark"} ${
                    i === 0 ? "torn-all" : i === 1 ? "torn-bottom" : i === 2 ? "torn-top" : "torn-all"
                  } p-5 sm:p-7 group`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Tape strips */}
                  {hasTapeTL && <div className="tape tape-tl" />}
                  {hasTapeTR && <div className="tape tape-tr" />}
                  {hasTapeBR && <div className="tape tape-br" />}

                  {/* Staple */}
                  {hasStaple && (
                    <div className="staple" style={{ top: "12px", right: "12px", transform: "rotate(8deg)" }} />
                  )}

                  {/* Tags - sticker/stamp mix */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 inline-block ${
                          isOnPaper
                            ? "font-typewriter border border-[#0d0d0d] text-[#0d0d0d]"
                            : "font-marker border border-[#ff1493] text-[#ff1493]"
                        }`}
                        style={{ transform: `rotate(${ti % 2 === 0 ? -2 : 3}deg)` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <span className={`font-typewriter text-[10px] block mb-3 ${isOnPaper ? "text-[#0d0d0d]/50" : "text-[#f2efe8]/40"} uppercase tracking-widest`}>
                    {article.date} // {article.readTime} min
                  </span>

                  {/* Title - ransom note style alternation */}
                  <h3 className={`text-xl sm:text-2xl leading-tight mb-4 cursor-pointer ${isOnPaper ? "text-[#0d0d0d]" : "text-[#f2efe8]"}`}>
                    {article.title.split(" ").map((word, wi) => {
                      const fontClass =
                        wi % 3 === 0
                          ? "ransom-word-marker"
                          : wi % 3 === 1
                            ? "ransom-word-display"
                            : "ransom-word-typewriter";
                      const maybeHighlight = wi === 2 || wi === 5 ? "highlight-marker" : "";
                      return (
                        <span
                          key={wi}
                          className={`${fontClass} ${maybeHighlight}`}
                          style={{
                            fontSize: wi % 4 === 0 ? "1.05em" : wi % 4 === 2 ? "0.92em" : "1em",
                          }}
                        >
                          {word}{" "}
                        </span>
                      );
                    })}
                  </h3>

                  {/* Excerpt */}
                  <p className={`font-typewriter text-xs leading-relaxed ${isOnPaper ? "text-[#0d0d0d]/70" : "text-[#f2efe8]/60"} max-w-md`}>
                    {article.excerpt}
                  </p>

                  {/* Read more */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className={`font-marker text-sm cursor-pointer ${isOnPaper ? "text-[#ff1493]" : "text-[#ffe000]"} hover:underline`}>
                      CIST &#8594;
                    </span>
                    <span className={`font-typewriter text-[10px] ${isOnPaper ? "text-[#0d0d0d]/30" : "text-[#f2efe8]/30"}`}>
                      {article.sources.length} zdroju
                    </span>
                  </div>

                  {/* Decorative marks on some cards */}
                  {i === 0 && (
                    <div className="absolute -bottom-1 -right-1 font-marker text-[#ff1493] text-5xl opacity-20 select-none" aria-hidden="true">!</div>
                  )}
                  {i === 2 && (
                    <div className="absolute top-2 right-4 font-marker text-[#ffe000] text-3xl opacity-30 select-none" aria-hidden="true">&#9733;</div>
                  )}
                  {i === 3 && (
                    <div className="absolute -top-2 -left-2 font-marker text-[#ff1493] text-3xl opacity-30 select-none" aria-hidden="true">X</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ====== TAGS — stickers, stamps, circled words ====== */}
        <section className="px-4 sm:px-8 py-8">
          <div className="torn-top bg-[#f2efe8]/5 p-6 sm:p-8 relative">
            <div className="tape tape-tl" />
            <div className="font-typewriter text-[10px] text-[#ffe000] uppercase tracking-[0.4em] mb-6">
              // temata //
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {allTags.map((tag, i) => {
                /* Alternate between stamp, sticker, circled */
                if (i % 3 === 0) {
                  return (
                    <span
                      key={tag}
                      className="stamp text-[#ff1493] font-marker text-xs cursor-pointer hover:bg-[#ff1493] hover:text-[#0d0d0d] transition-colors"
                      style={{ transform: `rotate(${i % 2 === 0 ? -4 : 5}deg)` }}
                    >
                      {tag}
                    </span>
                  );
                }
                if (i % 3 === 1) {
                  return (
                    <span
                      key={tag}
                      className="hand-circle font-typewriter text-xs text-[#f2efe8] cursor-pointer hover:text-[#ffe000] transition-colors"
                      style={{ transform: `rotate(${i % 2 === 0 ? 3 : -2}deg)` }}
                    >
                      {tag}
                    </span>
                  );
                }
                return (
                  <span
                    key={tag}
                    className="font-marker text-sm px-3 py-1 bg-[#ffe000] text-[#0d0d0d] inline-block cursor-pointer hover:bg-[#ff1493] transition-colors"
                    style={{ transform: `rotate(${i % 2 === 0 ? -2 : 4}deg)` }}
                  >
                    #{tag}
                  </span>
                );
              })}
              {/* Extra punk decorations */}
              <span className="punk-star text-[#ff1493]" aria-hidden="true">&#9733;</span>
              <span className="font-marker text-[#f2efe8]/20 text-2xl select-none" aria-hidden="true">///</span>
            </div>
          </div>
        </section>

        {/* ====== AI COMMENTS — sticky notes stuck on the page ====== */}
        <section className="px-4 sm:px-8 py-8 relative">
          <div className="font-marker text-2xl sm:text-3xl text-[#ff1493] mb-8" style={{ transform: "rotate(-2deg)" }}>
            AI modely <span className="highlight-marker text-[#0d0d0d]">komentujou</span>
            <span className="font-typewriter text-xs text-[#f2efe8]/40 ml-4 align-middle">(nejsou zaplaceny)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featured.aiComments.map((comment, i) => {
              const noteColor = i === 0 ? "#ff1493" : i === 1 ? "#ffe000" : "#f2efe8";
              const textColor = i === 1 ? "#0d0d0d" : i === 2 ? "#0d0d0d" : "#f2efe8";
              const rotation = i === 0 ? -2.5 : i === 1 ? 3 : -1;

              return (
                <div
                  key={i}
                  className="sticky-note"
                  style={{
                    background: noteColor,
                    color: textColor,
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  {/* Tape at top */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5"
                    style={{
                      background: "rgba(255, 224, 0, 0.5)",
                      transform: `rotate(${i === 0 ? -5 : i === 1 ? 3 : -8}deg)`,
                    }}
                  />

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{comment.avatar}</span>
                    <span className="font-marker text-base">{comment.model}</span>
                  </div>

                  <p className="font-typewriter text-xs leading-relaxed" style={{ color: textColor, opacity: 0.85 }}>
                    &ldquo;{comment.comment}&rdquo;
                  </p>

                  {/* Decorative scribbles */}
                  {i === 0 && (
                    <div className="absolute bottom-2 right-3 font-marker text-[#f2efe8]/30 text-xs" aria-hidden="true">~ legit ~</div>
                  )}
                  {i === 2 && (
                    <div className="absolute top-3 right-4 font-marker text-[#0d0d0d]/20 text-xl" aria-hidden="true">*</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Extra comments from other articles scattered */}
          <div className="mt-8 flex flex-wrap gap-4">
            {rest.slice(0, 2).map((article, ai) =>
              article.aiComments.slice(0, 1).map((comment, ci) => (
                <div
                  key={`${ai}-${ci}`}
                  className="sticky-note max-w-xs"
                  style={{
                    background: ai === 0 ? "#333" : "#ff1493",
                    color: "#f2efe8",
                    transform: `rotate(${ai === 0 ? 4 : -3}deg)`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{comment.avatar}</span>
                    <span className="font-marker text-sm">{comment.model}</span>
                    <span className="font-typewriter text-[9px] opacity-50">re: {article.slug.split("-").slice(0, 2).join(" ")}</span>
                  </div>
                  <p className="font-typewriter text-[11px] leading-relaxed opacity-80">
                    &ldquo;{comment.comment.substring(0, 100)}...&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ====== STATS — spray painted on wall ====== */}
        <section className="px-4 sm:px-8 py-8">
          <div className="flex flex-wrap gap-6 sm:gap-10 items-end" style={{ transform: "rotate(-0.5deg)" }}>
            <div>
              <div className="spray-text text-6xl sm:text-7xl text-[#ff1493]">5</div>
              <div className="font-typewriter text-[10px] text-[#f2efe8]/40 uppercase tracking-widest">clanku</div>
            </div>
            <div style={{ transform: "rotate(3deg)" }}>
              <div className="font-display text-5xl sm:text-6xl text-[#ffe000]">{allTags.length}</div>
              <div className="font-typewriter text-[10px] text-[#f2efe8]/40 uppercase tracking-widest">temat</div>
            </div>
            <div style={{ transform: "rotate(-2deg)" }}>
              <div className="spray-text text-6xl sm:text-7xl text-[#f2efe8]">3</div>
              <div className="font-typewriter text-[10px] text-[#f2efe8]/40 uppercase tracking-widest">AI komentatori</div>
            </div>
            <div style={{ transform: "rotate(1.5deg)" }}>
              <div className="font-display text-5xl sm:text-6xl text-[#ff1493]">DIY</div>
              <div className="font-typewriter text-[10px] text-[#f2efe8]/40 uppercase tracking-widest">kazdej den</div>
            </div>
          </div>
        </section>

        {/* ====== FOOTER — zine footer ====== */}
        <footer className="px-4 sm:px-8 py-10 relative">
          <div className="torn-top bg-[#f2efe8]/5 p-6 sm:p-8 relative">
            <div className="tape tape-tl" />
            <div className="tape tape-br" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <div className="spray-text text-3xl sm:text-4xl text-[#ff1493]/60">
                  BEROU NAM PRACI
                </div>
                <p className="font-typewriter text-xs text-[#f2efe8]/50 mt-2 leading-relaxed xerox">
                  cislo #01 // unor 2026<br />
                  xeroxovano v garazi // 50 kopii<br />
                  <span className="text-[#ffe000]/60">free — ber a dej dal</span>
                </p>
              </div>

              <div className="text-right">
                <div className="font-marker text-sm text-[#f2efe8]/30" style={{ transform: "rotate(3deg)" }}>
                  verze 02 / 05
                </div>
                <div className="font-typewriter text-[10px] text-[#f2efe8]/20 mt-1">
                  punk zine collage
                </div>
                <div className="font-typewriter text-[10px] text-[#ff1493]/40 mt-1">
                  &copy; {new Date().getFullYear()} — copyleft, kradez povolena
                </div>
              </div>
            </div>

            {/* Decorative bottom */}
            <div className="mt-6 flex items-center gap-2">
              <span className="punk-star text-[#ff1493] text-sm" aria-hidden="true">&#9733;</span>
              <div className="h-[2px] flex-1 bg-linear-to-r from-[#ff1493] via-[#ffe000] to-transparent" />
              <span className="punk-star text-[#ffe000] text-sm" aria-hidden="true">&#9733;</span>
            </div>

            <p className="font-typewriter text-[9px] text-[#f2efe8]/15 uppercase tracking-[0.4em] mt-4">
              zadna prace neni v bezpeci // zadna profese neni posvatna // budoucnost je ted // punk&apos;s not dead
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
