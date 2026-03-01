"use client";

import { useState, useEffect } from "react";
import { Share_Tech_Mono, Saira_Condensed } from "next/font/google";
import Link from "next/link";
import { articles, allTags } from "@/lib/mockData";

const shareTech = Share_Tech_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono" });
const saira = Saira_Condensed({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-saira" });

/* ─── helpers ─── */
const wordCount = (t: string) => t.split(/\s+/).length;
const sentiment = (i: number) => [0.82, 0.67, 0.91, 0.74, 0.58][i % 5];
const sentimentLabel = (s: number) => (s >= 0.8 ? "POSITIVE" : s >= 0.65 ? "NEUTRAL" : "MIXED");
const sentimentColor = (s: number) => (s >= 0.8 ? "#39ff14" : s >= 0.65 ? "#ff9800" : "#ff0066");
const sourceIcon = (t: string) => ({ youtube: "YT", twitter: "TW", web: "WEB", podcast: "POD" }[t] ?? "?");
const pad = (n: number) => String(n).padStart(2, "0");
const fakeMemory = () => `${(Math.random() * 2 + 6).toFixed(1)}GB / 16GB`;
const fakeCpu = () => `${(Math.random() * 30 + 40).toFixed(0)}%`;
const fakeLatency = () => `${(Math.random() * 20 + 8).toFixed(0)}ms`;

export default function CyberpunkDataTerminal() {
  const [lang, setLang] = useState<"cz" | "en">("cz");
  const [clock, setClock] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState(0);
  const [mem, setMem] = useState("7.2GB / 16GB");
  const [cpu, setCpu] = useState("52%");
  const [lat, setLat] = useState("12ms");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setMem(fakeMemory());
      setCpu(fakeCpu());
      setLat(fakeLatency());
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const filtered = activeTag ? articles.filter((a) => a.tags.includes(activeTag)) : articles;
  const featured = filtered[selectedArticle] ?? filtered[0];
  const tagCounts: Record<string, number> = {};
  allTags.forEach((t) => { tagCounts[t] = articles.filter((a) => a.tags.includes(t)).length; });

  const title = (a: typeof articles[0]) => (lang === "en" ? a.titleEn : a.title);
  const excerpt = (a: typeof articles[0]) => (lang === "en" ? a.excerptEn : a.excerpt);

  /* sparkline as tiny inline SVG */
  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * 60},${20 - ((v - min) / range) * 18}`).join(" ");
    return (
      <svg width="60" height="20" viewBox="0 0 60 20" style={{ verticalAlign: "middle" }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  };

  /* CSS mini bar */
  const MiniBar = ({ pct, color }: { pct: number; color: string }) => (
    <div style={{ width: 60, height: 6, background: "#1a1f2e", display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color }} />
    </div>
  );

  /* ticker headlines */
  const tickerItems = articles.flatMap((a, i) => [
    { text: title(a), breaking: i === 0 },
    { text: `SRC:${a.sources.length}`, breaking: false },
  ]);
  const tickerText = tickerItems
    .map((t) => (t.breaking ? `[!] ${t.text}` : t.text))
    .join("  ///  ");

  return (
    <div className={`${shareTech.variable} ${saira.variable}`} style={{
      fontFamily: "var(--font-mono), monospace",
      background: "#0a0e14",
      color: "#b0b8c8",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontSize: "0.78rem",
      lineHeight: 1.4,
      overflow: "hidden",
      height: "100vh",
    }}>

      {/* ═══ TOP BAR ═══ */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 10px",
        background: "#0d1117",
        borderBottom: "1px solid #39ff1440",
        flexShrink: 0,
        gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ color: "#ff0066", textDecoration: "none", fontWeight: 700 }}>
            &larr; EXIT
          </Link>
          <span style={{ color: "#39ff14", fontFamily: "var(--font-saira), sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: 2 }}>
            BEROU N&Aacute;M PR&Aacute;CI v2.0
          </span>
          <span style={{ color: "#0088ff" }}>&#9608; DATA TERMINAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#555", fontSize: "0.7rem" }}>
            [F1]&nbsp;Help&nbsp; [F2]&nbsp;Feed&nbsp; [F3]&nbsp;Models&nbsp; [F5]&nbsp;Refresh
          </span>
          <span style={{ color: "#39ff14", letterSpacing: 2, fontWeight: 700 }}>{clock}</span>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#39ff14", boxShadow: "0 0 6px #39ff14" }} />
          <span style={{ color: "#555" }}>ONLINE</span>
          <button
            onClick={() => setLang(lang === "cz" ? "en" : "cz")}
            style={{
              background: "none", border: "1px solid #39ff1460", color: "#39ff14",
              padding: "1px 8px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.72rem",
            }}
          >
            {lang === "cz" ? "CZ" : "EN"}
          </button>
        </div>
      </header>

      {/* ═══ SCROLLING TICKER ═══ */}
      <div style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        borderBottom: "1px solid #ff006640",
        padding: "2px 0",
        background: "#0d1117",
        flexShrink: 0,
      }}>
        <div style={{
          display: "inline-block",
          animation: "tickerScroll 45s linear infinite",
        }}>
          {tickerItems.map((t, i) => (
            <span key={i} style={{ color: t.breaking ? "#ff0066" : "#b0b8c8", marginRight: 24 }}>
              {t.breaking && <span style={{ background: "#ff0066", color: "#0a0e14", padding: "0 4px", marginRight: 4, fontWeight: 700, fontSize: "0.68rem" }}>BREAK</span>}
              {t.text}
            </span>
          ))}
          {/* duplicate for seamless loop */}
          {tickerItems.map((t, i) => (
            <span key={`d${i}`} style={{ color: t.breaking ? "#ff0066" : "#b0b8c8", marginRight: 24 }}>
              {t.breaking && <span style={{ background: "#ff0066", color: "#0a0e14", padding: "0 4px", marginRight: 4, fontWeight: 700, fontSize: "0.68rem" }}>BREAK</span>}
              {t.text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "180px 1fr 280px",
        overflow: "hidden",
        minHeight: 0,
      }}>

        {/* ─── LEFT PANEL ─── */}
        <aside style={{
          borderRight: "1px solid #39ff1430",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Tags */}
          <div style={{ borderBottom: "1px solid #39ff1430", flex: 1, overflow: "auto" }}>
            <div style={{
              background: "#39ff14",
              color: "#0a0e14",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.7rem",
              fontFamily: "var(--font-saira), sans-serif",
              letterSpacing: 1,
            }}>
              &#9508; TAG FILTER &#9500;
            </div>
            <div style={{ padding: 4 }}>
              <button
                onClick={() => { setActiveTag(null); setSelectedArticle(0); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: activeTag === null ? "#39ff1420" : "transparent",
                  border: activeTag === null ? "1px solid #39ff1460" : "1px solid transparent",
                  color: activeTag === null ? "#39ff14" : "#556",
                  padding: "2px 6px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.72rem",
                  marginBottom: 1,
                }}
              >
                ALL [{articles.length}]
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setActiveTag(tag); setSelectedArticle(0); }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: activeTag === tag ? "#39ff1420" : "transparent",
                    border: activeTag === tag ? "1px solid #39ff1460" : "1px solid transparent",
                    color: activeTag === tag ? "#39ff14" : "#556",
                    padding: "2px 6px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.72rem",
                    marginBottom: 1,
                  }}
                >
                  {tag.toUpperCase()} [{tagCounts[tag]}]
                </button>
              ))}
            </div>
          </div>

          {/* Model Status */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              background: "#0088ff",
              color: "#0a0e14",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.7rem",
              fontFamily: "var(--font-saira), sans-serif",
              letterSpacing: 1,
            }}>
              &#9508; MODEL STATUS &#9500;
            </div>
            <div style={{ padding: 6 }}>
              {["GPT-4o", "Gemini", "Llama"].map((m, i) => (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.72rem" }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#39ff14",
                    boxShadow: "0 0 4px #39ff14",
                    animation: "blink 2s infinite",
                    animationDelay: `${i * 0.3}s`,
                    display: "inline-block",
                  }} />
                  <span style={{ color: "#b0b8c8" }}>{m}</span>
                  <span style={{ color: "#39ff14", marginLeft: "auto", fontSize: "0.65rem" }}>ONLINE</span>
                </div>
              ))}
              <div style={{ color: "#333", fontSize: "0.65rem", marginTop: 6, borderTop: "1px solid #1a1f2e", paddingTop: 4 }}>
                UPTIME 99.97%<br />
                LAST SYNC {clock}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              background: "#ff9800",
              color: "#0a0e14",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.7rem",
              fontFamily: "var(--font-saira), sans-serif",
              letterSpacing: 1,
            }}>
              &#9508; QUICK STATS &#9500;
            </div>
            <div style={{ padding: 6, fontSize: "0.7rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ color: "#556" }}>ARTICLES</span>
                <span style={{ color: "#39ff14" }}>{articles.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ color: "#556" }}>SOURCES</span>
                <span style={{ color: "#0088ff" }}>{articles.reduce((s, a) => s + a.sources.length, 0)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ color: "#556" }}>WORDS</span>
                <span style={{ color: "#ff9800" }}>{articles.reduce((s, a) => s + wordCount(a.content), 0).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ color: "#556" }}>AI COMMENTS</span>
                <span style={{ color: "#ff0066" }}>{articles.reduce((s, a) => s + a.aiComments.length, 0)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#556" }}>AVG READ</span>
                <span style={{ color: "#b0b8c8" }}>{(articles.reduce((s, a) => s + a.readTime, 0) / articles.length).toFixed(1)}m</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── CENTER PANEL: ARTICLE FEED ─── */}
        <main style={{ display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid #39ff1430" }}>
          <div style={{
            background: "#39ff14",
            color: "#0a0e14",
            padding: "2px 8px",
            fontWeight: 700,
            fontSize: "0.7rem",
            fontFamily: "var(--font-saira), sans-serif",
            letterSpacing: 1,
            flexShrink: 0,
          }}>
            &#9508; ARTICLE FEED &#9500;&nbsp;&nbsp;&nbsp;
            <span style={{ fontWeight: 400 }}>SHOWING {filtered.length} / {articles.length}</span>
            &nbsp;&nbsp;&nbsp;{activeTag && <span>FILTER: {activeTag.toUpperCase()}</span>}
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 0 }}>
            {/* Featured Article Detail */}
            {featured && (
              <div style={{ borderBottom: "1px solid #39ff1430", padding: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{
                    background: "#ff006620",
                    border: "1px solid #ff006660",
                    color: "#ff0066",
                    padding: "1px 6px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    #{String(selectedArticle + 1).padStart(3, "0")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontFamily: "var(--font-saira), sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#e0e8f0",
                      margin: 0,
                      lineHeight: 1.25,
                    }}>
                      {title(featured)}
                    </h2>
                  </div>
                </div>

                {/* metadata grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "2px 12px",
                  marginTop: 8,
                  padding: "6px 8px",
                  background: "#0d1117",
                  border: "1px solid #1a1f2e",
                  fontSize: "0.7rem",
                }}>
                  <div><span style={{ color: "#556" }}>DATE</span> <span style={{ color: "#0088ff" }}>{featured.date}</span></div>
                  <div><span style={{ color: "#556" }}>READ</span> <span style={{ color: "#ff9800" }}>{featured.readTime}min</span> <MiniBar pct={featured.readTime * 15} color="#ff9800" /></div>
                  <div><span style={{ color: "#556" }}>WORDS</span> <span style={{ color: "#b0b8c8" }}>{wordCount(featured.content)}</span></div>
                  <div><span style={{ color: "#556" }}>SOURCES</span> <span style={{ color: "#0088ff" }}>{featured.sources.length}</span></div>
                  <div>
                    <span style={{ color: "#556" }}>SENTIMENT</span>{" "}
                    <span style={{ color: sentimentColor(sentiment(selectedArticle)) }}>
                      {sentiment(selectedArticle).toFixed(2)} {sentimentLabel(sentiment(selectedArticle))}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#556" }}>TREND</span>{" "}
                    <Sparkline data={[3, 5, 4, 7, 6, 8, 9, 7, 10, 12]} color="#39ff14" />
                  </div>
                </div>

                {/* tags */}
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {featured.tags.map((t) => (
                    <span key={t} style={{
                      background: "#39ff1415",
                      border: "1px solid #39ff1440",
                      color: "#39ff14",
                      padding: "0 5px",
                      fontSize: "0.65rem",
                    }}>
                      {t.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* excerpt */}
                <p style={{ margin: "8px 0 0", color: "#8090a0", fontSize: "0.76rem", lineHeight: 1.5 }}>
                  {excerpt(featured)}
                </p>

                {/* sources list */}
                <div style={{ marginTop: 8, fontSize: "0.68rem" }}>
                  <span style={{ color: "#556" }}>SOURCES ═══</span>
                  {featured.sources.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, marginTop: 2 }}>
                      <span style={{
                        background: s.type === "youtube" ? "#ff000030" : s.type === "twitter" ? "#0088ff30" : s.type === "podcast" ? "#ff980030" : "#39ff1430",
                        color: s.type === "youtube" ? "#ff4444" : s.type === "twitter" ? "#0088ff" : s.type === "podcast" ? "#ff9800" : "#39ff14",
                        padding: "0 4px",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                      }}>
                        {sourceIcon(s.type)}
                      </span>
                      <span style={{ color: "#7080a0" }}>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Article List */}
            <div>
              <div style={{
                background: "#0d1117",
                padding: "2px 8px",
                fontSize: "0.65rem",
                color: "#556",
                borderBottom: "1px solid #1a1f2e",
                display: "grid",
                gridTemplateColumns: "40px 1fr 70px 50px 60px 50px",
                gap: 4,
              }}>
                <span>IDX</span>
                <span>TITLE</span>
                <span>DATE</span>
                <span>WORDS</span>
                <span>SENT.</span>
                <span>READ</span>
              </div>
              {filtered.map((a, i) => {
                const s = sentiment(i);
                return (
                  <div
                    key={a.slug}
                    onClick={() => setSelectedArticle(i)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 70px 50px 60px 50px",
                      gap: 4,
                      padding: "3px 8px",
                      cursor: "pointer",
                      background: selectedArticle === i ? "#39ff1410" : i % 2 === 0 ? "#0a0e14" : "#0d1117",
                      borderLeft: selectedArticle === i ? "2px solid #39ff14" : "2px solid transparent",
                      fontSize: "0.72rem",
                    }}
                  >
                    <span style={{ color: "#333" }}>#{String(i + 1).padStart(3, "0")}</span>
                    <span style={{
                      color: selectedArticle === i ? "#39ff14" : "#b0b8c8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {i === 0 && <span style={{ color: "#ff0066", marginRight: 4, fontSize: "0.6rem", fontWeight: 700 }}>[!]</span>}
                      {title(a)}
                    </span>
                    <span style={{ color: "#556" }}>{a.date.slice(5)}</span>
                    <span style={{ color: "#7080a0" }}>{wordCount(a.content)}</span>
                    <span style={{ color: sentimentColor(s), fontSize: "0.68rem" }}>{s.toFixed(2)}</span>
                    <span style={{ color: "#ff9800" }}>{a.readTime}m</span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ─── RIGHT PANEL ─── */}
        <aside style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Analysis Feed */}
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{
              background: "#ff0066",
              color: "#0a0e14",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.7rem",
              fontFamily: "var(--font-saira), sans-serif",
              letterSpacing: 1,
              flexShrink: 0,
            }}>
              &#9508; ANALYSIS FEED &#9500;
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 0 }}>
              {featured?.aiComments.map((c, i) => (
                <div key={i} style={{
                  padding: "6px 8px",
                  borderBottom: "1px solid #1a1f2e",
                  background: i % 2 === 0 ? "#0a0e14" : "#0d1117",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{
                      color: c.model === "GPT-4o" ? "#39ff14" : c.model === "Gemini" ? "#0088ff" : "#ff9800",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                    }}>
                      {c.avatar} {c.model}
                    </span>
                    <span style={{ color: "#333", fontSize: "0.6rem" }}>{featured.date} {clock}</span>
                  </div>
                  <p style={{ margin: 0, color: "#7080a0", fontSize: "0.72rem", lineHeight: 1.4 }}>
                    {lang === "en" ? c.comment : c.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Source Breakdown */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              background: "#0088ff",
              color: "#0a0e14",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.7rem",
              fontFamily: "var(--font-saira), sans-serif",
              letterSpacing: 1,
            }}>
              &#9508; SOURCE MATRIX &#9500;
            </div>
            <div style={{ padding: 6, fontSize: "0.7rem" }}>
              {(["web", "youtube", "twitter", "podcast"] as const).map((type) => {
                const count = articles.reduce((s, a) => s + a.sources.filter((src) => src.type === type).length, 0);
                const total = articles.reduce((s, a) => s + a.sources.length, 0);
                const pct = Math.round((count / total) * 100);
                const colors: Record<string, string> = { web: "#39ff14", youtube: "#ff4444", twitter: "#0088ff", podcast: "#ff9800" };
                return (
                  <div key={type} style={{ marginBottom: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                      <span style={{ color: colors[type] }}>{type.toUpperCase()}</span>
                      <span style={{ color: "#556" }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 4, background: "#1a1f2e" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: colors[type] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Sparklines */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              background: "#ff9800",
              color: "#0a0e14",
              padding: "2px 8px",
              fontWeight: 700,
              fontSize: "0.7rem",
              fontFamily: "var(--font-saira), sans-serif",
              letterSpacing: 1,
            }}>
              &#9508; ACTIVITY &#9500;
            </div>
            <div style={{ padding: 6, fontSize: "0.68rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: "#556" }}>ARTICLES/DAY</span>
                <Sparkline data={[1, 3, 2, 4, 1, 3, 5, 2, 4, 3]} color="#39ff14" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: "#556" }}>SENTIMENT</span>
                <Sparkline data={[0.7, 0.8, 0.6, 0.9, 0.75, 0.82, 0.68, 0.91, 0.77, 0.85]} color="#0088ff" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#556" }}>SOURCES</span>
                <Sparkline data={[2, 4, 3, 5, 3, 4, 6, 3, 5, 4]} color="#ff9800" />
              </div>
            </div>
          </div>

          {/* Data Readout */}
          <div style={{ flexShrink: 0, padding: 6, borderTop: "1px solid #1a1f2e", fontSize: "0.65rem", color: "#333" }}>
            <div>&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;&#9552;</div>
            <div>FEED REFRESH: 30s</div>
            <div>CACHE HIT: 94.2%</div>
            <div>API CALLS: 1,247</div>
            <div>ERRORS: <span style={{ color: "#39ff14" }}>0</span></div>
          </div>
        </aside>
      </div>

      {/* ═══ BOTTOM BAR ═══ */}
      <footer style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px 10px",
        background: "#0d1117",
        borderTop: "1px solid #39ff1440",
        fontSize: "0.65rem",
        flexShrink: 0,
        gap: 8,
      }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span><span style={{ color: "#556" }}>SYS</span> <span style={{ color: "#39ff14" }}>OK</span></span>
          <span><span style={{ color: "#556" }}>MEM</span> <span style={{ color: "#ff9800" }}>{mem}</span></span>
          <span><span style={{ color: "#556" }}>CPU</span> <span style={{ color: "#0088ff" }}>{cpu}</span></span>
          <span><span style={{ color: "#556" }}>LAT</span> <span style={{ color: "#39ff14" }}>{lat}</span></span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <span><span style={{ color: "#556" }}>CONN</span> <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#39ff14", verticalAlign: "middle" }} /> <span style={{ color: "#39ff14" }}>STABLE</span></span>
          <span><span style={{ color: "#556" }}>FEED</span> <span style={{ color: "#0088ff" }}>LIVE</span></span>
          <span style={{ color: "#333" }}>BNP-TERMINAL v9.0.1 // {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* ═══ KEYFRAMES ═══ */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0e14; }
        ::-webkit-scrollbar-thumb { background: #39ff1440; }
        ::-webkit-scrollbar-thumb:hover { background: #39ff1480; }
        * { scrollbar-width: thin; scrollbar-color: #39ff1440 #0a0e14; }
      `}</style>
    </div>
  );
}
