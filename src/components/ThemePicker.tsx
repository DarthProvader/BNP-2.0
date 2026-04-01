"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const themes = [
  {
    id: "brutalist-dark",
    route: "/",
    name: "Brutalist Dark",
    accent: "#ff6600",
    bg: "#0a0a0a",
  },
  {
    id: "cyberpunk",
    route: "/cyberpunk",
    name: "Akira Neon",
    accent: "#00f0ff",
    bg: "#0a0014",
  },
];

const THEME_ROUTES = themes.map((t) => t.id).filter((id) => id !== "brutalist-dark");

function getActiveTheme(pathname: string): string {
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";
  if (pathname === "/") return "brutalist-dark";
  if (THEME_ROUTES.includes(firstSegment)) return firstSegment;
  return "brutalist-dark";
}

export default function ThemePicker({
  variant = "neutral",
}: {
  variant?: "brutalist" | "cyberpunk" | "neutral";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const activeId = getActiveTheme(pathname);
  const activeTheme = themes.find((t) => t.id === activeId) ?? themes[0];
  const otherTheme = themes.find((t) => t.id !== activeId) ?? themes[1];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleThemeClick(theme: (typeof themes)[number]) {
    const segments = pathname.split("/").filter(Boolean);
    const isArticlePage = segments.length >= 2 || (segments.length === 1 && !THEME_ROUTES.includes(segments[0]));

    if (isArticlePage) {
      const slug = THEME_ROUTES.includes(segments[0]) ? segments.slice(1).join("/") : segments[0];
      if (theme.id === "brutalist-dark") {
        router.push(`/${slug}`);
      } else {
        router.push(`/${theme.id}/${slug}`);
      }
    } else {
      router.push(theme.route);
    }
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Panel dropdown */}
      {open && (
        <div
          className="absolute top-full right-0 mt-1 w-48 border rounded-md overflow-hidden shadow-2xl z-[9999]"
          style={{
            backgroundColor: "#111",
            borderColor: variant === "cyberpunk" ? "#00f0ff30" : variant === "brutalist" ? "#f0f0f030" : "#333",
          }}
        >
          <div className="p-1.5 flex flex-col gap-0.5">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeClick(theme)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors w-full ${
                  theme.id === activeId
                    ? "bg-neutral-800"
                    : "hover:bg-neutral-800/60"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: theme.accent }}
                />
                <span className="text-[10px] font-mono text-neutral-300 tracking-wider uppercase">
                  {theme.name}
                </span>
                {theme.id === activeId && (
                  <span className="ml-auto text-[10px] text-neutral-500">●</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      {variant === "cyberpunk" ? (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-[0.2em] border transition-colors cursor-pointer"
          style={{
            borderColor: "#00f0ff",
            color: "#00f0ff",
            textShadow: "0 0 8px rgba(0,240,255,0.5)",
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeTheme.accent }} />
          <span className="font-mono uppercase">{activeTheme.name}</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-1.5 border border-[#f0f0f0]/30 text-[#f0f0f0]/30 hover:text-[#f0f0f0] hover:border-[#f0f0f0] cursor-pointer bg-[#0a0a0a]/80 transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeTheme.accent }} />
          <span className="font-mono text-[10px] uppercase tracking-widest">{activeTheme.name}</span>
        </button>
      )}
    </div>
  );
}
