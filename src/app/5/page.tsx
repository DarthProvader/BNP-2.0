import Link from "next/link";
import { Playfair_Display, Libre_Baskerville, Oswald } from "next/font/google";
import { articles, allTags } from "@/lib/mockData";

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

const baskerville = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-baskerville",
});

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-oswald",
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatNewspaperDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const days = [
    "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota",
  ];
  const months = [
    "ledna", "února", "března", "dubna", "května", "června",
    "července", "srpna", "září", "října", "listopadu", "prosince",
  ];
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/* Jagged torn-edge clip-paths */
const tornEdgeA =
  "polygon(0% 0%, 2% 3%, 5% 0%, 8% 2%, 12% 0%, 15% 1%, 18% 0%, 22% 3%, 25% 0%, 28% 2%, 32% 0%, 35% 1%, 38% 0%, 42% 2%, 45% 0%, 48% 3%, 52% 0%, 55% 1%, 58% 0%, 62% 2%, 65% 0%, 68% 3%, 72% 0%, 75% 1%, 78% 0%, 82% 2%, 85% 0%, 88% 1%, 92% 0%, 95% 2%, 98% 0%, 100% 0%, 100% 97%, 98% 100%, 95% 98%, 92% 100%, 88% 99%, 85% 100%, 82% 98%, 78% 100%, 75% 99%, 72% 100%, 68% 97%, 65% 100%, 62% 98%, 58% 100%, 55% 99%, 52% 100%, 48% 97%, 45% 100%, 42% 98%, 38% 100%, 35% 99%, 32% 100%, 28% 98%, 25% 100%, 22% 97%, 18% 100%, 15% 99%, 12% 100%, 8% 98%, 5% 100%, 2% 97%, 0% 100%)";

const tornEdgeB =
  "polygon(0% 2%, 3% 0%, 7% 2%, 10% 0%, 14% 1%, 18% 0%, 22% 3%, 26% 0%, 30% 1%, 34% 0%, 38% 2%, 42% 0%, 46% 1%, 50% 0%, 54% 2%, 58% 0%, 62% 1%, 66% 0%, 70% 3%, 74% 0%, 78% 2%, 82% 0%, 86% 1%, 90% 0%, 94% 2%, 97% 0%, 100% 1%, 100% 98%, 97% 100%, 93% 98%, 89% 100%, 85% 99%, 81% 100%, 77% 98%, 73% 100%, 69% 99%, 65% 100%, 61% 97%, 57% 100%, 53% 98%, 49% 100%, 45% 99%, 41% 100%, 37% 97%, 33% 100%, 29% 98%, 25% 100%, 21% 99%, 17% 100%, 13% 98%, 9% 100%, 5% 99%, 2% 100%, 0% 98%)";

const tornEdgeC =
  "polygon(1% 0%, 4% 2%, 8% 0%, 11% 1%, 15% 0%, 19% 3%, 23% 0%, 27% 1%, 31% 0%, 35% 2%, 39% 0%, 43% 1%, 47% 0%, 51% 3%, 55% 0%, 59% 2%, 63% 0%, 67% 1%, 71% 0%, 75% 2%, 79% 0%, 83% 3%, 87% 0%, 91% 1%, 95% 0%, 99% 2%, 100% 0%, 100% 100%, 98% 97%, 94% 100%, 90% 98%, 86% 100%, 82% 99%, 78% 100%, 74% 97%, 70% 100%, 66% 98%, 62% 100%, 58% 99%, 54% 100%, 50% 97%, 46% 100%, 42% 98%, 38% 100%, 34% 99%, 30% 100%, 26% 98%, 22% 100%, 18% 97%, 14% 100%, 10% 99%, 6% 100%, 2% 98%, 0% 100%)";

