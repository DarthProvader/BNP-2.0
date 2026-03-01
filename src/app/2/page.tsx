import { articles, allTags } from "@/lib/mockData";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Berou nam praci — AI News Magazine",
  description:
    "Luxusni AI zpravodajstvi. Precist, pochopit, pripravit se.",
};

/* ------------------------------------------------------------------ */
/*  Source type icon helper                                            */
/* ------------------------------------------------------------------ */
function sourceIcon(type: string) {
  switch (type) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "podcast":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 1a5 5 0 00-5 5v6a5 5 0 0010 0V6a5 5 0 00-5-5z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Format date in Czech locale style                                 */
/* ------------------------------------------------------------------ */
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const months = [
    "ledna", "unora", "brezna", "dubna", "kvetna", "cervna",
    "cervence", "srpna", "zari", "rijna", "listopadu", "prosince",
  ];
  return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ================================================================== */
/*  PAGE COMPONENT                                                     */
/* ================================================================== */
export default function Page() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable} min-h-screen`}
    >
      <style>{`
        :root {
          --cream: #faf8f5;
          --charcoal: #1a1a1a;
          --gold: #b8860b;
          --gold-light: #d4a843;
          --burgundy: #6b1d1d;
          --warm-gray: #8a8178;
          --light-border: #e8e3dc;
        }

        .font-playfair { font-family: var(--font-playfair), Georgia, serif; }
        .font-source-serif { font-family: var(--font-source-serif), Georgia, serif; }
        .font-dm-sans { font-family: var(--font-dm-sans), system-ui, sans-serif; }

        /* Paper texture background */
        body {
          background-color: var(--cream) !important;
          color: var(--charcoal) !important;
        }

        .paper-bg {
          background-color: var(--cream);
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(184,134,11,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(107,29,29,0.02) 0%, transparent 50%);
        }

        /* Drop cap */
        .drop-cap::first-letter {
          font-family: var(--font-playfair), Georgia, serif;
          float: left;
          font-size: 4.5rem;
          line-height: 0.8;
          padding-right: 0.6rem;
          padding-top: 0.25rem;
          color: var(--burgundy);
          font-weight: 700;
        }

        /* Small caps utility */
        .small-caps {
          font-variant: small-caps;
          letter-spacing: 0.12em;
        }

        /* Gold separator */
        .gold-line {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            var(--gold) 20%,
            var(--gold) 80%,
            transparent
          );
        }

        .gold-line-short {
          height: 1px;
          width: 60px;
          background: var(--gold);
        }

        /* Fade-in animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeInUp 0.8s ease-out both;
        }
        .fade-in-delay-1 { animation-delay: 0.1s; }
        .fade-in-delay-2 { animation-delay: 0.2s; }
        .fade-in-delay-3 { animation-delay: 0.3s; }
        .fade-in-delay-4 { animation-delay: 0.4s; }

        /* Elegant card hover */
        .editorial-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid var(--light-border);
        }
        .editorial-card:hover {
          box-shadow: 0 8px 32px rgba(26, 26, 26, 0.08);
          border-color: var(--gold);
          transform: translateY(-2px);
        }

        /* Tag pills */
        .tag-pill {
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }
        .tag-pill:hover {
          color: var(--gold);
          border-bottom-color: var(--gold);
        }

        /* Pull quote */
        .pull-quote {
          position: relative;
          padding-left: 2rem;
          border-left: 2px solid var(--gold);
        }
        .pull-quote::before {
          content: "\\201C";
          font-family: var(--font-playfair), Georgia, serif;
          position: absolute;
          left: -0.1rem;
          top: -1.2rem;
          font-size: 4rem;
          color: var(--gold);
          opacity: 0.3;
          line-height: 1;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--cream); }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

        /* Source link hover */
        .source-link {
          transition: color 0.3s ease;
        }
        .source-link:hover {
          color: var(--gold);
        }

        /* Commentary card */
        .commentary-card {
          transition: all 0.3s ease;
        }
        .commentary-card:hover {
          background-color: rgba(184, 134, 11, 0.04);
        }

        /* Nav link */
        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: var(--gold);
        }
      `}</style>

      <div className="paper-bg min-h-screen">
        {/* ============================================================ */}
        {/*  BACK LINK                                                    */}
        {/* ============================================================ */}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <Link
            href="/"
            className="font-dm-sans text-sm inline-flex items-center gap-2 hover:text-[var(--gold)] transition-colors duration-300"
            style={{ color: "var(--warm-gray)" }}
          >
            <span className="text-lg leading-none">&larr;</span>
            <span>Zpet na vyber</span>
          </Link>
        </div>

        {/* ============================================================ */}
        {/*  HEADER / NAVIGATION                                          */}
        {/* ============================================================ */}
        <header className="fade-in max-w-6xl mx-auto px-6 pt-8 pb-2">
          {/* Blog title */}
          <div className="text-center mb-6">
            <h1
              className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              style={{ color: "var(--charcoal)" }}
            >
              Berou nam praci
            </h1>
            <p
              className="font-source-serif text-base md:text-lg mt-3 italic"
              style={{ color: "var(--warm-gray)" }}
            >
              Umela inteligence meni svet. My o tom piseme s peci.
            </p>
          </div>

          {/* Gold separator */}
          <div className="gold-line mx-auto mb-5" />

          {/* Navigation */}
          <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-8">
              {["Clanky", "Resources", "O projektu"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="nav-link font-dm-sans text-xs small-caps tracking-widest"
                  style={{ color: "var(--charcoal)" }}
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-1 font-dm-sans text-xs">
              <span
                className="px-2.5 py-1 rounded-sm font-semibold cursor-pointer transition-colors duration-300"
                style={{
                  backgroundColor: "var(--charcoal)",
                  color: "var(--cream)",
                }}
              >
                CZ
              </span>
              <span
                className="px-2.5 py-1 rounded-sm cursor-pointer transition-colors duration-300 hover:text-[var(--gold)]"
                style={{ color: "var(--warm-gray)" }}
              >
                EN
              </span>
            </div>
          </nav>

          <div className="gold-line mx-auto mt-1" />
        </header>

        {/* ============================================================ */}
        {/*  HERO / FEATURED ARTICLE                                      */}
        {/* ============================================================ */}
        <section className="fade-in fade-in-delay-1 max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main feature */}
            <div className="lg:col-span-8">
              {/* Category tags */}
              <div className="flex items-center gap-3 mb-5">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold uppercase"
                    style={{ color: "var(--gold)" }}
                  >
                    {tag}
                  </span>
                ))}
                <div className="gold-line-short ml-2" />
              </div>

              {/* Headline */}
              <h2
                className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
                style={{ color: "var(--charcoal)", lineHeight: "1.15" }}
              >
                {featured.title}
              </h2>

              {/* Byline */}
              <div
                className="flex items-center gap-3 mb-8 font-dm-sans text-sm"
                style={{ color: "var(--warm-gray)" }}
              >
                <span className="small-caps tracking-wider font-medium">
                  AI Editorial Staff
                </span>
                <span style={{ color: "var(--gold)" }}>|</span>
                <span>{formatDate(featured.date)}</span>
                <span style={{ color: "var(--gold)" }}>|</span>
                <span>{featured.readTime} min cteni</span>
              </div>

              {/* Excerpt with drop cap */}
              <p
                className="drop-cap font-source-serif text-lg md:text-xl leading-relaxed"
                style={{ color: "var(--charcoal)", lineHeight: "1.8" }}
              >
                {featured.excerpt}
              </p>

              {/* Sources */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--light-border)" }}>
                <span
                  className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold block mb-3"
                  style={{ color: "var(--warm-gray)" }}
                >
                  Zdroje
                </span>
                <div className="flex flex-wrap gap-4">
                  {featured.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link flex items-center gap-2 font-dm-sans text-xs"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {sourceIcon(source.type)}
                      <span>{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar: edition info */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              <div
                className="p-6 rounded-sm"
                style={{
                  border: "1px solid var(--light-border)",
                  backgroundColor: "rgba(184, 134, 11, 0.03)",
                }}
              >
                <span
                  className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold block mb-4"
                  style={{ color: "var(--gold)" }}
                >
                  Aktualni vydani
                </span>
                <p
                  className="font-playfair text-2xl font-bold mb-2"
                  style={{ color: "var(--charcoal)" }}
                >
                  Unor 2026
                </p>
                <p
                  className="font-source-serif text-sm italic leading-relaxed"
                  style={{ color: "var(--warm-gray)" }}
                >
                  Pet clanku o budoucnosti, ktera uz zacala. Claude 4, Sora 2, regulace EU a dalsi.
                </p>
                <div className="gold-line-short mt-5" />
              </div>

              {/* Quick stats */}
              <div
                className="p-6 rounded-sm"
                style={{ border: "1px solid var(--light-border)" }}
              >
                <span
                  className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold block mb-4"
                  style={{ color: "var(--gold)" }}
                >
                  V cislech
                </span>
                <div className="space-y-3">
                  {[
                    { label: "Clanku", value: articles.length.toString() },
                    { label: "Temat", value: allTags.length.toString() },
                    { label: "AI modelu", value: "3" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between items-baseline">
                      <span
                        className="font-dm-sans text-xs"
                        style={{ color: "var(--warm-gray)" }}
                      >
                        {stat.label}
                      </span>
                      <span
                        className="font-playfair text-2xl font-bold"
                        style={{ color: "var(--charcoal)" }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  TAG FILTER                                                   */}
        {/* ============================================================ */}
        <section className="fade-in fade-in-delay-2 max-w-6xl mx-auto px-6 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="gold-line-short" />
            <span
              className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold"
              style={{ color: "var(--gold)" }}
            >
              Temata
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="tag-pill font-dm-sans text-xs px-4 py-2 cursor-pointer"
                style={{ color: "var(--charcoal)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <div className="gold-line max-w-6xl mx-auto" />

        {/* ============================================================ */}
        {/*  ARTICLE GRID                                                 */}
        {/* ============================================================ */}
        <section className="fade-in fade-in-delay-3 max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-10">
            <span
              className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold"
              style={{ color: "var(--gold)" }}
            >
              Dalsi clanky
            </span>
            <div className="gold-line flex-1" />
          </div>

          {/* Editorial grid: first two large, rest smaller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {rest.slice(0, 2).map((article, i) => (
              <article
                key={article.slug}
                className={`editorial-card rounded-sm p-8 fade-in fade-in-delay-${i + 1}`}
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                {/* Tags */}
                <div className="flex items-center gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-dm-sans text-[9px] small-caps tracking-widest font-semibold uppercase"
                      style={{ color: "var(--gold)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Headline */}
                <h3
                  className="font-playfair text-xl md:text-2xl font-bold leading-snug mb-4"
                  style={{ color: "var(--charcoal)" }}
                >
                  {article.title}
                </h3>

                {/* Date + read time */}
                <div
                  className="font-dm-sans text-xs mb-4 flex items-center gap-2"
                  style={{ color: "var(--warm-gray)" }}
                >
                  <span>{formatDate(article.date)}</span>
                  <span style={{ color: "var(--gold)" }}>|</span>
                  <span>{article.readTime} min</span>
                </div>

                {/* Excerpt */}
                <p
                  className="font-source-serif text-sm leading-relaxed mb-6"
                  style={{ color: "var(--charcoal)", opacity: 0.85, lineHeight: "1.75" }}
                >
                  {article.excerpt}
                </p>

                {/* Sources */}
                <div className="flex items-center gap-3" style={{ color: "var(--warm-gray)" }}>
                  {article.sources.map((source, j) => (
                    <a
                      key={j}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                      title={source.title}
                    >
                      {sourceIcon(source.type)}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Smaller cards row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {rest.slice(2).map((article, i) => (
              <article
                key={article.slug}
                className={`editorial-card rounded-sm p-6 fade-in fade-in-delay-${i + 2}`}
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex gap-5">
                  {/* Left: number marker */}
                  <div className="flex-shrink-0">
                    <span
                      className="font-playfair text-4xl font-bold"
                      style={{ color: "var(--light-border)" }}
                    >
                      {String(i + 3).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="font-dm-sans text-[9px] small-caps tracking-widest font-semibold uppercase"
                          style={{ color: "var(--gold)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3
                      className="font-playfair text-lg font-bold leading-snug mb-2"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {article.title}
                    </h3>

                    <div
                      className="font-dm-sans text-xs mb-3 flex items-center gap-2"
                      style={{ color: "var(--warm-gray)" }}
                    >
                      <span>{formatDate(article.date)}</span>
                      <span style={{ color: "var(--gold)" }}>|</span>
                      <span>{article.readTime} min</span>
                    </div>

                    <p
                      className="font-source-serif text-sm leading-relaxed"
                      style={{
                        color: "var(--charcoal)",
                        opacity: 0.8,
                        lineHeight: "1.7",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.excerpt}
                    </p>

                    {/* Sources */}
                    <div className="flex items-center gap-3 mt-3" style={{ color: "var(--warm-gray)" }}>
                      {article.sources.map((source, j) => (
                        <a
                          key={j}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="source-link"
                          title={source.title}
                        >
                          {sourceIcon(source.type)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="gold-line max-w-6xl mx-auto" />

        {/* ============================================================ */}
        {/*  AI COMMENTARY SECTION                                        */}
        {/* ============================================================ */}
        <section className="fade-in fade-in-delay-4 max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="text-center mb-10">
            <span
              className="font-dm-sans text-[10px] small-caps tracking-widest font-semibold block mb-3"
              style={{ color: "var(--gold)" }}
            >
              Komentare AI modelu
            </span>
            <h2
              className="font-playfair text-2xl md:text-3xl font-bold mb-3"
              style={{ color: "var(--charcoal)" }}
            >
              Co na to rikaji samy?
            </h2>
            <p
              className="font-source-serif text-sm italic max-w-lg mx-auto"
              style={{ color: "var(--warm-gray)" }}
            >
              Tri prední AI modely komentovaly nas hlavni clanek.
              Jejich nazory jsou nefiltrovane a nekorigovane.
            </p>
            <div className="gold-line-short mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.aiComments.map((comment, i) => (
              <div
                key={comment.model}
                className={`commentary-card rounded-sm p-8 fade-in fade-in-delay-${i + 1}`}
                style={{
                  border: "1px solid var(--light-border)",
                  backgroundColor: "rgba(255,255,255,0.4)",
                }}
              >
                {/* Avatar + model name */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{comment.avatar}</span>
                  <div>
                    <span
                      className="font-dm-sans text-sm font-semibold block"
                      style={{ color: "var(--charcoal)" }}
                    >
                      {comment.model}
                    </span>
                    <span
                      className="font-dm-sans text-[10px] small-caps tracking-wider"
                      style={{ color: "var(--warm-gray)" }}
                    >
                      AI komentator
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <div className="pull-quote">
                  <p
                    className="font-source-serif text-sm italic leading-relaxed"
                    style={{ color: "var(--charcoal)", lineHeight: "1.8" }}
                  >
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="gold-line max-w-6xl mx-auto" />

        {/* ============================================================ */}
        {/*  FOOTER                                                       */}
        {/* ============================================================ */}
        <footer className="max-w-6xl mx-auto px-6 py-12 text-center">
          <p
            className="font-source-serif text-sm italic mb-2"
            style={{ color: "var(--warm-gray)" }}
          >
            Vytvoreno s peci umele inteligence
          </p>
          <p
            className="font-dm-sans text-xs"
            style={{ color: "var(--light-border)" }}
          >
            Berou nam praci &middot; 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
