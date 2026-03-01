import { Archivo_Black, Space_Mono } from "next/font/google";
import Link from "next/link";
import { articles, allTags } from "@/lib/mockData";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
});

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\s/g, "");
}

function padIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

export const metadata = {
  title: "BEROU NAM PRACI — Swiss Brutalist Grid",
  description: "AI news v brutalistickém Swiss designu",
};

export default function SwissBrutalistGrid() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${archivoBlack.variable} ${spaceMono.variable} relative min-h-screen bg-black text-white selection:bg-[#ff0000] selection:text-white`}
    >
      {/* VISIBLE GRID LINES */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="mx-auto h-full max-w-[1440px] px-6">
          <div className="grid h-full grid-cols-12 gap-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-full border-l border-white/[0.04] last:border-r"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6">
        {/* ═══════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════ */}
        <header className="pb-0 pt-6">
          {/* Top row: back + date + language */}
          <div className="flex items-baseline justify-between font-[family-name:var(--font-space)] text-[0.7rem] uppercase tracking-[0.3em]">
            <Link
              href="/"
              className="text-white/50 transition-colors hover:text-[#ff0000]"
            >
              &larr; ZPET
            </Link>
            <div className="flex items-center gap-8">
              <span className="text-white/40">
                {new Date().toLocaleDateString("cs-CZ", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              <span className="text-white/40">
                <span className="text-white">CZ</span>
                {" / "}
                <span className="text-white/30">EN</span>
              </span>
            </div>
          </div>

          {/* Masthead */}
          <h1 className="mt-8 font-[family-name:var(--font-archivo)] text-[clamp(3rem,10vw,10rem)] leading-[0.85] tracking-[-0.03em] text-white">
            BEROU
            <br />
            NAM PRACI
          </h1>

          {/* Red line */}
          <div className="mt-6 h-[6px] w-full bg-[#ff0000]" />

          {/* Navigation */}
          <nav className="mt-5 flex flex-wrap gap-x-10 gap-y-2 font-[family-name:var(--font-space)] text-[0.7rem] uppercase tracking-[0.35em] text-white/50">
            <span className="text-white">CLANKY</span>
            <span className="cursor-pointer transition-colors hover:text-white">
              TAGY
            </span>
            <span className="cursor-pointer transition-colors hover:text-white">
              AI KOMENTARE
            </span>
            <span className="cursor-pointer transition-colors hover:text-white">
              O PROJEKTU
            </span>
          </nav>

          {/* Section divider */}
          <div className="mt-8 h-[4px] bg-white" />
        </header>

        {/* ═══════════════════════════════════════════════
            FEATURED ARTICLE — 01
        ═══════════════════════════════════════════════ */}
        <section className="relative py-16">
          {/* Background number */}
          <div
            className="pointer-events-none absolute -top-4 left-0 font-[family-name:var(--font-archivo)] text-[clamp(10rem,30vw,22rem)] leading-none text-white/[0.04]"
            aria-hidden="true"
          >
            01
          </div>

          <div className="grid grid-cols-12 gap-0">
            {/* Left: metadata column */}
            <div className="col-span-12 md:col-span-3">
              <div className="font-[family-name:var(--font-space)] text-[0.75rem] uppercase tracking-[0.2em]">
                <div className="mb-4 text-white/30">DATUM</div>
                <div className="mb-8 text-white/70">
                  {formatDate(featured.date)}
                </div>

                <div className="mb-4 text-white/30">CTENI</div>
                <div className="mb-8 text-white/70">
                  {featured.readTime} MIN
                </div>

                <div className="mb-4 text-white/30">TAGY</div>
                <div className="mb-8 flex flex-wrap gap-2">
                  {featured.tags.map((tag, i) => (
                    <span key={tag} className="text-white/70">
                      {tag.toUpperCase()}
                      {i < featured.tags.length - 1 && (
                        <span className="ml-2 text-white/20">/</span>
                      )}
                    </span>
                  ))}
                </div>

                <div className="mb-4 text-white/30">ZDROJE</div>
                <div className="space-y-1">
                  {featured.sources.map((s) => (
                    <div key={s.url} className="text-white/70">
                      [{s.type.toUpperCase()}]
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: title + excerpt */}
            <div className="col-span-12 mt-8 md:col-span-9 md:mt-0 md:pl-8">
              {/* Red accent: small label */}
              <div className="mb-6 font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.5em] text-[#ff0000]">
                HLAVNI CLANEK
              </div>

              <h2 className="font-[family-name:var(--font-archivo)] text-[clamp(2.5rem,6vw,7rem)] leading-[0.9] tracking-[-0.02em]">
                {featured.title.toUpperCase()}
              </h2>

              <p className="mt-10 max-w-[55ch] font-[family-name:var(--font-space)] text-[0.85rem] leading-[1.7] text-white/60">
                {featured.excerpt}
              </p>

              {/* Read more */}
              <div className="mt-10 font-[family-name:var(--font-space)] text-[0.75rem] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white">
                CIST DALE &rarr;
              </div>
            </div>
          </div>

          {/* Section divider */}
          <div className="mt-16 h-[6px] bg-white" />
        </section>

        {/* ═══════════════════════════════════════════════
            ARTICLE LIST — TABLE LAYOUT
        ═══════════════════════════════════════════════ */}
        <section className="py-8">
          <div className="mb-8 font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.5em] text-white/30">
            DALSI CLANKY
          </div>

          {/* Table header */}
          <div className="mb-4 hidden grid-cols-12 gap-0 font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.3em] text-white/25 md:grid">
            <div className="col-span-1">NO.</div>
            <div className="col-span-2">DATUM</div>
            <div className="col-span-6">TITULEK</div>
            <div className="col-span-3">TAGY</div>
          </div>
          <div className="mb-6 h-px bg-white/10" />

          {/* Rows */}
          {rest.map((article, i) => (
            <div key={article.slug}>
              <div className="group grid grid-cols-12 gap-0 py-5 transition-colors hover:bg-white/[0.02]">
                {/* Number */}
                <div className="col-span-2 flex items-baseline gap-2 md:col-span-1">
                  <span className="font-[family-name:var(--font-archivo)] text-2xl text-white/20 transition-colors group-hover:text-[#ff0000]/60">
                    {padIndex(i + 1)}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-10 md:col-span-2">
                  <span className="font-[family-name:var(--font-space)] text-[0.75rem] text-white/30">
                    {formatDate(article.date)}
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-12 mt-2 md:col-span-6 md:mt-0">
                  <h3 className="font-[family-name:var(--font-archivo)] text-lg leading-tight tracking-[-0.01em] transition-colors group-hover:text-white/90">
                    {article.title.toUpperCase()}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-space)] text-[0.75rem] leading-relaxed text-white/35 md:hidden">
                    {article.excerpt.slice(0, 100)}...
                  </p>
                </div>

                {/* Tags */}
                <div className="col-span-12 mt-2 md:col-span-3 md:mt-0 md:text-right">
                  <span className="font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.15em] text-white/30">
                    {article.tags.join(" / ")}
                  </span>
                </div>
              </div>
              <div className="h-px bg-white/[0.06]" />
            </div>
          ))}

          <div className="mt-12 h-[4px] bg-white" />
        </section>

        {/* ═══════════════════════════════════════════════
            TAGS
        ═══════════════════════════════════════════════ */}
        <section className="py-12">
          <div className="mb-8 font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.5em] text-white/30">
            TAGY
          </div>

          <div className="flex flex-wrap items-center gap-x-1 font-[family-name:var(--font-space)] text-[0.8rem] uppercase tracking-[0.2em]">
            {allTags.map((tag, i) => (
              <span key={tag} className="flex items-center">
                <span
                  className={`cursor-pointer transition-colors hover:text-[#ff0000] ${
                    i === 0 ? "text-[#ff0000]" : "text-white/40"
                  }`}
                >
                  {tag}
                </span>
                {i < allTags.length - 1 && (
                  <span className="mx-3 text-white/15">/</span>
                )}
              </span>
            ))}
          </div>

          <div className="mt-12 h-[4px] bg-white" />
        </section>

        {/* ═══════════════════════════════════════════════
            AI COMMENTS — THREE COLUMNS
        ═══════════════════════════════════════════════ */}
        <section className="py-12">
          <div className="mb-10 font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.5em] text-white/30">
            AI KOMENTARE
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {featured.aiComments.map((comment, i) => (
              <div
                key={comment.model}
                className={`p-6 ${
                  i < featured.aiComments.length - 1
                    ? "border-b border-white/[0.06] md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                {/* Model name */}
                <div className="mb-6 font-[family-name:var(--font-archivo)] text-xl uppercase tracking-[0.05em]">
                  {comment.model}
                </div>

                {/* Comment with red initial cap */}
                <p className="font-[family-name:var(--font-space)] text-[0.8rem] leading-[1.8] text-white/50">
                  <span className="font-[family-name:var(--font-archivo)] text-2xl leading-none text-[#ff0000]">
                    {comment.comment.charAt(0)}
                  </span>
                  <span>{comment.comment.slice(1)}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-[6px] bg-[#ff0000]" />
        </section>

        {/* ═══════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════ */}
        <footer className="pb-16 pt-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-[family-name:var(--font-archivo)] text-[clamp(2rem,5vw,5rem)] leading-none tracking-[-0.02em]">
                GENEROVANO AI
              </div>
              <div className="mt-4 font-[family-name:var(--font-space)] text-[0.65rem] uppercase tracking-[0.3em] text-white/25">
                V3.0 — SWISS BRUTALIST GRID — 2026
              </div>
            </div>

            {/* Grid intentionally broken: element bleeds right */}
            <div className="hidden font-[family-name:var(--font-archivo)] text-[8rem] leading-none text-white/[0.03] md:block">
              03
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
