"use client";
import { useState, useEffect } from "react";

const API = "/api";

interface TestResult {
  lab_id: number; lab_name: string; area: string; price: number;
  rating: number; nabl_certified: number; home_collection: number;
  phone: string; turnaround_hours: number; test_name: string;
}

const POPULAR = [
  "CBC (Complete Blood Count)",
  "HbA1c",
  "Vitamin D (25-OH)",
  "Thyroid Profile (TSH, T3, T4)",
  "Lipid Profile",
  "LFT (Liver Function Test)",
  "KFT (Kidney Function Test)",
  "Blood Sugar Fasting",
];

const TEST_META: Record<string, { emoji: string; color1: string; color2: string; price: number }> = {
  "CBC (Complete Blood Count)":        { emoji: "🩸", color1: "#fce7f3", color2: "#f9a8d4", price: 199 },
  "HbA1c":                             { emoji: "🍬", color1: "#fef3c7", color2: "#fcd34d", price: 349 },
  "Vitamin D (25-OH)":                 { emoji: "☀️", color1: "#fef9c3", color2: "#fde047", price: 599 },
  "Thyroid Profile (TSH, T3, T4)":     { emoji: "⚖️", color1: "#ede9fe", color2: "#c4b5fd", price: 399 },
  "Lipid Profile":                     { emoji: "❤️", color1: "#fee2e2", color2: "#fca5a5", price: 299 },
  "LFT (Liver Function Test)":         { emoji: "🫀", color1: "#ffedd5", color2: "#fdba74", price: 499 },
  "KFT (Kidney Function Test)":        { emoji: "🫁", color1: "#cffafe", color2: "#67e8f9", price: 449 },
  "Blood Sugar Fasting":               { emoji: "💉", color1: "#dcfce7", color2: "#86efac", price: 99 },
};

