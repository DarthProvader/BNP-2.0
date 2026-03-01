import { articles, allTags } from "@/lib/mockData";
import { VT323, Share_Tech_Mono } from "next/font/google";
import Link from "next/link";

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-vt323",
  weight: "400",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-share-tech",
  weight: "400",
});

export const metadata = {
  title: "BEROU_NAM_PRACI // Terminal v2.0.0",
  description: "AI news feed — retro terminal interface. Initializing...",
};

function formatTerminalDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

function severityFromTags(tags: string[]): string {
  if (tags.includes("release") || tags.includes("hardware")) return "CRIT";
  if (tags.includes("regulace") || tags.includes("policy")) return "WARN";
  if (tags.includes("agents") || tags.includes("coding")) return "INFO";
  return "LOG ";
}

function severityColor(sev: string): string {
  if (sev === "CRIT") return "text-[#ff4444]";
  if (sev === "WARN") return "text-[#ffb000]";
  return "text-[#00ff41]";
}

function sourceIcon(type: string): string {
  switch (type) {
    case "youtube":
      return "[YT]";
    case "twitter":
      return "[TW]";
    case "podcast":
      return "[POD]";
    default:
      return "[WEB]";
  }
}

export default function TerminalPage() {
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${vt323.variable} ${shareTechMono.variable} relative min-h-screen bg-black overflow-hidden`}
    >
      {/* Global styles for CRT effects */}
      <style>{`
        /* CRT Scanlines overlay */
        .crt-scanlines::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
          pointer-events: none;
          z-index: 100;
        }

        /* CRT screen glow */
        .crt-scanlines::after {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0, 0, 0, 0.6) 100%
          );
          pointer-events: none;
          z-index: 99;
        }

        /* Screen curvature */
        .crt-screen {
          border-radius: 18px;
          box-shadow:
            inset 0 0 120px rgba(0, 255, 65, 0.05),
            0 0 60px rgba(0, 255, 65, 0.08),
            0 0 120px rgba(0, 255, 65, 0.03);
        }

        /* CRT flicker */
        @keyframes crt-flicker {
          0% { opacity: 0.97; }
          5% { opacity: 1; }
          10% { opacity: 0.98; }
          15% { opacity: 1; }
          50% { opacity: 0.99; }
          80% { opacity: 1; }
          95% { opacity: 0.97; }
          100% { opacity: 1; }
        }

        .crt-flicker {
          animation: crt-flicker 4s infinite;
        }

        /* Cursor blink */
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        .cursor-blink {
          animation: cursor-blink 1s step-end infinite;
        }

        /* Text typing effect */
        @keyframes type-in {
          from { width: 0; }
          to { width: 100%; }
        }

        .type-effect {
          overflow: hidden;
          white-space: nowrap;
          animation: type-in 1.5s steps(40) forwards;
        }

        /* Glitch on hover */
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 2px); }
          100% { transform: translate(0); }
        }

        .glitch-hover:hover {
          animation: glitch 0.3s ease;
          text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
        }

        /* Glow text */
        .glow-text {
          text-shadow: 0 0 8px rgba(0, 255, 65, 0.6), 0 0 16px rgba(0, 255, 65, 0.3);
        }

        .glow-amber {
          text-shadow: 0 0 8px rgba(255, 176, 0, 0.6), 0 0 16px rgba(255, 176, 0, 0.3);
        }

        /* Link styles */
        .term-link {
          color: #00ff41;
          text-decoration: none;
          transition: text-shadow 0.2s;
        }
        .term-link:hover {
          text-shadow: 0 0 12px rgba(0, 255, 65, 0.8), 0 0 24px rgba(0, 255, 65, 0.4);
        }

        /* Subtle text jitter for featured */
        @keyframes text-jitter {
          0% { transform: translate(0, 0); }
          25% { transform: translate(0.5px, 0); }
          50% { transform: translate(-0.5px, 0); }
          75% { transform: translate(0.5px, 0); }
          100% { transform: translate(0, 0); }
        }

        .text-jitter:hover {
          animation: text-jitter 0.1s infinite;
        }

        /* All text monospace */
        * {
          font-family: var(--font-vt323), var(--font-share-tech), monospace !important;
        }
      `}</style>

      {/* CRT Monitor Frame */}
      <div className="crt-scanlines crt-flicker">
        <div className="crt-screen min-h-screen">
          <main className="max-w-[960px] mx-auto px-4 py-6 text-[#00ff41]">
            {/* ═══════════════════════ NAVIGATION COMMAND ═══════════════════════ */}
            <div className="mb-2">
              <Link href="/" className="term-link glitch-hover text-lg tracking-wide">
                <span className="text-[#006b1d]">user@bnp:~$</span> cd ..
              </Link>
            </div>

            <div className="text-[#006b1d] text-sm mb-6">
              ────────────────────────────────────────────────────────────────────
            </div>

            {/* ═══════════════════════ BOOT SEQUENCE ═══════════════════════ */}
            <section className="mb-8">
              <div className="text-[#006b1d] text-base leading-relaxed space-y-0.5">
                <p>BIOS v4.2.1 ... OK</p>
                <p>Memory test: 65536K ... <span className="text-[#00ff41]">PASS</span></p>
                <p>Loading kernel modules ......... <span className="text-[#00ff41]">DONE</span></p>
                <p>&nbsp;</p>
              </div>

              <pre className="text-[#00ff41] glow-text text-2xl sm:text-3xl leading-tight mb-4">{`
 ██████╗ ███████╗██████╗  ██████╗ ██╗   ██╗
 ██╔══██╗██╔════╝██╔══██╗██╔═══██╗██║   ██║
 ██████╔╝█████╗  ██████╔╝██║   ██║██║   ██║
 ██╔══██╗██╔══╝  ██╔══██╗██║   ██║██║   ██║
 ██████╔╝███████╗██║  ██║╚██████╔╝╚██████╔╝
 ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝
   N A M   P R A C I    v 2 . 0 . 0`}</pre>

              <div className="text-[#006b1d] text-base leading-relaxed space-y-0.5">
                <p>
                  Initializing AI news feed...{" "}
                  <span className="text-[#00ff41]">[OK]</span>
                </p>
                <p>
                  Connecting to data source...{" "}
                  <span className="text-[#00ff41]">[ESTABLISHED]</span>
                </p>
                <p>
                  Decrypting article archive...{" "}
                  <span className="text-[#00ff41]">[DECRYPTED]</span>
                </p>
                <p>&nbsp;</p>
              </div>

              <div className="text-[#00ff41] text-base space-y-0.5">
                <p>
                  <span className="text-[#006b1d]">system.date</span> ={" "}
                  {currentDate}
                </p>
                <p>
                  <span className="text-[#006b1d]">system.time</span> ={" "}
                  {currentTime}
                </p>
                <p>
                  <span className="text-[#006b1d]">articles.count</span> ={" "}
                  {articles.length}
                </p>
                <p>
                  <span className="text-[#006b1d]">tags.loaded</span> ={" "}
                  {allTags.length}
                </p>
                <p>
                  <span className="text-[#006b1d]">session.status</span> ={" "}
                  <span className="text-[#00ff41] glow-text">ACTIVE</span>
                </p>
              </div>

              <div className="text-[#006b1d] text-sm mt-4 mb-2">
                ────────────────────────────────────────────────────────────────────
              </div>

              {/* Terminal Navigation */}
              <div className="text-base space-y-1">
                <p className="text-[#ffb000] glow-amber">
                  COMMAND REFERENCE:
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[#00ff41]">
                  <Link href="#articles" className="term-link glitch-hover">
                    [1] cat articles.log
                  </Link>
                  <Link href="#tags" className="term-link glitch-hover">
                    [2] ls -la /tags/
                  </Link>
                  <Link href="#comments" className="term-link glitch-hover">
                    [3] tail -f irc.log
                  </Link>
                  <span className="text-[#006b1d]">
                    [4] lang:cs/en <span className="text-[#ffb000]">[N/A]</span>
                  </span>
                </div>
              </div>
            </section>

            {/* ═══════════════════════ TAG FILTER ═══════════════════════ */}
            <section id="tags" className="mb-8">
              <div className="text-[#006b1d] text-sm mb-2">
                <span className="text-[#ffb000]">user@bnp:~$</span> ls -la /tags/
              </div>
              <div className="text-base mb-1 text-[#006b1d]">
                total {allTags.length} &nbsp;&nbsp; drwxr-xr-x
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {allTags.map((tag) => {
                  const count = articles.filter((a) =>
                    a.tags.includes(tag)
                  ).length;
                  return (
                    <span
                      key={tag}
                      className="text-[#00ff41] glitch-hover cursor-pointer text-base"
                    >
                      <span className="text-[#006b1d]">-rw-r--r-- </span>
                      <span className="text-[#ffb000]">{count}</span>
                      {" "}
                      <span className="text-[#00ff41]">[{tag.toUpperCase()}]</span>
                    </span>
                  );
                })}
              </div>
              <div className="mt-2 text-[#006b1d] text-sm">
                &gt; grep -t [TAG_NAME] articles.db &nbsp;
                <span className="text-[#ffb000]">// click to filter</span>
              </div>

              <div className="text-[#006b1d] text-sm mt-4">
                ────────────────────────────────────────────────────────────────────
              </div>
            </section>

            {/* ═══════════════════════ FEATURED ARTICLE ═══════════════════════ */}
            <section id="articles" className="mb-8">
              <div className="text-[#006b1d] text-sm mb-3">
                <span className="text-[#ffb000]">user@bnp:~$</span> cat articles.log
              </div>

              {/* Featured — ASCII bordered window */}
              <div className="mb-8">
                <pre className="text-[#00ff41] text-sm sm:text-base leading-tight">
{`┌──────────────────────────────────────────────────────────────────┐
│  *** FEATURED ARTICLE ***  PRIORITY: CRITICAL                    │
│  PID: 001  STATUS: UNREAD  CLASSIFICATION: TOP SECRET            │
├──────────────────────────────────────────────────────────────────┤`}
                </pre>
                <div className="border-l-2 border-r-2 border-[#00ff41] px-3 sm:px-4 py-4">
                  <div className="flex items-start gap-2 mb-3">
                    <span className={`${severityColor(severityFromTags(featured.tags))} text-sm`}>
                      [{severityFromTags(featured.tags)}]
                    </span>
                    <span className="text-[#006b1d] text-sm">
                      {formatTerminalDate(featured.date)}
                    </span>
                  </div>

                  <h2 className="text-[#00ff41] glow-text text-xl sm:text-2xl mb-4 text-jitter leading-tight">
                    &gt; {featured.title}
                  </h2>

                  <div className="text-[#006b1d] text-sm space-y-1 mb-4">
                    <p>
                      <span className="text-[#ffb000]">slug</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {featured.slug}
                    </p>
                    <p>
                      <span className="text-[#ffb000]">date</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {featured.date}
                    </p>
                    <p>
                      <span className="text-[#ffb000]">readTime</span>
                      &nbsp;= {featured.readTime} min
                    </p>
                    <p>
                      <span className="text-[#ffb000]">tags</span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;={" "}
                      {featured.tags
                        .map((t) => `[${t.toUpperCase()}]`)
                        .join(" ")}
                    </p>
                    <p>
                      <span className="text-[#ffb000]">sources</span>
                      &nbsp;&nbsp;= {featured.sources.length} attached
                    </p>
                  </div>

                  <div className="text-[#00ff41] text-base leading-relaxed mb-4 whitespace-pre-wrap">
                    {featured.content}
                  </div>

                  {/* Sources */}
                  <div className="text-[#006b1d] text-sm mt-4 mb-2">
                    --- ATTACHED SOURCES ---
                  </div>
                  {featured.sources.map((src, i) => (
                    <div key={i} className="text-sm mb-1">
                      <span className="text-[#ffb000]">
                        {sourceIcon(src.type)}
                      </span>{" "}
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="term-link glitch-hover"
                      >
                        {src.title}
                      </a>
                    </div>
                  ))}
                </div>
                <pre className="text-[#00ff41] text-sm sm:text-base leading-tight">
{`├──────────────────────────────────────────────────────────────────┤
│  EOF — article #001                                              │
└──────────────────────────────────────────────────────────────────┘`}
                </pre>
              </div>

              {/* ═══════════════════════ REMAINING ARTICLES ═══════════════════════ */}
              <div className="text-[#006b1d] text-sm mb-4">
                --- BEGIN LOG TAIL: remaining {rest.length} entries ---
              </div>

              {rest.map((article, index) => {
                const lineNum = String(index + 2).padStart(3, "0");
                const sev = severityFromTags(article.tags);
                return (
                  <div
                    key={article.slug}
                    className="mb-6 glitch-hover"
                  >
                    <div className="text-[#006b1d] text-xs mb-1">
                      ╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶
                    </div>

                    {/* Log line header */}
                    <div className="flex flex-wrap items-start gap-2 text-sm mb-1">
                      <span className="text-[#006b1d]">{lineNum}</span>
                      <span className="text-[#006b1d]">
                        {formatTerminalDate(article.date)}
                      </span>
                      <span className={severityColor(sev)}>[{sev}]</span>
                      <span className="text-[#00ff41]">
                        PID:{lineNum}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[#00ff41] text-lg sm:text-xl leading-tight mb-2">
                      <span className="text-[#006b1d]">&gt; </span>
                      {article.title}
                    </h3>

                    {/* Metadata block */}
                    <div className="text-[#006b1d] text-sm space-y-0.5 mb-2 ml-4">
                      <p>
                        <span className="text-[#ffb000]">readTime</span>={article.readTime}min
                        &nbsp;&nbsp;
                        <span className="text-[#ffb000]">tags</span>=
                        {article.tags
                          .map((t) => `[${t.toUpperCase()}]`)
                          .join("")}
                        &nbsp;&nbsp;
                        <span className="text-[#ffb000]">src</span>={article.sources.length}
                      </p>
                    </div>

                    {/* Excerpt */}
                    <div className="text-[#006b1d] text-base ml-4 leading-relaxed">
                      <span className="text-[#00ff41]">|</span> {article.excerpt}
                    </div>

                    {/* Sources inline */}
                    <div className="ml-4 mt-2 text-sm">
                      {article.sources.map((src, i) => (
                        <span key={i} className="mr-3">
                          <span className="text-[#ffb000]">
                            {sourceIcon(src.type)}
                          </span>{" "}
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="term-link text-[#006b1d] hover:text-[#00ff41]"
                          >
                            {src.title.length > 35
                              ? src.title.slice(0, 35) + "..."
                              : src.title}
                          </a>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="text-[#006b1d] text-sm mt-4">
                --- END LOG TAIL ---
              </div>
              <div className="text-[#006b1d] text-sm">
                ────────────────────────────────────────────────────────────────────
              </div>
            </section>

            {/* ═══════════════════════ AI MODEL COMMENTS (IRC STYLE) ═══════════════════════ */}
            <section id="comments" className="mb-8 mt-8">
              <div className="text-[#006b1d] text-sm mb-1">
                <span className="text-[#ffb000]">user@bnp:~$</span> tail -f irc.log
              </div>
              <div className="text-[#006b1d] text-sm mb-4">
                --- #berou-nam-praci IRC channel log ---
              </div>

              <pre className="text-[#00ff41] text-sm sm:text-base leading-tight mb-4">
{`┌──────────────────────────────────────────────────────────────────┐
│  IRC: #berou-nam-praci @ irc.ai-net.org                          │
│  Topic: "${featured.title.slice(0, 50)}..."                      │
│  Users: 3  Ops: 0  Voice: 3                                     │
├──────────────────────────────────────────────────────────────────┤`}
              </pre>

              <div className="border-l-2 border-r-2 border-[#00ff41] px-3 sm:px-4 py-4 space-y-4">
                <div className="text-[#006b1d] text-sm">
                  * Now talking in #berou-nam-praci
                </div>
                <div className="text-[#006b1d] text-sm">
                  * Topic is: AI model reactions to latest news
                </div>
                <div className="text-[#006b1d] text-sm mb-4">
                  * Set by ChanServ on {featured.date}
                </div>

                {featured.aiComments.map((comment, i) => {
                  const prompts = ["$", "#", "%"];
                  const colors = [
                    "text-[#00ff41]",
                    "text-[#4488ff]",
                    "text-[#cc66ff]",
                  ];
                  const nickColors = [
                    "text-[#00ff41]",
                    "text-[#ffb000]",
                    "text-[#ff6644]",
                  ];
                  const timestamp = `${String(12 + i).padStart(2, "0")}:${String(i * 17 + 3).padStart(2, "0")}`;

                  return (
                    <div key={i} className="text-base">
                      <div className="flex items-start gap-0 flex-wrap">
                        <span className="text-[#006b1d] text-sm mr-2">
                          [{timestamp}]
                        </span>
                        <span className={`${nickColors[i]} font-bold`}>
                          &lt;{comment.model}&gt;
                        </span>
                        <span className="text-[#00ff41] ml-2 leading-relaxed">
                          {comment.comment}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="text-[#006b1d] text-sm mt-4">
                  * {featured.aiComments.length} messages displayed from log
                </div>
              </div>

              <pre className="text-[#00ff41] text-sm sm:text-base leading-tight">
{`└──────────────────────────────────────────────────────────────────┘`}
              </pre>

              <div className="text-[#006b1d] text-sm mt-2">
                ────────────────────────────────────────────────────────────────────
              </div>
            </section>

            {/* ═══════════════════════ SYSTEM STATUS PANEL ═══════════════════════ */}
            <section className="mb-8">
              <div className="text-[#006b1d] text-sm mb-1">
                <span className="text-[#ffb000]">user@bnp:~$</span> neofetch
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 text-sm mt-2">
                <div className="space-y-0.5">
                  <p>
                    <span className="text-[#ffb000]">OS</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: BNP-Linux 2.0.0 x86_64
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Kernel</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 6.1.0-ai-news
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Shell</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: bnp-sh 4.2
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Runtime</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Bun 1.2+
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Framework</span>
                    &nbsp;&nbsp;&nbsp;: Next.js 16
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p>
                    <span className="text-[#ffb000]">Articles</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;: {articles.length} loaded
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Tags</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {allTags.length} indexed
                  </p>
                  <p>
                    <span className="text-[#ffb000]">AI Models</span>
                    &nbsp;&nbsp;&nbsp;: 3 online
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Uptime</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {Math.floor(Math.random() * 99) + 1}d {Math.floor(Math.random() * 23)}h
                  </p>
                  <p>
                    <span className="text-[#ffb000]">Memory</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 42069K / 65536K
                  </p>
                </div>
              </div>

              <div className="text-[#006b1d] text-sm mt-4">
                ────────────────────────────────────────────────────────────────────
              </div>
            </section>

            {/* ═══════════════════════ FOOTER ═══════════════════════ */}
            <footer className="mb-12">
              <div className="text-[#006b1d] text-sm mb-2">
                <span className="text-[#ffb000]">user@bnp:~$</span> exit
              </div>

              <pre className="text-[#006b1d] text-xs sm:text-sm leading-tight mb-4">
{`
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ░                                                                ░
  ░    Session terminated.                                         ░
  ░    ${articles.length} articles processed. 0 errors. 0 warnings.              ░
  ░    ${allTags.length} tags indexed. ${featured.aiComments.length} AI models consulted.                   ░
  ░                                                                ░
  ░    "Berou nam praci" (c) 2026                                  ░
  ░    They're taking our jobs — so we're tracking theirs.         ░
  ░                                                                ░
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
`}
              </pre>

              <div className="text-[#006b1d] text-sm">
                <p>logout</p>
                <p>Connection to bnp-server closed.</p>
                <p className="mt-2">
                  <span className="text-[#00ff41]">
                    &gt; _<span className="cursor-blink">█</span>
                  </span>
                </p>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
