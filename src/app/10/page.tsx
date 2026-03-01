import { Bangers, Noto_Sans_JP } from "next/font/google";
import { articles, allTags } from "@/lib/mockData";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-jp",
});

export const metadata = {
  title: "BEROU NAM PRACI — Manga Panel Layout",
  description:
    "AI novinky ve stylu manga panelu. Generovano AI. Kazdy den.",
};

/* ── tiny helpers ── */
const sfx = ["ドーン！", "ザワ...", "ガーン", "バキ！", "ゴゴゴゴ", "ドドド"];
const panelNumber = (n: number) =>
  ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"][n] ?? `(${n + 1})`;

export default function MangaPanelLayout() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div
      className={`${bangers.variable} ${notoSansJP.variable} relative min-h-screen bg-white text-black selection:bg-[#e60012] selection:text-white`}
      style={{ fontFamily: "var(--font-noto-jp), sans-serif" }}
    >
      {/* ══════ SCREENTONE OVERLAY ══════ */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 0.7px, transparent 0.7px)",
          backgroundSize: "6px 6px",
        }}
      />

      {/* ══════ SPEED-LINE BG (subtle, full page) ══════ */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "conic-gradient(from 0deg at 50% 40%, #000 0deg, transparent 2deg, transparent 10deg, #000 10deg, transparent 12deg, transparent 20deg, #000 20deg, transparent 22deg, transparent 30deg, #000 30deg, transparent 32deg, transparent 40deg, #000 40deg, transparent 42deg, transparent 50deg, #000 50deg, transparent 52deg, transparent 60deg, #000 60deg, transparent 62deg, transparent 70deg, #000 70deg, transparent 72deg, transparent 80deg, #000 80deg, transparent 82deg, transparent 90deg, #000 90deg, transparent 92deg, transparent 100deg, #000 100deg, transparent 102deg, transparent 110deg, #000 110deg, transparent 112deg, transparent 120deg, #000 120deg, transparent 122deg, transparent 130deg, #000 130deg, transparent 132deg, transparent 140deg, #000 140deg, transparent 142deg, transparent 150deg, #000 150deg, transparent 152deg, transparent 160deg, #000 160deg, transparent 162deg, transparent 170deg, #000 170deg, transparent 172deg, transparent 180deg, #000 180deg, transparent 182deg, transparent 190deg, #000 190deg, transparent 192deg, transparent 200deg, #000 200deg, transparent 202deg, transparent 210deg, #000 210deg, transparent 212deg, transparent 220deg, #000 220deg, transparent 222deg, transparent 230deg, #000 230deg, transparent 232deg, transparent 240deg, #000 240deg, transparent 242deg, transparent 250deg, #000 250deg, transparent 252deg, transparent 260deg, #000 260deg, transparent 262deg, transparent 270deg, #000 270deg, transparent 272deg, transparent 280deg, #000 280deg, transparent 282deg, transparent 290deg, #000 290deg, transparent 292deg, transparent 300deg, #000 300deg, transparent 302deg, transparent 310deg, #000 310deg, transparent 312deg, transparent 320deg, #000 320deg, transparent 322deg, transparent 330deg, #000 330deg, transparent 332deg, transparent 340deg, #000 340deg, transparent 342deg, transparent 350deg, #000 350deg, transparent 352deg, transparent 360deg)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-3 py-4 md:px-6 md:py-8">
        {/* ════════════════════════════════════════════
            PANEL 1 — TITLE (full-width hero)
        ════════════════════════════════════════════ */}
        <section className="relative mb-1 overflow-hidden border-[4px] border-black bg-white">
          {/* Speed lines radiating from center */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 50% 55%, #000 0deg, transparent 1.5deg, transparent 5deg, #000 5deg, transparent 6.5deg, transparent 10deg, #000 10deg, transparent 11.5deg, transparent 15deg, #000 15deg, transparent 16.5deg, transparent 20deg, #000 20deg, transparent 21.5deg, transparent 25deg, #000 25deg, transparent 26.5deg, transparent 30deg, #000 30deg, transparent 31.5deg, transparent 35deg, #000 35deg, transparent 36.5deg, transparent 40deg, #000 40deg, transparent 41.5deg, transparent 45deg, #000 45deg, transparent 46.5deg, transparent 50deg, #000 50deg, transparent 51.5deg, transparent 55deg, #000 55deg, transparent 56.5deg, transparent 60deg, #000 60deg, transparent 61.5deg, transparent 65deg, #000 65deg, transparent 66.5deg, transparent 70deg, #000 70deg, transparent 71.5deg, transparent 75deg, #000 75deg, transparent 76.5deg, transparent 80deg, #000 80deg, transparent 81.5deg, transparent 85deg, #000 85deg, transparent 86.5deg, transparent 90deg, #000 90deg, transparent 91.5deg, transparent 95deg, #000 95deg, transparent 96.5deg, transparent 100deg, #000 100deg, transparent 101.5deg, transparent 105deg, #000 105deg, transparent 106.5deg, transparent 110deg, #000 110deg, transparent 111.5deg, transparent 115deg, #000 115deg, transparent 116.5deg, transparent 120deg, #000 120deg, transparent 121.5deg, transparent 125deg, #000 125deg, transparent 126.5deg, transparent 130deg, #000 130deg, transparent 131.5deg, transparent 135deg, #000 135deg, transparent 136.5deg, transparent 140deg, #000 140deg, transparent 141.5deg, transparent 145deg, #000 145deg, transparent 146.5deg, transparent 150deg, #000 150deg, transparent 151.5deg, transparent 155deg, #000 155deg, transparent 156.5deg, transparent 160deg, #000 160deg, transparent 161.5deg, transparent 165deg, #000 165deg, transparent 166.5deg, transparent 170deg, #000 170deg, transparent 171.5deg, transparent 175deg, #000 175deg, transparent 176.5deg, transparent 180deg, #000 180deg, transparent 181.5deg, transparent 185deg, #000 185deg, transparent 186.5deg, transparent 190deg, #000 190deg, transparent 191.5deg, transparent 195deg, #000 195deg, transparent 196.5deg, transparent 200deg, #000 200deg, transparent 201.5deg, transparent 205deg, #000 205deg, transparent 206.5deg, transparent 210deg, #000 210deg, transparent 211.5deg, transparent 215deg, #000 215deg, transparent 216.5deg, transparent 220deg, #000 220deg, transparent 221.5deg, transparent 225deg, #000 225deg, transparent 226.5deg, transparent 230deg, #000 230deg, transparent 231.5deg, transparent 235deg, #000 235deg, transparent 236.5deg, transparent 240deg, #000 240deg, transparent 241.5deg, transparent 245deg, #000 245deg, transparent 246.5deg, transparent 250deg, #000 250deg, transparent 251.5deg, transparent 255deg, #000 255deg, transparent 256.5deg, transparent 260deg, #000 260deg, transparent 261.5deg, transparent 265deg, #000 265deg, transparent 266.5deg, transparent 270deg, #000 270deg, transparent 271.5deg, transparent 275deg, #000 275deg, transparent 276.5deg, transparent 280deg, #000 280deg, transparent 281.5deg, transparent 285deg, #000 285deg, transparent 286.5deg, transparent 290deg, #000 290deg, transparent 291.5deg, transparent 295deg, #000 295deg, transparent 296.5deg, transparent 300deg, #000 300deg, transparent 301.5deg, transparent 305deg, #000 305deg, transparent 306.5deg, transparent 310deg, #000 310deg, transparent 311.5deg, transparent 315deg, #000 315deg, transparent 316.5deg, transparent 320deg, #000 320deg, transparent 321.5deg, transparent 325deg, #000 325deg, transparent 326.5deg, transparent 330deg, #000 330deg, transparent 331.5deg, transparent 335deg, #000 335deg, transparent 336.5deg, transparent 340deg, #000 340deg, transparent 341.5deg, transparent 345deg, #000 345deg, transparent 346.5deg, transparent 350deg, #000 350deg, transparent 351.5deg, transparent 355deg, #000 355deg, transparent 356.5deg, transparent 360deg)",
            }}
          />

          {/* Impact starburst behind title */}
          <div
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              background: "#000",
            }}
          />

          <div className="relative flex flex-col items-center px-4 py-12 md:py-20 text-center">
            {/* Corner panels — nav + lang */}
            <div className="absolute left-3 top-3 flex gap-2">
              <a
                href="/"
                className="border-[3px] border-black bg-white px-3 py-1 text-sm font-bold tracking-wide transition-colors hover:bg-black hover:text-white"
                style={{ fontFamily: "var(--font-bangers)" }}
              >
                &larr; Zpet
              </a>
            </div>
            <div className="absolute right-3 top-3">
              <div className="flex border-[3px] border-black">
                <span className="bg-black px-2 py-1 text-xs font-bold text-white">
                  CZ
                </span>
                <span className="bg-white px-2 py-1 text-xs font-bold text-black">
                  EN
                </span>
              </div>
            </div>

            {/* SFX decoration */}
            <span
              className="absolute left-6 top-16 -rotate-12 text-4xl font-black opacity-[0.07] md:text-6xl"
              style={{ fontFamily: "var(--font-noto-jp)" }}
            >
              ドーン！
            </span>
            <span
              className="absolute bottom-8 right-8 rotate-6 text-3xl font-black opacity-[0.07] md:text-5xl"
              style={{ fontFamily: "var(--font-noto-jp)" }}
            >
              ゴゴゴゴ
            </span>

            {/* Main title with impact */}
            <div className="relative">
              {/* Red impact flash */}
              <div
                className="absolute left-1/2 top-1/2 h-[120%] w-[110%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  clipPath:
                    "polygon(50% 0%, 63% 28%, 100% 15%, 75% 50%, 100% 85%, 63% 72%, 50% 100%, 37% 72%, 0% 85%, 25% 50%, 0% 15%, 37% 28%)",
                  background: "#e60012",
                  opacity: 0.08,
                }}
              />
              <h1
                className="relative text-5xl tracking-wider md:text-8xl lg:text-9xl"
                style={{
                  fontFamily: "var(--font-bangers)",
                  textShadow: "3px 3px 0 #e60012, -1px -1px 0 #000",
                }}
              >
                BEROU NAM PRACI
              </h1>
            </div>

            <p
              className="mt-3 text-lg tracking-[0.3em] opacity-60 md:text-xl"
              style={{ fontFamily: "var(--font-noto-jp)" }}
            >
              仕事を奪われる
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.5em] opacity-40">
              AI News &middot; Daily &middot; Generated by AI
            </p>
          </div>

          {/* Bottom angled border accent */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#e60012]" />
        </section>

        {/* ════════════════════════════════════════════
            PANEL 2 — FEATURED ARTICLE (large dramatic panel)
        ════════════════════════════════════════════ */}
        <section className="relative mb-1 overflow-hidden border-[4px] border-black bg-white">
          {/* Diagonal screentone fill on one side */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "5px 5px",
            }}
          />

          {/* Speed lines from left */}
          <div
            className="pointer-events-none absolute -left-[200px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 opacity-[0.05]"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 100% 50%, #000 0deg, transparent 1deg, transparent 4deg, #000 4deg, transparent 5deg, transparent 8deg, #000 8deg, transparent 9deg, transparent 12deg, #000 12deg, transparent 13deg, transparent 16deg, #000 16deg, transparent 17deg, transparent 20deg, #000 20deg, transparent 21deg, transparent 24deg, #000 24deg, transparent 25deg, transparent 28deg, #000 28deg, transparent 29deg, transparent 32deg, #000 32deg, transparent 33deg, transparent 36deg, #000 36deg, transparent 37deg, transparent 40deg, #000 40deg, transparent 41deg, transparent 44deg, #000 44deg, transparent 45deg, transparent 48deg, #000 48deg, transparent 49deg, transparent 360deg)",
            }}
          />

          <div className="relative px-5 py-8 md:px-10 md:py-14">
            {/* Panel number */}
            <span className="absolute right-4 top-3 text-2xl font-black opacity-20">
              ①
            </span>

            {/* Narration box */}
            <div className="mb-6 inline-block border-[2px] border-black bg-black px-4 py-2 text-white">
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-noto-jp)" }}
              >
                In this issue... / 今号の特集
              </span>
            </div>

            {/* Title with impact effect */}
            <div className="relative mb-4">
              <div
                className="absolute -left-2 -top-2 h-[calc(100%+16px)] w-[calc(100%+16px)] opacity-[0.04]"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  background: "#e60012",
                }}
              />
              <h2
                className="relative text-3xl leading-tight md:text-5xl lg:text-6xl"
                style={{
                  fontFamily: "var(--font-bangers)",
                  textShadow: "2px 2px 0 rgba(230,0,18,0.15)",
                }}
              >
                {featured.title}
              </h2>
            </div>

            {/* Excerpt in narration box */}
            <div className="mb-6 max-w-2xl border-l-[4px] border-black bg-gray-50 px-4 py-3">
              <p
                className="text-sm leading-relaxed md:text-base"
                style={{ fontFamily: "var(--font-noto-jp)" }}
              >
                {featured.excerpt}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-[2px] border-[#e60012] bg-[#e60012] px-3 py-1 text-xs font-bold text-white">
                {featured.date}
              </span>
              <span className="text-xs font-bold opacity-50">
                {featured.readTime} min read
              </span>
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-[2px] border-black px-2 py-0.5 text-xs font-bold uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* SFX */}
            <span
              className="absolute bottom-4 right-6 text-5xl font-black opacity-[0.05] md:text-7xl"
              style={{ fontFamily: "var(--font-noto-jp)" }}
            >
              バキ！
            </span>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            PANELS 3-6 — ARTICLE PANELS (manga grid)
        ════════════════════════════════════════════ */}
        <div className="mb-1 grid grid-cols-1 gap-1 md:grid-cols-12">
          {rest.map((article, i) => {
            /* Vary panel sizes for manga feel */
            const colSpans = [
              "md:col-span-7",
              "md:col-span-5",
              "md:col-span-5",
              "md:col-span-7",
            ];
            const colSpan = colSpans[i % colSpans.length];

            /* Alternate panel styles */
            const hasScreentone = i % 2 === 0;
            const hasSpeedLines = i % 3 === 0;
            const isSkewed = i === 1;

            return (
              <article
                key={article.slug}
                className={`group relative overflow-hidden border-[4px] border-black bg-white transition-all ${colSpan}`}
                style={
                  isSkewed
                    ? { transform: "skewY(-1deg)" }
                    : undefined
                }
              >
                {/* Screentone bg */}
                {hasScreentone && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #000 0.8px, transparent 0.8px)",
                      backgroundSize: "4px 4px",
                    }}
                  />
                )}

                {/* Speed lines */}
                {hasSpeedLines && (
                  <div
                    className="pointer-events-none absolute -right-[100px] top-1/2 h-[400px] w-[400px] -translate-y-1/2 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "conic-gradient(from 180deg at 0% 50%, #000 0deg, transparent 1.5deg, transparent 8deg, #000 8deg, transparent 9.5deg, transparent 16deg, #000 16deg, transparent 17.5deg, transparent 24deg, #000 24deg, transparent 25.5deg, transparent 32deg, #000 32deg, transparent 33.5deg, transparent 40deg, #000 40deg, transparent 41.5deg, transparent 48deg, #000 48deg, transparent 49.5deg, transparent 360deg)",
                    }}
                  />
                )}

                {/* Cross-hatching effect for one panel */}
                {i === 2 && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.025]"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 8px),
                        repeating-linear-gradient(-45deg, #000 0px, #000 1px, transparent 1px, transparent 8px)
                      `,
                    }}
                  />
                )}

                <div
                  className="relative flex flex-col justify-between p-5 md:p-6"
                  style={
                    isSkewed
                      ? { transform: "skewY(1deg)" }
                      : undefined
                  }
                >
                  {/* Panel number */}
                  <span className="absolute right-3 top-2 text-xl font-black opacity-15">
                    {panelNumber(i + 1)}
                  </span>

                  {/* SFX decoration */}
                  <span
                    className="absolute bottom-3 right-4 text-3xl font-black opacity-[0.05] md:text-4xl"
                    style={{ fontFamily: "var(--font-noto-jp)" }}
                  >
                    {sfx[i % sfx.length]}
                  </span>

                  {/* Date label */}
                  <div className="mb-3">
                    <span className="border-[2px] border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                      {article.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-3 text-xl leading-tight md:text-2xl"
                    style={{
                      fontFamily: "var(--font-bangers)",
                      textShadow:
                        i === 0
                          ? "1px 1px 0 rgba(230,0,18,0.2)"
                          : "none",
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className="mb-4 text-xs leading-relaxed opacity-70 md:text-sm"
                    style={{ fontFamily: "var(--font-noto-jp)" }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-[2px] border-black px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-[10px] font-bold opacity-40">
                      {article.readTime} min
                    </span>
                  </div>
                </div>

                {/* Hover: red border flash */}
                <div className="absolute inset-0 border-[4px] border-[#e60012] opacity-0 transition-opacity group-hover:opacity-100" />
              </article>
            );
          })}
        </div>

        {/* ════════════════════════════════════════════
            TAGS — Mini panels strip
        ════════════════════════════════════════════ */}
        <section className="mb-1 border-[4px] border-black bg-white p-4 md:p-6">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-lg md:text-xl"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              TAGS
            </span>
            <span
              className="text-xs opacity-40"
              style={{ fontFamily: "var(--font-noto-jp)" }}
            >
              タグ一覧
            </span>
            <div className="ml-2 h-[3px] flex-1 bg-black opacity-10" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="border-[3px] border-black px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
                style={{ fontFamily: "var(--font-bangers)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            AI COMMENTS — Speech bubbles panel
        ════════════════════════════════════════════ */}
        <section className="mb-1 border-[4px] border-black bg-white">
          {/* Panel header — narration box */}
          <div className="border-b-[3px] border-black bg-black px-5 py-3 text-white">
            <span
              className="text-sm tracking-[0.2em] uppercase md:text-base"
              style={{ fontFamily: "var(--font-bangers)" }}
            >
              Meanwhile, at the AI Labs...
            </span>
            <span
              className="ml-3 text-xs opacity-50"
              style={{ fontFamily: "var(--font-noto-jp)" }}
            >
              その頃、AI研究所では...
            </span>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {featured.aiComments.map((comment, i) => {
              /* Different bubble styles per model */
              const bubbleStyles = [
                /* Normal speech bubble */
                "rounded-2xl rounded-bl-sm",
                /* Spiky / emphasis bubble */
                "",
                /* Thought bubble */
                "rounded-[50%]",
              ];
              const bubbleClass = bubbleStyles[i % 3];
              const isSpiky = i === 1;
              const isThought = i === 2;

              return (
                <div
                  key={comment.model}
                  className={`relative flex flex-col items-center px-5 py-8 md:py-10 ${
                    i < 2 ? "border-b-[3px] border-black md:border-b-0 md:border-r-[3px]" : ""
                  }`}
                >
                  {/* SFX behind avatar */}
                  <span
                    className="absolute left-1/2 top-6 -translate-x-1/2 text-4xl font-black opacity-[0.04] md:text-5xl"
                    style={{ fontFamily: "var(--font-noto-jp)" }}
                  >
                    {sfx[(i + 3) % sfx.length]}
                  </span>

                  {/* Avatar circle */}
                  <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-white text-2xl shadow-[3px_3px_0_#000]">
                    {comment.avatar}
                  </div>

                  {/* Model name */}
                  <span
                    className="mb-3 text-sm tracking-wider"
                    style={{ fontFamily: "var(--font-bangers)" }}
                  >
                    {comment.model}
                  </span>

                  {/* Speech bubble */}
                  {isSpiky ? (
                    /* Spiky emphasis bubble */
                    <div className="relative w-full max-w-[260px]">
                      <div
                        className="relative border-[3px] border-black bg-white px-4 py-3"
                        style={{
                          clipPath:
                            "polygon(3% 8%, 8% 0%, 15% 10%, 25% 2%, 33% 8%, 45% 0%, 55% 7%, 65% 1%, 73% 9%, 82% 2%, 90% 8%, 97% 3%, 100% 15%, 98% 30%, 100% 45%, 97% 58%, 100% 72%, 98% 85%, 100% 92%, 93% 100%, 82% 95%, 70% 100%, 58% 96%, 45% 100%, 33% 96%, 20% 100%, 8% 96%, 0% 100%, 2% 88%, 0% 72%, 3% 58%, 0% 45%, 2% 30%, 0% 15%)",
                        }}
                      >
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            fontFamily: "var(--font-noto-jp)",
                          }}
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div
                        className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2"
                        style={{
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderBottom: "12px solid #000",
                        }}
                      />
                    </div>
                  ) : isThought ? (
                    /* Thought bubble */
                    <div className="relative w-full max-w-[260px]">
                      <div className="rounded-[40%] border-[3px] border-black bg-white px-5 py-4">
                        <p
                          className="text-center text-xs leading-relaxed"
                          style={{
                            fontFamily: "var(--font-noto-jp)",
                          }}
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* Thought dots */}
                      <div className="absolute -top-2 left-1/2 -translate-x-3">
                        <div className="h-3 w-3 rounded-full border-[2px] border-black bg-white" />
                      </div>
                      <div className="absolute -top-5 left-1/2 translate-x-1">
                        <div className="h-2 w-2 rounded-full border-[2px] border-black bg-white" />
                      </div>
                    </div>
                  ) : (
                    /* Normal speech bubble */
                    <div className="relative w-full max-w-[260px]">
                      <div
                        className={`border-[3px] border-black bg-white px-4 py-3 ${bubbleClass}`}
                      >
                        <p
                          className="text-xs leading-relaxed"
                          style={{
                            fontFamily: "var(--font-noto-jp)",
                          }}
                        >
                          {comment.comment}
                        </p>
                      </div>
                      {/* Triangle pointer */}
                      <div
                        className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2"
                        style={{
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderBottom: "10px solid #000",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER — Final panel: "To be continued..."
        ════════════════════════════════════════════ */}
        <footer className="relative overflow-hidden border-[4px] border-black bg-white">
          {/* Speed lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "conic-gradient(from 0deg at 80% 50%, #000 0deg, transparent 1deg, transparent 6deg, #000 6deg, transparent 7deg, transparent 12deg, #000 12deg, transparent 13deg, transparent 18deg, #000 18deg, transparent 19deg, transparent 24deg, #000 24deg, transparent 25deg, transparent 30deg, #000 30deg, transparent 31deg, transparent 36deg, #000 36deg, transparent 37deg, transparent 42deg, #000 42deg, transparent 43deg, transparent 48deg, #000 48deg, transparent 49deg, transparent 360deg)",
            }}
          />

          <div className="relative flex flex-col items-center px-6 py-10 md:flex-row md:justify-between md:py-14">
            {/* Left: To be continued */}
            <div className="mb-4 text-center md:mb-0 md:text-left">
              <p
                className="text-4xl md:text-6xl"
                style={{
                  fontFamily: "var(--font-bangers)",
                  textShadow: "2px 2px 0 #e60012",
                }}
              >
                TO BE CONTINUED...
              </p>
              <p
                className="mt-1 text-lg tracking-[0.5em] opacity-60"
                style={{ fontFamily: "var(--font-noto-jp)" }}
              >
                つづく...
              </p>
            </div>

            {/* Right: credits */}
            <div className="text-center md:text-right">
              <p
                className="text-xs uppercase tracking-widest opacity-40"
                style={{ fontFamily: "var(--font-noto-jp)" }}
              >
                Generated by AI &middot; Daily
              </p>
              <p
                className="mt-1 text-xs opacity-30"
                style={{ fontFamily: "var(--font-noto-jp)" }}
              >
                &copy; 2026 BEROU NAM PRACI
              </p>
            </div>
          </div>

          {/* Bottom red accent bar */}
          <div className="h-2 bg-[#e60012]" />
        </footer>
      </div>
    </div>
  );
}