export default function DiagnosticsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TestResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [nablTooltipId, setNablTooltipId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setSearched(true);
    const r = await fetch(`${API}/labs/compare?test=${encodeURIComponent(q)}`);
    setResults(await r.json());
    setLoading(false);
  };

  const handleAllowLocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setLocationGranted(false)
      );
    }
  };

  const cheapest = results.length ? results[0].price : 0;
  const expensive = results.length ? results[results.length - 1].price : 0;
  const saving = expensive - cheapest;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF" }}>
      {/* Header */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #E5E0FF",
        padding: "32px 0 28px",
        boxShadow: "0 2px 12px rgba(108,63,197,0.06)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: "#1E1B2E", margin: "0 0 6px" }}>
            Book Lab Tests
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>
            Same test. Different labs. Different prices. CureYou shows you all of them.
          </p>

          {/* Search bar */}
          <div style={{ display: "flex", gap: 10, maxWidth: 640, flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{
                position: "absolute", left: 16, top: "50%",
                transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none",
              }}>🧪</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search(query)}
                placeholder="e.g. CBC, Vitamin D, HbA1c, Thyroid..."
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "15px 18px 15px 46px",
                  border: "2px solid #E5E0FF", borderRadius: 14,
                  fontSize: 15, outline: "none", background: "#F8F7FF",
                  color: "#1E1B2E",
                }}
              />
            </div>
            <button
              onClick={() => search(query)}
              style={{
                background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                color: "white", padding: "15px 28px",
                borderRadius: 14, border: "none",
                fontWeight: 700, cursor: "pointer", fontSize: 15,
                boxShadow: "0 3px 12px rgba(108,63,197,0.3)",
                whiteSpace: "nowrap",
              }}
            >Compare</button>
          </div>

          {/* Why prices differ collapsible card */}
          <div style={{
            maxWidth: 640, marginTop: 14,
            background: "#F3EFFD",
            border: "1.5px solid #E5E0FF",
            borderRadius: 12,
            overflow: "hidden",
          }}>
            <button
              onClick={() => setWhyExpanded(p => !p)}
              style={{
                width: "100%", background: "none", border: "none",
                padding: "12px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 13, fontWeight: 700, color: "#6C3FC5",
                textAlign: "left",
              }}
            >
              <span>Why do lab prices vary so much?</span>
              <span style={{
                fontSize: 11,
                transform: whyExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                display: "inline-block",
              }}>▼</span>
            </button>
            {whyExpanded && (
              <div style={{
                padding: "0 16px 14px",
                fontSize: 13, color: "#4B5563", lineHeight: 1.65,
                borderTop: "1px solid #E5E0FF",
                paddingTop: 12,
              }}>
                Lab prices differ for a few key reasons: <strong>NABL certification</strong> requires expensive equipment audits and trained staff, adding to costs. <strong>Location</strong> affects rent and staffing — labs in prime areas charge more. <strong>Equipment quality</strong> varies — automated analysers give more accurate results but cost more to run. <strong>Home collection</strong> adds a convenience charge. Always balance price with certification and rating.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px 40px" : "32px 24px 48px" }}>
        {/* Popular tests horizontal scroll */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1E1B2E", marginBottom: 16 }}>
            Popular Tests
          </div>
          <div style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "none",
          }}>
            {POPULAR.map(t => {
              const meta = TEST_META[t];
              return (
                <button
                  key={t}
                  onClick={() => { setQuery(t); search(t); }}
                  className="card-hover"
                  style={{
                    background: `linear-gradient(135deg, ${meta.color1}, ${meta.color2})`,
                    border: "1.5px solid rgba(255,255,255,0.7)",
                    borderRadius: 16,
                    padding: "18px 14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    boxShadow: "0 1px 6px rgba(108,63,197,0.08)",
                    flexShrink: 0,
                    width: 160,
                  }}
                >
                  <span style={{ fontSize: 32, lineHeight: 1 }}>{meta.emoji}</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E1B2E", lineHeight: 1.3 }}>{t}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Starting ₹{meta.price}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location banner — shown whenever there are results or user is on the results area */}
        {(searched || results.length > 0) && (
          <div style={{
            marginBottom: 20,
            borderRadius: 12,
            padding: "12px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10,
            background: locationGranted
              ? "linear-gradient(90deg, #d1fae5, #a7f3d0)"
              : "linear-gradient(90deg, #EDE9FE, #DDD6FE)",
            border: `1.5px solid ${locationGranted ? "#6EE7B7" : "#C4B5FD"}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: locationGranted ? "#065F46" : "#4C1D95", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📍</span>
              {locationGranted
                ? "Showing labs near Faridabad"
                : "Enable location to see labs nearest to you"}
            </div>
            {!locationGranted && (
              <button
                onClick={handleAllowLocation}
                style={{
                  background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                  color: "white", border: "none",
                  borderRadius: 8, padding: "7px 16px",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(108,63,197,0.25)",
                }}
              >Allow Location</button>
            )}
          </div>
        )}

        {/* Savings Banner */}
        {searched && !loading && results.length > 1 && (
          <div style={{
            background: "linear-gradient(135deg, #1E1B2E, #2d1b5e)",
            borderRadius: isMobile ? 14 : 18, padding: isMobile ? "18px 18px" : "24px 28px",
            marginBottom: 20,
            display: "flex", alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 6, fontWeight: 600, letterSpacing: "0.04em" }}>
                PRICE RANGE FOR
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 8 }}>
                {results[0]?.test_name}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>
                ₹{cheapest}
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, margin: "0 10px" }}>to</span>
                ₹{expensive}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 8 }}>
                across {results.length} labs in Faridabad
              </div>
            </div>
            <div style={{
              background: "rgba(110,231,183,0.12)",
              border: "1.5px solid rgba(110,231,183,0.35)",
              borderRadius: 14, padding: "20px 28px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "#6EE7B7", fontWeight: 700, marginBottom: 6, letterSpacing: "0.06em" }}>
                MAX YOU CAN SAVE
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#6EE7B7", lineHeight: 1 }}>₹{saving}</div>
              <div style={{ fontSize: 11, color: "rgba(110,231,183,0.65)", marginTop: 6 }}>
                by choosing the cheapest NABL lab
              </div>
            </div>
          </div>
        )}

        {/* Price Breakdown Visual */}
        {searched && !loading && results.length > 1 && (
          <div style={{
            background: "white",
            border: "1.5px solid #E5E0FF",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E1B2E", marginBottom: 16 }}>
              Price Comparison
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.map((r, i) => {
                const barPct = expensive === cheapest ? 100 : Math.max(15, Math.round(((r.price - cheapest) / (expensive - cheapest)) * 85) + 15);
                const isMin = i === 0;
                const barColor = isMin ? "#6EE7B7" : i === results.length - 1 ? "#f87171" : "#818CF8";
                return (
                  <div key={`bar-${r.lab_id}-${i}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 130, fontSize: 12, color: "#4B5563", fontWeight: 600, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.lab_name}
                    </div>
                    <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 99, height: 10, overflow: "hidden" }}>
                      <div style={{
                        width: `${barPct}%`,
                        height: "100%",
                        background: barColor,
                        borderRadius: 99,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                    <div style={{ width: 52, textAlign: "right", fontSize: 13, fontWeight: 700, color: isMin ? "#059669" : "#1E1B2E", flexShrink: 0 }}>
                      ₹{r.price}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 16, fontSize: 11, color: "#9CA3AF" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: "#6EE7B7", display: "inline-block" }} /> Cheapest
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: "#818CF8", display: "inline-block" }} /> Mid-range
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: "#f87171", display: "inline-block" }} /> Most expensive
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6B7280", fontSize: 15 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
            Comparing prices...
          </div>
        ) : searched && results.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
            No results found. Try a different test name.
          </div>
        ) : results.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {results.map((r, i) => {
              const priceDiff = r.price - cheapest;
              const pctCostlier = cheapest > 0 ? Math.round(((r.price - cheapest) / cheapest) * 100) : 0;
              const saveVsExpensive = expensive - r.price;
              return (
                <div
                  key={`${r.lab_id}-${i}`}
                  className="card-hover"
                  style={{
                    background: "white",
                    border: `1.5px solid ${i === 0 ? "#6EE7B7" : "#E5E0FF"}`,
                    borderRadius: 16, padding: "0",
                    display: "flex", overflow: "hidden",
                    boxShadow: i === 0 ? "0 2px 12px rgba(5,150,105,0.1)" : "0 1px 4px rgba(108,63,197,0.06)",
                    position: "relative",
                    flexDirection: "column",
                  }}
                >
                  {/* Best Price banner for cheapest */}
                  {i === 0 && (
                    <div style={{
                      background: "linear-gradient(90deg, #059669, #6EE7B7)",
                      padding: "7px 18px",
                      fontSize: 11, fontWeight: 800, color: "white",
                      letterSpacing: "0.08em",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ fontSize: 14 }}>🏆</span> BEST PRICE
                    </div>
                  )}

                  <div style={{ display: "flex", overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
                    {/* Lab icon */}
                    <div style={{
                      width: isMobile ? "100%" : 80, minWidth: isMobile ? undefined : 80, height: isMobile ? 64 : undefined,
                      background: i === 0 ? "linear-gradient(135deg, #dcfce7, #a7f3d0)" : "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 32 }}>🔬</span>
                    </div>

                    {/* Main content */}
                    <div style={{
                      flex: 1, padding: isMobile ? "14px 16px" : "18px 20px",
                      display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexWrap: "wrap",
                      flexDirection: isMobile ? "column" : "row",
                    }}>
                      <div style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                          <span style={{ fontWeight: 800, fontSize: 16, color: "#1E1B2E" }}>{r.lab_name}</span>
                          {r.nabl_certified ? (
                            <span
                              onMouseEnter={() => setNablTooltipId(r.lab_id)}
                              onMouseLeave={() => setNablTooltipId(null)}
                              style={{
                                position: "relative",
                                background: "rgba(108,63,197,0.1)", color: "#6C3FC5",
                                fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700,
                                cursor: "default",
                              }}
                            >
                              NABL
                              {nablTooltipId === r.lab_id && (
                                <div style={{
                                  position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                                  transform: "translateX(-50%)",
                                  background: "#1E1B2E", color: "white",
                                  fontSize: 11, fontWeight: 500,
                                  padding: "7px 12px", borderRadius: 8,
                                  whiteSpace: "nowrap",
                                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                                  zIndex: 10,
                                  lineHeight: 1.5,
                                  pointerEvents: "none",
                                }}>
                                  NABL = National Accreditation Board for Testing.<br />Certified quality.
                                  <div style={{
                                    position: "absolute", top: "100%", left: "50%",
                                    transform: "translateX(-50%)",
                                    width: 0, height: 0,
                                    borderLeft: "5px solid transparent",
                                    borderRight: "5px solid transparent",
                                    borderTop: "5px solid #1E1B2E",
                                  }} />
                                </div>
                              )}
                            </span>
                          ) : null}
                          {r.home_collection ? (
                            <span style={{
                              background: "rgba(99,102,241,0.1)", color: "#4338ca",
                              fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700,
                            }}>🏠 Home Collection</span>
                          ) : null}
                          {i === 0 && (
                            <span style={{
                              background: "rgba(5,150,105,0.12)", color: "#059669",
                              fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700,
                            }}>Cheapest</span>
                          )}
                          {i > 0 && (
                            <span style={{
                              background: "rgba(220,38,38,0.08)", color: "#dc2626",
                              fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 700,
                            }}>{pctCostlier}% costlier</span>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 3 }}>📍 {r.area}</div>
                        <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                          ⭐ {r.rating}&nbsp;&nbsp;⏱ Results in {r.turnaround_hours}h
                        </div>
                      </div>

                      {/* Price + Book */}
                      <div style={{ textAlign: isMobile ? "left" : "right", minWidth: isMobile ? "100%" : 130, display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-end", justifyContent: isMobile ? "space-between" : undefined }}>
                        <div style={{
                          fontSize: 30, fontWeight: 800, lineHeight: 1,
                          color: i === 0 ? "#059669" : "#1E1B2E",
                          marginBottom: 3,
                        }}>₹{r.price}</div>
                        {i > 0 ? (
                          <div style={{ fontSize: 11, color: "#dc2626", marginBottom: 4, fontWeight: 600 }}>
                            ₹{priceDiff} more expensive
                          </div>
                        ) : (
                          saveVsExpensive > 0 && (
                            <div style={{ fontSize: 11, color: "#059669", marginBottom: 4, fontWeight: 600 }}>
                              You save ₹{saveVsExpensive} vs most expensive
                            </div>
                          )
                        )}
                        <button style={{
                          marginTop: 6,
                          padding: "9px 20px",
                          background: i === 0
                            ? "linear-gradient(135deg, #6C3FC5, #818CF8)"
                            : "white",
                          color: i === 0 ? "white" : "#6C3FC5",
                          border: "1.5px solid #E5E0FF",
                          borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                          boxShadow: i === 0 ? "0 2px 8px rgba(108,63,197,0.25)" : "none",
                        }}>Book Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Rich empty state — shown before any search */}
        {!searched && (
          <>
            {/* Why Compare? Stats Bar */}
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: isMobile ? 10 : 16, marginBottom: isMobile ? 28 : 40,
            }}>
              {[
                { emoji: "🧪", value: "500+", label: "Tests Available", color: "#6C3FC5", bg: "#EDE9FE" },
                { emoji: "🏥", value: "14", label: "NABL Certified Labs", color: "#059669", bg: "#D1FAE5" },
                { emoji: "💰", value: "Up to 60%", label: "Savings vs MRP", color: "#d97706", bg: "#FEF3C7" },
                { emoji: "🏠", value: "Free", label: "Home Collection", color: "#dc2626", bg: "#FEE2E2" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "white", border: `1.5px solid ${s.bg}`,
                  borderRadius: 16, padding: "20px 18px",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 1px 6px rgba(108,63,197,0.06)",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, background: s.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>{s.emoji}</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Health Packages */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#1E1B2E" }}>Featured Health Packages</div>
                  <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Pre-bundled tests · Massive savings vs individual booking</div>
                </div>
                <span style={{
                  background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                  color: "white", fontSize: 11, fontWeight: 700,
                  padding: "5px 14px", borderRadius: 999,
                }}>NABL Certified</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
                {[
                  { emoji: "🔬", name: "Full Body Checkup", tests: 72, price: 599, was: 1299, color: "#6C3FC5", bg: "#EDE9FE", tag: "Best Value" },
                  { emoji: "🩸", name: "Diabetes Panel", tests: 8, price: 349, was: 799, color: "#dc2626", bg: "#FEE2E2", tag: "Most Booked" },
                  { emoji: "❤️", name: "Heart Health", tests: 12, price: 799, was: 1599, color: "#e11d48", bg: "#FFE4E6", tag: "Trending" },
                  { emoji: "☀️", name: "Vitamin Profile", tests: 6, price: 499, was: 999, color: "#d97706", bg: "#FEF3C7", tag: "Essential" },
                ].map(pkg => (
                  <div key={pkg.name} className="card-hover" style={{
                    background: "white", border: "1.5px solid #E5E0FF",
                    borderRadius: 18, overflow: "hidden", cursor: "pointer",
                  }}>
                    <div style={{
                      height: 130, background: pkg.bg, position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52,
                    }}>
                      {pkg.emoji}
                      <div style={{
                        position: "absolute", top: 10, left: 0,
                        background: pkg.color, color: "white",
                        fontSize: 10, fontWeight: 800, padding: "4px 12px 4px 8px",
                        borderRadius: "0 999px 999px 0",
                      }}>{pkg.tag}</div>
                      <div style={{
                        position: "absolute", top: 10, right: 12,
                        background: "rgba(30,27,46,0.75)", color: "white",
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                      }}>{Math.round((1 - pkg.price / pkg.was) * 100)}% off</div>
                    </div>
                    <div style={{ padding: "16px 16px 18px" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1E1B2E", marginBottom: 4 }}>{pkg.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>Includes {pkg.tests} tests · Home collection available</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ fontSize: 22, fontWeight: 800, color: "#1E1B2E" }}>₹{pkg.price}</span>
                          <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 6, textDecoration: "line-through" }}>₹{pkg.was}</span>
                        </div>
                        <button
                          onClick={() => { setQuery(pkg.name); search(pkg.name); }}
                          style={{
                            background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                            color: "white", fontSize: 12, fontWeight: 700,
                            padding: "8px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(108,63,197,0.25)",
                          }}
                        >Compare Labs →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div style={{
              background: "white", border: "1.5px solid #E5E0FF",
              borderRadius: 20, padding: "28px 28px 24px", marginBottom: 40,
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1E1B2E", marginBottom: 20 }}>
                How CureYou Lab Comparison Works
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 16 : 20 }}>
                {[
                  { step: "1", emoji: "🔍", title: "Search Your Test", desc: "Type CBC, HbA1c, Thyroid, Vitamin D or any test above. We search all Faridabad labs instantly." },
                  { step: "2", emoji: "📊", title: "Compare All Labs", desc: "See every certified lab's price side by side, with ratings, location, turnaround time, and NABL status." },
                  { step: "3", emoji: "💰", title: "Save Big", desc: "Pick the lab that fits your budget and location. Save up to 60% vs walk-in rates. Home collection available." },
                ].map(item => (
                  <div key={item.step} style={{ textAlign: "center" }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16, margin: "0 auto 12px",
                      background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                    }}>{item.emoji}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1E1B2E", marginBottom: 6 }}>
                      <span style={{ color: "#6C3FC5", marginRight: 6 }}>Step {item.step}.</span>{item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Labs Strip */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Labs available on CureYou
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Dr. Lal PathLabs", "SRL Diagnostics", "Thyrocare", "Aggarwal Diagnostic", "Faridabad Pathology", "Metro Lab", "HealthFirst"].map(lab => (
                  <div key={lab} style={{
                    background: "white", border: "1px solid #E5E0FF", borderRadius: 10,
                    padding: "8px 16px", fontSize: 13, color: "#4B5563", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 14 }}>🔬</span> {lab}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
