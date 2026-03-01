import Link from "next/link";

const versions = [
  {
    id: 1,
    name: "Brutalist Dark Editorial",
    description: "Surový, tmavý design inspirovaný novinami a cyberpunkem. Ostré kontrasty, glitch efekty, raw typografie.",
    color: "from-zinc-900 to-black",
    accent: "#ff3333",
  },
  {
    id: 2,
    name: "Luxury Magazine",
    description: "Elegantní editorial layout se serifovou typografií, zlatými akcenty a sofistikovaným spacingem.",
    color: "from-stone-900 to-amber-950",
    accent: "#d4a574",
  },
  {
    id: 3,
    name: "Retro Terminal / CRT",
    description: "Zelená na černé, scanlines, monospace font, hacker vibes. Jako byste četli AI novinky v Matrixu.",
    color: "from-black to-green-950",
    accent: "#00ff41",
  },
  {
    id: 4,
    name: "Glassmorphism Aurora",
    description: "Mesh gradienty, skleněné karty, plynoucí organické tvary. Éterický a moderní.",
    color: "from-indigo-950 to-purple-950",
    accent: "#818cf8",
  },
  {
    id: 5,
    name: "Neo-Tokyo Maximalist",
    description: "Neonové barvy, dense info display, japonská inspirace. Informační přetížení jako umělecká forma.",
    color: "from-gray-950 to-fuchsia-950",
    accent: "#ff00ff",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Berou nám práci
          <span className="text-neutral-500 text-2xl ml-3 font-normal">2.0</span>
        </h1>
        <p className="text-neutral-400 text-xl mb-16 max-w-2xl">
          5 designových verzí AI news blogu. Vyber si tu, která tě osloví.
        </p>

        <div className="grid gap-6">
          {versions.map((v) => (
            <Link
              key={v.id}
              href={`/${v.id}`}
              className="group relative block overflow-hidden rounded-2xl border border-neutral-800 hover:border-neutral-600 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-linear-to-r ${v.color} opacity-60`} />
              <div className="relative p-8 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span
                      className="text-sm font-mono font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: v.accent, color: "#000" }}
                    >
                      /{v.id}
                    </span>
                    <h2 className="text-2xl font-bold">{v.name}</h2>
                  </div>
                  <p className="text-neutral-400 max-w-xl">{v.description}</p>
                </div>
                <div className="text-4xl opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
