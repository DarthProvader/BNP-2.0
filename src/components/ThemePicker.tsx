"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const themes = [
  {
    id: "11",
    route: "/",
    name: "Brutalist Dark",
    accent: "#ff2222",
    bg: "#0a0a0a",
  },
  {
    id: "1",
    route: "/1",
    name: "Concrete Monolith",
    accent: "#0055ff",
    bg: "#1a1a18",
  },
  {
    id: "4",
    route: "/4",
    name: "Classified",
    accent: "#cc0000",
    bg: "#2c2416",
  },
  {
    id: "6",
    route: "/6",
    name: "Akira Neon",
    accent: "#00f0ff",
    bg: "#0a0014",
  },
  {
    id: "7",
    route: "/7",
    name: "Holographic HUD",
    accent: "#00e5ff",
    bg: "#030a0f",
  },
  {
    id: "10",
    route: "/10",
    name: "Manga Panel",
    accent: "#e60012",
    bg: "#0a0a0a",
  },
];

function getActiveTheme(pathname: string): string {
  // Check if we're on a detail page like /6/some-slug
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] || "";

  if (pathname === "/") return "11";
  if (["1", "4", "6", "7", "10", "11"].includes(firstSegment))
    return firstSegment;
  return "11";
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
    // If we're on a listing page, go to the theme's listing
    // If we're on an article detail, swap the version prefix
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length >= 2 && segments[0] !== theme.id) {
      // Article detail page - swap version prefix
      const slug = segments.slice(1).join("/");
      const targetPrefix = theme.id === "11" ? "11" : theme.id;
      router.push(`/${targetPrefix}/${slug}`);
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
