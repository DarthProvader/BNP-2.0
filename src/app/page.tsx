import Link from "next/link";

const versions = [
  {
    id: 1,
    name: "Concrete Monolith",
    description: "Brutalistní architektura. Betonové textury, monolitické bloky, industriální typografie. Modrá + amber.",
    accent: "#0055ff",
    category: "brutalist",
  },
  {
    id: 4,
    name: "Classified / Redacted",
    description: "Utajené dokumenty, CLASSIFIED razítka, psací stroj, manila složky. Jako byste našli tajný spis o AI.",
    accent: "#cc0000",
    category: "brutalist",
  },
  {
    id: 11,
    name: "Brutalist Dark Editorial",
    description: "Původní brutalistní tmavý design. Instrument Serif, glitch efekty, asymetrický grid, electric red.",
    accent: "#ff2222",
    category: "brutalist",
  },
  {
    id: 6,
    name: "Akira Neon Streets",
    description: "Ulice Neo-Tokia o 2. ráno. Cyan neon, déšť, stopy po motorkách. Akira meets Blade Runner.",
    accent: "#00f0ff",
    category: "neo-tokyo",
  },
  {
    id: 7,
    name: "Holographic HUD",
    description: "Vojenský heads-up display. Wireframe panely, zaměřovací kříže, skenování, cyan + amber.",
    accent: "#00e5ff",
    category: "neo-tokyo",
  },
  {
    id: 10,
    name: "Manga Panel Layout",
    description: "Stránka JE manga. Šikmé panely, speed lines, screentone, bubliny. Dark mode + červená.",
    accent: "#e60012",
    category: "neo-tokyo",
  },
];

const brutalist = versions.filter((v) => v.category === "brutalist");
const neoTokyo = versions.filter((v) => v.category === "neo-tokyo");

function VersionCard({ v }: { v: (typeof versions)[number] }) {
  return (
    <Link
      href={`/${v.id}`}
      className="group relative block overflow-hidden rounded-xl border border-neutral-800 hover:border-neutral-600 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-md"
            style={{ backgroundColor: v.accent, color: v.accent === "#0055ff" || v.accent === "#00f0ff" || v.accent === "#00e5ff" ? "#000" : "#fff" }}
          >
            /{v.id}
          </span>
          <h3 className="text-lg font-bold">{v.name}</h3>
        </div>
        <p className="text-neutral-500 text-sm leading-relaxed">{v.description}</p>
      </div>
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: v.accent }}
      />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-20">
          <h1 className="text-7xl font-bold mb-3 tracking-tighter">
            Berou nám práci
          </h1>
          <p className="text-neutral-500 text-lg">
            6 designových variací AI news blogu — 2 styly × 3 verze
          </p>
        </div>

        {/* Brutalist Dark */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-neutral-800" />
            <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
              Brutalist Dark — 3 variace
            </h2>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brutalist.map((v) => (
              <VersionCard key={v.id} v={v} />
            ))}
          </div>
        </section>

        {/* Neo-Tokyo */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-neutral-800" />
            <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
              Neo-Tokyo — 3 variace
            </h2>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neoTokyo.map((v) => (
              <VersionCard key={v.id} v={v} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
