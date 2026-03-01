import Link from "next/link";

const brutalistVersions = [
  {
    id: 1,
    name: "Concrete Monolith",
    description: "Brutalistní architektura. Betonové textury, monolitické bloky, industriální typografie, construction orange.",
    accent: "#ff6600",
  },
  {
    id: 2,
    name: "Punk Zine Collage",
    description: "Cut-and-paste punk zine. Trhané papíry, ransom-note typo, samolepky, razítka, neonová růžová.",
    accent: "#ff1493",
  },
  {
    id: 3,
    name: "Swiss Brutalist Grid",
    description: "Mezinárodní typografický styl rozbitý na kusy. Extrémní hierarchie, pouze černá + bílá + červená.",
    accent: "#ff0000",
  },
  {
    id: 4,
    name: "Classified / Redacted",
    description: "Utajené dokumenty, CLASSIFIED razítka, psací stroj, manila složky. Jako byste našli tajný spis o AI.",
    accent: "#cc0000",
  },
  {
    id: 5,
    name: "Deconstructed Newspaper",
    description: "Roztrhané noviny na tmavé zdi. Fragmenty sloupců, připínáčky, červené poznámky, novinový papír.",
    accent: "#cc2222",
  },
];

const neoTokyoVersions = [
  {
    id: 6,
    name: "Akira Neon Streets",
    description: "Ulice Neo-Tokia o 2. ráno. Rudý neon, graffiti, déšť, stopy po motorkách. Akira meets Blade Runner.",
    accent: "#ff1744",
  },
  {
    id: 7,
    name: "Holographic HUD",
    description: "Vojenský heads-up display. Wireframe panely, zaměřovací kříže, skenování, cyan + amber.",
    accent: "#00e5ff",
  },
  {
    id: 8,
    name: "Vaporwave Tokyo",
    description: "80s retro-futurismus. Sunset gradienty, chrome text, perspektivní grid, synthwave nostalgie.",
    accent: "#ff6ec7",
  },
  {
    id: 9,
    name: "Cyberpunk Data Terminal",
    description: "Bloomberg Terminal meets Ghost in the Shell. Ultra-dense data dashboard, sparklines, stock-ticker.",
    accent: "#39ff14",
  },
  {
    id: 10,
    name: "Manga Panel Layout",
    description: "Stránka JE manga. Šikmé panely, speed lines, screentone, bubliny. Černobílá + červená.",
    accent: "#e60012",
  },
];

function VersionCard({ v, category }: { v: (typeof brutalistVersions)[number]; category: string }) {
  return (
    <Link
      href={`/${v.id}`}
      className="group relative block overflow-hidden rounded-xl border border-neutral-800 hover:border-neutral-600 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-md"
            style={{ backgroundColor: v.accent, color: "#000" }}
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
            10 designových variací AI news blogu — 2 styly × 5 verzí
          </p>
        </div>

        {/* Brutalist Dark */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-neutral-800" />
            <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
              Brutalist Dark — 5 variací
            </h2>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brutalistVersions.map((v) => (
              <VersionCard key={v.id} v={v} category="brutalist" />
            ))}
          </div>
        </section>

        {/* Neo-Tokyo */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-neutral-800" />
            <h2 className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
              Neo-Tokyo — 5 variací
            </h2>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neoTokyoVersions.map((v) => (
              <VersionCard key={v.id} v={v} category="neo-tokyo" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
