import { articles, allTags } from "@/lib/mockData";
import { Courier_Prime, Staatliches } from "next/font/google";
import Link from "next/link";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
});

const staatliches = Staatliches({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-staatliches",
});

export const metadata = {
  title: "BEROU NAM PRACI — DIVISION OF AI INTELLIGENCE",
  description:
    "CLASSIFIED. Division of AI Intelligence briefing. Distribution limited.",
};

function getFileNumber(index: number) {
  return `BNP-2026-${String(index + 1).padStart(3, "0")}`;
}

function getClassification(index: number) {
  const levels = [
    "TOP SECRET",
    "SECRET",
    "CONFIDENTIAL",
    "SECRET",
    "CONFIDENTIAL",
  ];
  return levels[index % levels.length];
}

function getStamp(index: number) {
  const stamps = ["APPROVED", "PENDING REVIEW", "APPROVED", "UNDER REVIEW", "APPROVED"];
  return stamps[index % stamps.length];
}

function getStampColor(stamp: string) {
  if (stamp === "APPROVED") return "#2d5016";
  return "#cc0000";
}

function getAnalystCodename(model: string) {
  const codenames: Record<string, string> = {
    "GPT-4o": "AGENT EMERALD",
    Gemini: "AGENT SAPPHIRE",
    Llama: "AGENT VIOLET",
  };
  return codenames[model] || "AGENT UNKNOWN";
}