const tornEdges = [tornEdgeA, tornEdgeB, tornEdgeC];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */
function Pin({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute w-4 h-4 z-20 ${className}`}>
      <div
        className="w-4 h-4 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, #e0ddd8, #777)",
          boxShadow:
            "1px 2px 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.3)",
        }}
      />
      <div
        className="absolute top-1 left-1/2 w-0.5 h-3 -translate-x-1/2"
        style={{ background: "linear-gradient(to bottom, #888, #444)" }}
      />
    </div>
  );
}

function RedThread({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute pointer-events-none z-5 hidden lg:block"
      style={{
        height: "2px",
        background: "#cc2222",
        opacity: 0.35,
        transformOrigin: "left center",
        ...style,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function DeconstructedNewspaper() {
  const featured = articles[0];
  const restArticles = articles.slice(1);
  const rotations = [-1.2, 0.8, -0.5, 1.4, -1.8, 0.6];

  return (
    <div
      className={`relative min-h-screen ${playfair.variable} ${baskerville.variable} ${oswald.variable}`}
      style={{
        backgroundColor: "#0c0c0c",
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(30,25,20,0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(25,20,15,0.3) 0%, transparent 40%),
          radial-gradient(circle at 50% 80%, rgba(20,18,15,0.3) 0%, transparent 45%)
        `,
      }}
    >
      {/* Red thread connections between fragments */}
      <RedThread style={{ top: "400px", left: "8%", width: "220px", transform: "rotate(22deg)" }} />
      <RedThread style={{ top: "720px", right: "12%", width: "180px", transform: "rotate(-18deg)" }} />
      <RedThread style={{ top: "1150px", left: "15%", width: "300px", transform: "rotate(10deg)" }} />
      <RedThread style={{ top: "1600px", left: "55%", width: "160px", transform: "rotate(-30deg)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ========================================================= */}
        {/*  MASTHEAD                                                  */}
        {/* ========================================================= */}
        <header
          className="relative mx-auto max-w-4xl mb-14"
          style={{
            background: "#f5f0e8",
            clipPath: tornEdgeA,
            boxShadow:
              "4px 6px 20px rgba(0,0,0,0.5), 2px 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Pin className="-top-1 left-6" />
          <Pin className="-top-1 right-6" />

          <div className="px-6 sm:px-10 pt-8 pb-7">
            {/* Top info bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3"
              style={{ fontFamily: "var(--font-oswald)", color: "#555" }}
            >
              <span className="tracking-[0.2em] uppercase">
                Vol. II &bull; No. 42 &bull; Praha
              </span>
              <span className="italic" style={{ fontFamily: "var(--font-baskerville)" }}>
                Oblačno s šancí na singularitu
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hover:underline transition-colors"
                  style={{ color: "#444" }}
                >
                  &larr; Zpět
                </Link>
                <span
                  className="text-[10px] font-bold border px-1.5 py-0.5"
                  style={{ borderColor: "#777", color: "#333", background: "#e8e3da" }}
                >
                  CZ
                </span>
                <span
                  className="text-[10px] border px-1.5 py-0.5 opacity-40"
                  style={{ borderColor: "#aaa", color: "#999" }}
                >
                  EN
                </span>
              </div>
            </div>

            {/* Top decorative rules */}
            <div className="w-full h-0.5" style={{ background: "#111" }} />
            <div className="w-full h-px mt-0.5 mb-5" style={{ background: "#555" }} />

            {/* Main masthead title */}
            <h1
              className="text-center leading-none tracking-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.2rem, 7vw, 4.2rem)",
                fontWeight: 900,
                color: "#111",
                letterSpacing: "-0.02em",
              }}
            >
              BEROU NÁM PRÁCI
            </h1>

            {/* Subtitle */}
            <p
              className="text-center mt-2 tracking-[0.3em] uppercase text-xs sm:text-sm"
              style={{
                fontFamily: "var(--font-oswald)",
                color: "#666",
                fontWeight: 500,
              }}
            >
              Nezávislý deník o umělé inteligenci
            </p>

            {/* Bottom decorative rules */}
            <div className="w-full h-px mt-5" style={{ background: "#555" }} />
            <div className="w-full h-0.5 mt-0.5 mb-5" style={{ background: "#111" }} />

            {/* Nav sections */}
            <nav
              className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-oswald)", color: "#444" }}
            >
              {["Hlavní zprávy", "Technologie", "Regulace", "Komentáře", "Analýzy"].map(
                (section) => (
                  <span
                    key={section}
                    className="py-1 cursor-pointer hover:text-black transition-colors"
                  >
                    {section}
                  </span>
                )
              )}
            </nav>
          </div>
        </header>

        {/* ========================================================= */}
        {/*  FEATURED ARTICLE — FRONT PAGE                             */}
        {/* ========================================================= */}
        <section className="relative mx-auto max-w-5xl mb-16">
          <article
            className="relative"
            style={{
              background: "#f5f0e8",
              clipPath: tornEdgeA,
              boxShadow:
                "6px 8px 24px rgba(0,0,0,0.55), 3px 3px 10px rgba(0,0,0,0.3)",
            }}
          >
            <Pin className="-top-1 left-8" />
            <Pin className="-top-1 right-8" />
            <Pin className="bottom-3 left-1/2 -translate-x-1/2" />

            <div className="px-6 sm:px-10 lg:px-14 pt-10 pb-10">
              {/* Date & section */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span
                  className="text-[11px] tracking-[0.2em] uppercase font-bold"
                  style={{ fontFamily: "var(--font-oswald)", color: "#333" }}
                >
                  Hlavní zpráva
                </span>
                <span
                  className="text-xs italic"
                  style={{ fontFamily: "var(--font-baskerville)", color: "#888" }}
                >
                  {formatNewspaperDate(featured.date)}
                </span>
              </div>

              <div className="h-px mb-6" style={{ background: "#bbb" }} />

              {/* Headline with red circle annotation */}
              <div className="relative inline-block w-full">
                <h2
                  className="leading-[1.08] mb-6"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(1.7rem, 4.5vw, 3rem)",
                    fontWeight: 900,
                    color: "#111",
                  }}
                >
                  {featured.title}
                </h2>
                {/* Red circle annotation — hand-drawn feel */}
                <div
                  className="absolute pointer-events-none hidden sm:block"
                  style={{
                    top: "-8px",
                    right: "-4px",
                    width: "110px",
                    height: "70px",
                    borderRadius: "50%",
                    border: "2.5px solid #cc2222",
                    transform: "rotate(-12deg)",
                    opacity: 0.55,
                  }}
                />
              </div>

              {/* Byline */}
              <p
                className="text-[11px] mb-6 tracking-wider uppercase"
                style={{ fontFamily: "var(--font-oswald)", color: "#777" }}
              >
                Redakce AI &bull; Praha &bull; {featured.readTime} min čtení
              </p>

              {/* Multi-column body with drop cap */}
              <div
                style={{
                  fontFamily: "var(--font-baskerville)",
                  fontSize: "0.93rem",
                  lineHeight: 1.75,
                  color: "#222",
                }}
              >
                <div className="featured-columns">
                  {featured.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className={i === 0 ? "first-paragraph mb-4" : "mb-4"}>
                      {i === 0 ? (
                        <>
                          <span
                            className="float-left mr-2 leading-[0.85]"
                            style={{
                              fontFamily: "var(--font-playfair)",
                              fontSize: "3.8rem",
                              fontWeight: 900,
                              color: "#111",
                              paddingTop: "0.06em",
                            }}
                          >
                            {paragraph[0]}
                          </span>
                          {paragraph.slice(1)}
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
              </div>

              {/* Red underline annotation */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span
                  className="text-sm italic px-1 inline-block"
                  style={{
                    fontFamily: "var(--font-baskerville)",
                    color: "#444",
                    borderBottom: "2.5px solid #cc2222",
                  }}
                >
                  Pokračování na straně 3
                </span>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border"
                      style={{
                        fontFamily: "var(--font-oswald)",
                        color: "#666",
                        borderColor: "#aaa",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* ========================================================= */}
        {/*  ARTICLE CLIPPINGS / FRAGMENTS                             */}
        {/* ========================================================= */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-7">
            {restArticles.map((article, i) => {
              const rotation = rotations[i % rotations.length];
              const isYellowed = i % 3 === 1;
              const bgColor = isYellowed ? "#e8d5a3" : "#f5f0e8";
              const edge = tornEdges[i % tornEdges.length];

              return (
                <article
                  key={article.slug}
                  className="relative clipping-card"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    zIndex: 1,
                  }}
                >
                  <div
                    className="relative h-full"
                    style={{
                      background: bgColor,
                      clipPath: edge,
                      boxShadow:
                        "3px 5px 16px rgba(0,0,0,0.45), 1px 2px 6px rgba(0,0,0,0.25)",
                    }}
                  >
                    <Pin className="-top-1 left-4" />
                    {i % 2 === 0 && <Pin className="-top-1 right-4" />}

                    <div className="px-5 pt-8 pb-6">
                      {/* Section label */}
                      <span
                        className="text-[10px] uppercase tracking-[0.2em] block mb-1.5"
                        style={{
                          fontFamily: "var(--font-oswald)",
                          color: isYellowed ? "#8a7030" : "#888",
                          fontWeight: 500,
                        }}
                      >
                        SEKCE: {article.tags[0]}
                      </span>

                      {/* Date */}
                      <span
                        className="text-[10px] italic block mb-3"
                        style={{
                          fontFamily: "var(--font-baskerville)",
                          color: isYellowed ? "#9a8040" : "#999",
                        }}
                      >
                        {formatNewspaperDate(article.date)}
                      </span>

                      <div
                        className="h-px mb-3"
                        style={{ background: isYellowed ? "#c4a868" : "#ccc" }}
                      />

                      {/* Headline */}
                      <h3
                        className="mb-3 leading-snug"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: i === 0 ? "1.2rem" : "1.05rem",
                          fontWeight: 700,
                          color: "#111",
                        }}
                      >
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p
                        className="mb-4"
                        style={{
                          fontFamily: "var(--font-baskerville)",
                          fontSize: "0.8rem",
                          lineHeight: 1.65,
                          color: "#333",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.excerpt}
                      </p>

                      {/* Footer: read time + red accent */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] uppercase tracking-wider"
                          style={{
                            fontFamily: "var(--font-oswald)",
                            color: isYellowed ? "#9a8040" : "#999",
                          }}
                        >
                          {article.readTime} min &bull; {article.sources.length} zdrojů
                        </span>
                        <div
                          className="w-8 h-0.5"
                          style={{ background: "#cc2222", opacity: 0.5 }}
                        />
                      </div>

                      {/* Red circle annotation on 2nd card */}
                      {i === 1 && (
                        <div
                          className="absolute pointer-events-none"
                          style={{
                            bottom: "20px",
                            right: "15px",
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            border: "2px solid #cc2222",
                            opacity: 0.4,
                            transform: "rotate(5deg)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/*  TAGS — SECTION LABELS                                     */}
        {/* ========================================================= */}
        <section className="mb-16">
          <div
            className="relative mx-auto max-w-2xl px-6 sm:px-8 py-6"
            style={{
              background: "#f5f0e8",
              clipPath: tornEdgeB,
              boxShadow: "3px 5px 15px rgba(0,0,0,0.4)",
              transform: "rotate(0.4deg)",
            }}
          >
            <Pin className="-top-1 left-6" />
            <Pin className="-top-1 right-6" />

            <h3
              className="text-xs uppercase tracking-[0.25em] mb-4 text-center font-bold"
              style={{ fontFamily: "var(--font-oswald)", color: "#444" }}
            >
              Rubriky vydání
            </h3>

            <div className="h-px mb-4 mx-auto max-w-xs" style={{ background: "#bbb" }} />

            <div className="flex flex-wrap justify-center gap-3">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] uppercase tracking-[0.12em] px-3 py-1.5 border cursor-pointer transition-all hover:bg-[#111] hover:text-[#f5f0e8] hover:border-[#111]"
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 500,
                    color: "#333",
                    borderColor: "#888",
                  }}
                >
                  SEKCE: {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/*  AI COMMENTS — EDITORIAL SECTION                           */}
        {/* ========================================================= */}
        <section className="relative mb-16">
          <div
            className="relative mx-auto max-w-5xl"
            style={{
              background: "#f5f0e8",
              clipPath: tornEdgeA,
              boxShadow:
                "5px 7px 22px rgba(0,0,0,0.5), 2px 3px 8px rgba(0,0,0,0.3)",
              transform: "rotate(-0.3deg)",
            }}
          >
            <Pin className="-top-1 left-8" />
            <Pin className="-top-1 right-8" />
            <Pin className="-top-1 left-1/2 -translate-x-1/2" />

            <div className="px-6 sm:px-10 lg:px-14 pt-10 pb-10">
              {/* Section header */}
              <div className="text-center mb-8">
                <div className="h-0.5" style={{ background: "#111" }} />
                <div className="h-px mt-0.5 mb-3" style={{ background: "#666" }} />
                <h2
                  className="tracking-[0.25em] uppercase"
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  Komentáře redakce
                </h2>
                <p
                  className="text-xs italic mt-1.5 mb-3"
                  style={{ fontFamily: "var(--font-baskerville)", color: "#888" }}
                >
                  Názory AI modelů nemusí odrážet stanovisko redakce
                </p>
                <div className="h-px mb-0.5" style={{ background: "#666" }} />
                <div className="h-0.5" style={{ background: "#111" }} />
              </div>

              {/* Columnist grid */}
              <div className="grid grid-cols-1 md:grid-cols-3">
                {featured.aiComments.map((comment, i) => (
                  <div
                    key={comment.model}
                    className="px-4 sm:px-6 py-5"
                    style={{
                      borderRight:
                        i < featured.aiComments.length - 1
                          ? "1px solid #ccc"
                          : "none",
                    }}
                  >
                    {/* Columnist header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0"
                        style={{
                          background: "#ddd",
                          border: "2px solid #999",
                          filter: "grayscale(30%)",
                        }}
                      >
                        {comment.avatar}
                      </div>
                      <div>
                        <span
                          className="text-xs uppercase tracking-[0.15em] block font-bold"
                          style={{ fontFamily: "var(--font-oswald)", color: "#111" }}
                        >
                          {comment.model}
                        </span>
                        <span
                          className="text-[10px] italic block"
                          style={{ fontFamily: "var(--font-baskerville)", color: "#999" }}
                        >
                          Stálý komentátor
                        </span>
                      </div>
                    </div>

                    {/* Drop cap on first comment */}
                    <p
                      style={{
                        fontFamily: "var(--font-baskerville)",
                        fontSize: "0.85rem",
                        lineHeight: 1.7,
                        color: "#333",
                      }}
                    >
                      {i === 0 ? (
                        <>
                          <span
                            className="float-left mr-1.5 leading-[0.85]"
                            style={{
                              fontFamily: "var(--font-playfair)",
                              fontSize: "2.2rem",
                              fontWeight: 900,
                              color: "#111",
                              paddingTop: "0.05em",
                            }}
                          >
                            &ldquo;
                          </span>
                          {comment.comment}&rdquo;
                        </>
                      ) : (
                        <>
                          &ldquo;{comment.comment}&rdquo;
                        </>
                      )}
                    </p>

                    {/* Red marker on first comment */}
                    {i === 0 && (
                      <div className="mt-3">
                        <span
                          className="text-[10px] italic px-1 inline-block"
                          style={{
                            fontFamily: "var(--font-baskerville)",
                            color: "#cc2222",
                            borderBottom: "2.5px solid #cc2222",
                          }}
                        >
                          ! Důležité
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/*  FOOTER                                                    */}
        {/* ========================================================= */}
        <footer className="text-center py-12 relative">
          <div className="h-px max-w-sm mx-auto mb-6" style={{ background: "#333" }} />
          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-oswald)", color: "#555" }}
          >
            Tisk: AI Tiskárna s.r.o. &bull; Šéfredaktor: Claude &bull; Vychází denně
          </p>
          <p
            className="text-[10px] mt-2 italic"
            style={{ fontFamily: "var(--font-baskerville)", color: "#444" }}
          >
            &copy; {new Date().getFullYear()} Berou Nám Práci &mdash; Všechna práva vyhrazena
          </p>
          <div className="h-px max-w-sm mx-auto mt-6" style={{ background: "#333" }} />
        </footer>
      </div>

      {/* ========================================================= */}
      {/*  GLOBAL STYLES                                              */}
      {/* ========================================================= */}
      <style>{`
        /* Multi-column featured article */
        .featured-columns {
          column-count: 2;
          column-gap: 2.2rem;
          column-rule: 1px solid #ccc;
        }

        @media (max-width: 640px) {
          .featured-columns {
            column-count: 1;
          }
        }

        /* Clipping card hover — rotate to 0 and lift */
        .clipping-card {
          transition: transform 0.3s ease, z-index 0s;
        }
        .clipping-card:hover {
          transform: rotate(0deg) scale(1.03) !important;
          z-index: 10 !important;
        }
        .clipping-card:hover > div:first-child {
          box-shadow: 6px 10px 28px rgba(0,0,0,0.55), 3px 4px 10px rgba(0,0,0,0.3) !important;
        }

        /* Editorial column border on mobile */
        @media (max-width: 768px) {
          .grid-cols-1 > [style*="borderRight"] {
            border-right: none !important;
            border-bottom: 1px solid #ccc;
          }
        }

        /* Newsprint dot texture */
        @media (min-width: 768px) {
          [style*="background: #f5f0e8"]::after,
          [style*="background: #e8d5a3"]::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(0,0,0,0.025) 1px, transparent 1px);
            background-size: 3px 3px;
            pointer-events: none;
            z-index: 0;
          }
        }

        /* Selection color */
        ::selection {
          background: rgba(204, 34, 34, 0.2);
          color: #111;
        }

        /* Float shape for drop cap */
        .float-left {
          shape-outside: margin-box;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0c0c0c;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
