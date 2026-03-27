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
  // Root-level slug (e.g. /some-article) = brutalist-dark
  return "brutalist-dark";
}

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const activeId = getActiveTheme(pathname);
  const activeTheme = themes.find((t) => t.id === activeId) ?? themes[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close panel on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleThemeClick(theme: (typeof themes)[number]) {
    const segments = pathname.split("/").filter(Boolean);
    const isArticlePage = segments.length >= 2 || (segments.length === 1 && !THEME_ROUTES.includes(segments[0]));

    if (isArticlePage) {
      // Article detail page - swap prefix, keep slug
      const slug = THEME_ROUTES.includes(segments[0]) ? segments.slice(1).join("/") : segments[0];
      if (theme.id === "brutalist-dark") {
        router.push(`/${slug}`);
      } else {
        router.push(`/${theme.id}/${slug}`);
      }
    } else {
      // Listing page
      router.push(theme.route);
    }
  }

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-[9999]">
      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-12 right-0 w-56 border border-neutral-700 rounded-lg overflow-hidden shadow-2xl"
          style={{ backgroundColor: "#111" }}
        >
          <div className="px-3 py-2 border-b border-neutral-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              Theme
            </span>
          </div>
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
                  className="w-3 h-3 rounded-full shrink-0 border border-neutral-600"
                  style={{ backgroundColor: theme.accent }}
                />
                <span className="text-xs font-mono text-neutral-300 truncate">
                  {theme.name}
                </span>
                {theme.id === activeId && (
                  <span className="ml-auto text-[10px] text-neutral-500">
                    ●
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-neutral-700 shadow-lg transition-all hover:border-neutral-500 hover:shadow-xl"
        style={{ backgroundColor: "#111" }}
      >
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: activeTheme.accent }}
        />
        <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider whitespace-nowrap">
          Změnit vzhled
        </span>
      </button>
    </div>
  );
}