function formatDateStamp(dateStr: string) {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

export default function Page() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${courierPrime.variable} ${staatliches.variable} min-h-screen relative`}
    >
      <style>{`
        :root {
          --charcoal: #1a1a1a;
          --manila: #d4c5a9;
          --manila-dark: #b8a88a;
          --redaction: #0a0a0a;
          --stamp-red: #cc0000;
          --stamp-green: #2d5016;
          --paper: #e8dcc8;
          --paper-dark: #d4c5a9;
          --paper-lines: #c4b494;
          --ink: #1a1a1a;
          --ink-faded: #3a3a3a;
          --desk: #111111;
        }

        .classified-page {
          background-color: var(--desk);
          color: #c0c0c0;
          font-family: var(--font-courier), 'Courier New', monospace;
        }

        /* Desk texture */
        .classified-page::before {
          content: '';
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .classified-page > * {
          position: relative;
          z-index: 1;
        }

        /* Paper texture with lined background */
        .paper-bg {
          background-color: var(--paper);
          background-image:
            repeating-linear-gradient(
              transparent,
              transparent 27px,
              var(--paper-lines) 27px,
              var(--paper-lines) 28px
            );
          color: var(--ink);
          position: relative;
        }

        /* Manila folder tab */
        .manila-tab {
          background-color: var(--manila);
          color: var(--ink);
          position: relative;
        }
        .manila-tab::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 0;
          width: 8px;
          height: 100%;
          background: var(--manila);
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
        .manila-tab::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 0;
          width: 8px;
          height: 100%;
          background: var(--manila);
          clip-path: polygon(0 0, 100% 100%, 0 100%);
        }

        /* Classified stamp */
        .stamp-classified {
          font-family: var(--font-staatliches), sans-serif;
          color: var(--stamp-red);
          border: 3px double var(--stamp-red);
          padding: 4px 16px;
          transform: rotate(-6deg);
          display: inline-block;
          font-size: 1.5rem;
          letter-spacing: 4px;
          opacity: 0.85;
          text-transform: uppercase;
          line-height: 1.2;
          position: absolute;
          top: 16px;
          right: 24px;
          z-index: 10;
          text-shadow: 1px 1px 0 rgba(204, 0, 0, 0.3);
        }

        .stamp-top-secret {
          font-family: var(--font-staatliches), sans-serif;
          color: var(--stamp-red);
          border: 3px double var(--stamp-red);
          padding: 2px 12px;
          transform: rotate(3deg);
          display: inline-block;
          font-size: 1rem;
          letter-spacing: 3px;
          opacity: 0.8;
          text-transform: uppercase;
        }

        /* Approval stamp */
        .stamp-approval {
          font-family: var(--font-staatliches), sans-serif;
          border: 2px solid;
          padding: 2px 10px;
          transform: rotate(-3deg);
          display: inline-block;
          font-size: 0.75rem;
          letter-spacing: 2px;
          opacity: 0.75;
        }

        /* Redaction bars */
        .redacted {
          background-color: var(--redaction);
          color: var(--redaction);
          padding: 0 4px;
          margin: 0 2px;
          border-radius: 1px;
          user-select: none;
          display: inline;
          position: relative;
        }
        .redacted::selection {
          background: var(--redaction);
          color: var(--redaction);
        }

        /* Coffee stain */
        .coffee-stain {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center,
            transparent 40%,
            rgba(139, 90, 43, 0.08) 42%,
            rgba(139, 90, 43, 0.12) 50%,
            rgba(139, 90, 43, 0.06) 58%,
            transparent 60%
          );
          pointer-events: none;
          z-index: 5;
        }

        /* Staple mark */
        .staple::before {
          content: '';
          position: absolute;
          top: 12px;
          left: 16px;
          width: 4px;
          height: 16px;
          background: linear-gradient(to bottom, #888, #666, #888);
          border-radius: 1px;
          transform: rotate(-5deg);
          box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        /* EYES ONLY watermark */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-35deg);
          font-family: var(--font-staatliches), sans-serif;
          font-size: 5rem;
          color: rgba(204, 0, 0, 0.04);
          letter-spacing: 16px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 2;
          user-select: none;
        }

        /* Paper edge burn */
        .paper-burn-bottom {
          background: linear-gradient(to bottom,
            transparent 85%,
            rgba(139, 100, 50, 0.15) 92%,
            rgba(80, 50, 20, 0.25) 100%
          );
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 3;
        }

        /* Typewriter uneven spacing */
        .typewriter-text {
          letter-spacing: 0.04em;
          word-spacing: 0.12em;
          line-height: 1.85;
          font-family: var(--font-courier), 'Courier New', monospace;
        }

        .typewriter-text p {
          text-indent: 2em;
          margin-bottom: 0.75em;
        }

        /* Document header line */
        .doc-header-line {
          border-bottom: 2px solid var(--ink);
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        /* Navigation tabs as document tabs */
        .doc-tab {
          background: var(--manila);
          color: var(--ink);
          border: 1px solid var(--manila-dark);
          border-bottom: none;
          padding: 6px 16px;
          font-family: var(--font-courier), monospace;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          top: 1px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .doc-tab:hover {
          background: var(--paper);
        }

        /* Dossier card hover */
        .dossier-card {
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .dossier-card:hover {
          transform: translateY(-2px) rotate(-0.3deg);
          box-shadow: 4px 6px 20px rgba(0,0,0,0.5);
        }

        /* Department tags */
        .dept-tag {
          font-family: var(--font-courier), monospace;
          font-size: 0.65rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: 1px solid var(--ink-faded);
          padding: 2px 8px;
          background: rgba(26, 26, 26, 0.06);
          display: inline-block;
        }

        /* Analyst report */
        .analyst-report {
          background-color: var(--paper);
          background-image:
            repeating-linear-gradient(
              transparent,
              transparent 23px,
              var(--paper-lines) 23px,
              var(--paper-lines) 24px
            );
          color: var(--ink);
          position: relative;
        }

        /* Flickering effect for header */
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
          98% { opacity: 0.6; }
          99% { opacity: 1; }
        }

        .flicker {
          animation: flicker 8s infinite;
        }
      `}</style>

      <div className="classified-page min-h-screen">
        {/* ===== HEADER ===== */}
        <header className="relative border-b border-neutral-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            {/* Manila strip with title */}
            <div className="bg-[#d4c5a9] px-6 py-4 relative inline-block">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#b8a88a]" />
              <h1
                className="text-[#1a1a1a] text-3xl sm:text-4xl tracking-[0.15em] leading-none"
                style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
              >
                BEROU NAM PRACI
              </h1>
              <div
                className="text-[#3a3a3a] text-[0.65rem] tracking-[0.25em] mt-1 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                DIVISION OF AI INTELLIGENCE &bull; EST. 2026
              </div>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b8a88a]" />
            </div>

            {/* File reference */}
            <div
              className="text-neutral-600 text-[0.6rem] tracking-[0.3em] mt-3 uppercase"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              REF: DIVISION-AI-INT/DAILY-BRIEF/{new Date().getFullYear()}
              &nbsp;&nbsp;|&nbsp;&nbsp; CLEARANCE LEVEL: PUBLIC
            </div>

            {/* Navigation tabs + language codes */}
            <div className="flex items-end gap-0 mt-6 border-b border-[#b8a88a]">
              <div className="doc-tab font-bold" style={{ background: "#e8dcc8" }}>
                DAILY BRIEF
              </div>
              <div className="doc-tab">ARCHIVES</div>
              <div className="doc-tab">SOURCES</div>
              <div className="doc-tab">ANALYSTS</div>
              <div className="flex-1" />
              <div className="flex gap-1 pb-1">
                <span
                  className="text-[0.6rem] tracking-[0.15em] text-neutral-500 border border-neutral-700 px-2 py-1 cursor-pointer hover:text-neutral-300 hover:border-neutral-500 transition-colors"
                  style={{ fontFamily: "var(--font-courier), monospace" }}
                >
                  CZ-01
                </span>
                <span
                  className="text-[0.6rem] tracking-[0.15em] text-neutral-600 border border-neutral-800 px-2 py-1 cursor-pointer hover:text-neutral-300 hover:border-neutral-500 transition-colors"
                  style={{ fontFamily: "var(--font-courier), monospace" }}
                >
                  EN-02
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ===== FEATURED ARTICLE (Full Document) ===== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="paper-bg p-6 sm:p-10 relative shadow-2xl staple overflow-hidden">
            {/* Watermark */}
            <div className="watermark">EYES ONLY</div>

            {/* Coffee stain */}
            <div
              className="coffee-stain"
              style={{ top: "-20px", right: "60px" }}
            />

            {/* Paper burn effect */}
            <div className="paper-burn-bottom" />

            {/* Classified stamp */}
            <div className="stamp-classified">CLASSIFIED</div>

            {/* Document header */}
            <div className="doc-header-line">
              <div
                className="text-[0.65rem] tracking-[0.3em] text-[#3a3a3a] uppercase mb-1"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                FILE NO. {getFileNumber(0)}
              </div>
              <Link
                href="/4/claude-4-opus-revolution"
                className="text-[1.6rem] sm:text-[2rem] leading-tight text-[#1a1a1a] tracking-[0.04em] hover:text-[#3a3a3a] transition-colors block"
                style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
              >
                {featured.title.toUpperCase()}
              </Link>
            </div>

            {/* File metadata table */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-6 mt-4 mb-6 text-[0.7rem] tracking-wider"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              <div>
                <span className="text-[#666] block">DATE:</span>
                <span className="text-[#1a1a1a] font-bold">
                  {formatDateStamp(featured.date)}
                </span>
              </div>
              <div>
                <span className="text-[#666] block">SUBJECT:</span>
                <span className="text-[#1a1a1a] font-bold">
                  AI DEVELOPMENT
                </span>
              </div>
              <div>
                <span className="text-[#666] block">CLASSIFICATION:</span>
                <span className="text-[#cc0000] font-bold">TOP SECRET</span>
              </div>
              <div>
                <span className="text-[#666] block">SOURCES:</span>
                <span className="text-[#1a1a1a] font-bold">
                  {featured.sources.length} VERIFIED
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#1a1a1a] mb-6" />

            {/* Document body */}
            <div className="typewriter-text text-sm text-[#1a1a1a] relative z-[4]">
              {featured.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Sources */}
            <div className="mt-8 pt-4 border-t border-[#1a1a1a] relative z-[4]">
              <div
                className="text-[0.6rem] tracking-[0.3em] text-[#666] uppercase mb-2"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                REFERENCED MATERIALS:
              </div>
              <ul className="space-y-1">
                {featured.sources.map((source, i) => (
                  <li
                    key={i}
                    className="text-[0.7rem] text-[#3a3a3a] tracking-wider"
                    style={{ fontFamily: "var(--font-courier), monospace" }}
                  >
                    [{i + 1}] {source.title}
                    <span className="text-[#888] ml-2">
                      ({source.type.toUpperCase()})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Read time and stamp */}
            <div className="flex items-center justify-between mt-6 relative z-[4]">
              <span
                className="text-[0.6rem] tracking-[0.2em] text-[#666] uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                EST. READ TIME: {featured.readTime} MIN
              </span>
              <div className="stamp-top-secret">TOP SECRET</div>
            </div>

            {/* Staple mark */}
            <div
              className="absolute top-3 left-4 w-[3px] h-[14px] rounded-sm"
              style={{
                background: "linear-gradient(to bottom, #999, #666, #999)",
                transform: "rotate(-5deg)",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </section>

        {/* ===== DEPARTMENT LABELS (Tags) ===== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
          <div
            className="text-[0.6rem] tracking-[0.3em] text-neutral-500 uppercase mb-3"
            style={{ fontFamily: "var(--font-courier), monospace" }}
          >
            DEPARTMENT INDEX:
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="dept-tag text-neutral-400 border-neutral-600 hover:text-neutral-200 hover:border-neutral-400 cursor-pointer transition-colors"
              >
                DEPT: {tag.toUpperCase()}
              </span>
            ))}
          </div>
        </section>

        {/* ===== ARTICLE DOSSIERS ===== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div
            className="text-[0.6rem] tracking-[0.3em] text-neutral-500 uppercase mb-6 border-b border-neutral-800 pb-2"
            style={{ fontFamily: "var(--font-courier), monospace" }}
          >
            ACTIVE DOSSIERS &mdash; {rest.length} FILES
          </div>

          <div className="space-y-6">
            {rest.map((article, index) => {
              const fileNum = getFileNumber(index + 1);
              const classification = getClassification(index + 1);
              const stamp = getStamp(index + 1);
              const stampColor = getStampColor(stamp);
              const isEven = index % 2 === 0;

              return (
                <article
                  key={article.slug}
                  className="dossier-card relative cursor-pointer"
                  style={{ transform: `rotate(${isEven ? -0.3 : 0.2}deg)` }}
                >
                  {/* Manila folder tab */}
                  <div className="flex">
                    <div
                      className="manila-tab px-4 py-1 text-[0.65rem] tracking-[0.15em] font-bold"
                      style={{
                        fontFamily: "var(--font-courier), monospace",
                        marginLeft: `${20 + index * 60}px`,
                      }}
                    >
                      {fileNum}
                    </div>
                  </div>

                  {/* Document body */}
                  <div className="paper-bg p-5 sm:p-6 shadow-lg relative overflow-hidden">
                    {/* Watermark for some */}
                    {index === 0 && (
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] text-[3rem] text-[rgba(204,0,0,0.04)] tracking-[12px] whitespace-nowrap pointer-events-none select-none z-[2]"
                        style={{
                          fontFamily: "var(--font-staatliches), sans-serif",
                        }}
                      >
                        EYES ONLY
                      </div>
                    )}

                    {/* Paper burn */}
                    <div className="paper-burn-bottom" />

                    {/* Staple */}
                    <div
                      className="absolute top-3 left-4 w-[3px] h-[12px] rounded-sm"
                      style={{
                        background:
                          "linear-gradient(to bottom, #999, #666, #999)",
                        transform: "rotate(-5deg)",
                        boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                      }}
                    />

                    {/* Top row: date + classification */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div
                          className="text-[0.6rem] tracking-[0.25em] text-[#666] uppercase"
                          style={{
                            fontFamily: "var(--font-courier), monospace",
                          }}
                        >
                          {formatDateStamp(article.date)} &nbsp;|&nbsp; FILE
                          NO. {fileNum}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Classification */}
                        <span
                          className="text-[0.55rem] tracking-[0.2em] text-[#cc0000] border border-[#cc0000] px-2 py-0.5 uppercase"
                          style={{
                            fontFamily: "var(--font-staatliches), sans-serif",
                          }}
                        >
                          {classification}
                        </span>

                        {/* Approval stamp */}
                        <span
                          className="stamp-approval"
                          style={{
                            color: stampColor,
                            borderColor: stampColor,
                            fontFamily: "var(--font-staatliches), sans-serif",
                          }}
                        >
                          {stamp}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-[1.1rem] sm:text-[1.3rem] text-[#1a1a1a] leading-tight mb-3 tracking-[0.02em]"
                      style={{
                        fontFamily: "var(--font-staatliches), sans-serif",
                      }}
                    >
                      {article.title.toUpperCase()}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="text-[0.8rem] text-[#3a3a3a] leading-relaxed tracking-wide mb-4 relative z-[4]"
                      style={{
                        fontFamily: "var(--font-courier), monospace",
                      }}
                    >
                      {article.excerpt}
                    </p>

                    {/* Tags as departments */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="dept-tag text-[#3a3a3a] border-[#999]"
                        >
                          DEPT: {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    {/* Bottom metadata */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#b8a88a]">
                      <span
                        className="text-[0.6rem] tracking-[0.15em] text-[#666] uppercase"
                        style={{
                          fontFamily: "var(--font-courier), monospace",
                        }}
                      >
                        {article.readTime} MIN READ &nbsp;|&nbsp;{" "}
                        {article.sources.length} SOURCES
                      </span>
                      <span
                        className="text-[0.6rem] tracking-[0.15em] text-[#888] uppercase"
                        style={{
                          fontFamily: "var(--font-courier), monospace",
                        }}
                      >
                        OPEN DOSSIER &rarr;
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===== ANALYST REPORTS (AI Comments) ===== */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="border-t border-neutral-800 pt-8">
            <div
              className="text-[0.6rem] tracking-[0.3em] text-neutral-500 uppercase mb-2"
              style={{ fontFamily: "var(--font-courier), monospace" }}
            >
              SECTION IV — ANALYST REPORTS
            </div>
            <h2
              className="text-[1.5rem] text-neutral-300 tracking-[0.1em] mb-8"
              style={{ fontFamily: "var(--font-staatliches), sans-serif" }}
            >
              INTELLIGENCE ANALYST ASSESSMENTS
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.aiComments.map((comment, i) => (
                <div
                  key={i}
                  className="analyst-report p-5 shadow-lg relative overflow-hidden"
                  style={{
                    transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0.3 : -0.2}deg)`,
                  }}
                >
                  {/* Paper burn */}
                  <div className="paper-burn-bottom" />

                  {/* Staple */}
                  <div
                    className="absolute top-3 left-4 w-[3px] h-[12px] rounded-sm"
                    style={{
                      background:
                        "linear-gradient(to bottom, #888, #555, #888)",
                      transform: "rotate(-5deg)",
                      boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Header */}
                  <div className="doc-header-line mb-3">
                    <div
                      className="text-[0.55rem] tracking-[0.25em] text-[#666] uppercase"
                      style={{
                        fontFamily: "var(--font-courier), monospace",
                      }}
                    >
                      ANALYST REPORT — REF: AR-{String(i + 1).padStart(3, "0")}
                    </div>
                  </div>

                  {/* Analyst identity */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{comment.avatar}</span>
                    <div>
                      <div
                        className="text-[0.7rem] font-bold text-[#1a1a1a] tracking-[0.15em] uppercase"
                        style={{
                          fontFamily: "var(--font-staatliches), sans-serif",
                        }}
                      >
                        {getAnalystCodename(comment.model)}
                      </div>
                      <div
                        className="text-[0.55rem] text-[#666] tracking-[0.1em]"
                        style={{
                          fontFamily: "var(--font-courier), monospace",
                        }}
                      >
                        ({comment.model})
                      </div>
                    </div>
                  </div>

                  {/* Report text */}
                  <p
                    className="text-[0.75rem] text-[#3a3a3a] leading-relaxed tracking-wide relative z-[4]"
                    style={{
                      fontFamily: "var(--font-courier), monospace",
                    }}
                  >
                    &ldquo;{comment.comment}&rdquo;
                  </p>

                  {/* Footer */}
                  <div
                    className="mt-4 pt-2 border-t border-[#b8a88a] text-[0.5rem] tracking-[0.2em] text-[#888] uppercase relative z-[4]"
                    style={{
                      fontFamily: "var(--font-courier), monospace",
                    }}
                  >
                    ASSESSMENT FILED:{" "}
                    {formatDateStamp(featured.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-neutral-800 mt-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-[1px] bg-neutral-700 mx-auto" />
              <p
                className="text-[0.6rem] tracking-[0.3em] text-neutral-600 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                END OF FILE
              </p>
              <p
                className="text-[0.55rem] tracking-[0.25em] text-neutral-700 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                DOCUMENT CLASSIFICATION: PUBLIC &bull; DISTRIBUTION: UNLIMITED
              </p>
              <p
                className="text-[0.5rem] tracking-[0.2em] text-neutral-700 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                DIVISION OF AI INTELLIGENCE &bull; BEROU NAM PRACI &bull; EST.
                2026
              </p>
              <p
                className="text-[0.5rem] tracking-[0.15em] text-neutral-800 uppercase"
                style={{ fontFamily: "var(--font-courier), monospace" }}
              >
                UNAUTHORIZED REPRODUCTION IS SUBJECT TO PENALTIES
              </p>
              <div className="w-16 h-[1px] bg-neutral-700 mx-auto" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
