"use client";
import { useState, useEffect } from "react";

const API = "https://cure-you-backend-production.up.railway.app/api";

interface Hospital {
  id: number; name: string; area: string; type: string; beds: number;
  icu_beds: number; rating: number; reviews: number; accreditation: string;
  specialities: string; insurance: string; phone: string; emergency: number;
}

const TYPE_COLORS: Record<string, string> = {
  "Super Specialty": "#6C3FC5",
  "Multi Specialty": "#059669",
  "Government": "#d97706",
};

const TYPE_FILTERS = ["All", "Super Specialty", "Multi Specialty", "Government"];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("q", search);
    if (typeFilter) p.set("type", typeFilter);
    fetch(`${API}/hospitals?${p}`).then(r => r.json()).then(d => { setHospitals(d); setLoading(false); });
  }, [search, typeFilter]);

  const typeColor = (t: string) => TYPE_COLORS[t] || "#6C3FC5";

  const accreditBadge = (acc: string) => {
    if (!acc) return null;
    const config: Record<string, { bg: string; color: string }> = {
      NABH: { bg: "rgba(108,63,197,0.12)", color: "#6C3FC5" },
      NABL: { bg: "rgba(99,102,241,0.12)", color: "#4338ca" },
      JCI:  { bg: "rgba(110,231,183,0.18)", color: "#059669" },
    };
    return acc.split(",").map(a => a.trim()).map(a => {
      const key = Object.keys(config).find(k => a.includes(k));
      const style = key ? config[key] : { bg: "rgba(107,114,128,0.12)", color: "#6B7280" };
      return (
        <span key={a} style={{
          background: style.bg, color: style.color,
          padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700,
          letterSpacing: "0.03em",
        }}>{a}</span>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF" }}>
      {/* Header Bar */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #E5E0FF",
        padding: "28px 0 0",
        marginBottom: 32,
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 2px 12px rgba(108,63,197,0.06)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color: "#1E1B2E", margin: 0, lineHeight: 1.2 }}>
              Hospitals in Faridabad
            </h1>
            <p style={{ color: "#6B7280", fontSize: 13, margin: "4px 0 0" }}>
              NABH accredited &middot; Beds &amp; ICU count &middot; Insurance accepted
            </p>
          </div>

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", paddingBottom: 16, flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ position: "relative", flex: 1, minWidth: isMobile ? "100%" : 260, width: isMobile ? "100%" : undefined }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search hospitals, specialities..."
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "11px 16px 11px 40px",
                  border: "1.5px solid #E5E0FF", borderRadius: 10,
                  fontSize: 14, outline: "none", background: "#F8F7FF",
                  color: "#1E1B2E",
                }}
              />
            </div>

            {/* Type filter pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TYPE_FILTERS.map(t => {
                const active = (t === "All" && !typeFilter) || t === typeFilter;
                const val = t === "All" ? "" : t;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(val)}
                    style={{
                      padding: "9px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", border: "none", transition: "all 0.15s",
                      background: active ? "linear-gradient(135deg, #6C3FC5, #818CF8)" : "white",
                      color: active ? "white" : "#6B7280",
                      boxShadow: active ? "0 2px 8px rgba(108,63,197,0.25)" : "0 0 0 1.5px #E5E0FF",
                    }}
                  >{t}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 16px 40px" : "0 24px 48px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6B7280", fontSize: 15 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏥</div>
            Loading hospitals...
          </div>
        ) : hospitals.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#6B7280", fontSize: 15 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            No hospitals found. Try a different search.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, fontWeight: 500 }}>
              {hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""} found
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
              gap: isMobile ? 14 : 20,
            }}>
              {hospitals.map(h => {
                const color = typeColor(h.type);
                return (
                  <div
                    key={h.id}
                    className="card-hover"
                    style={{
                      background: "white",
                      border: "1px solid #E5E0FF",
                      borderRadius: 18,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 1px 4px rgba(108,63,197,0.07)",
                    }}
                  >
                    {/* Image Area */}
                    <div style={{
                      height: 160,
                      background: `linear-gradient(135deg, ${color}22, ${color}44)`,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 64, lineHeight: 1 }}>🏥</span>

                      {/* Type badge top-left */}
                      <div style={{
                        position: "absolute", top: 12, left: 12,
                        background: color,
                        color: "white",
                        fontSize: 11, fontWeight: 700,
                        padding: "4px 10px", borderRadius: 999,
                        letterSpacing: "0.02em",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                      }}>{h.type}</div>

                      {/* Emergency badge top-right */}
                      {h.emergency ? (
                        <div style={{
                          position: "absolute", top: 12, right: 12,
                          background: "#dc2626",
                          color: "white",
                          fontSize: 11, fontWeight: 700,
                          padding: "4px 10px", borderRadius: 999,
                          boxShadow: "0 2px 6px rgba(220,38,38,0.35)",
                        }}>🚨 Emergency</div>
                      ) : null}
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      {/* Name */}
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#1E1B2E", lineHeight: 1.3 }}>
                        {h.name}
                      </div>

                      {/* Area */}
                      <div style={{ fontSize: 13, color: "#6B7280" }}>
                        📍 {h.area}
                      </div>

                      {/* Accreditation badges */}
                      {h.accreditation && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {accreditBadge(h.accreditation)}
                        </div>
                      )}

                      {/* Specialities */}
                      {h.specialities && (
                        <div style={{
                          fontSize: 12, color: "#6B7280", lineHeight: 1.55,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {h.specialities}
                        </div>
                      )}

                      {/* Stats row */}
                      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                        <div style={{
                          flex: 1, textAlign: "center", padding: "8px 6px",
                          background: "rgba(108,63,197,0.07)", borderRadius: 10,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#6C3FC5" }}>⭐ {h.rating}</div>
                          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{h.reviews} reviews</div>
                        </div>
                        <div style={{
                          flex: 1, textAlign: "center", padding: "8px 6px",
                          background: "rgba(129,140,248,0.08)", borderRadius: 10,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#818CF8" }}>{h.beds || "—"}</div>
                          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>Total Beds</div>
                        </div>
                        <div style={{
                          flex: 1, textAlign: "center", padding: "8px 6px",
                          background: "rgba(110,231,183,0.12)", borderRadius: 10,
                        }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>{h.icu_beds || "—"}</div>
                          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>ICU Beds</div>
                        </div>
                      </div>

                      {/* Insurance */}
                      {h.insurance && (
                        <div style={{
                          fontSize: 11, color: "#6B7280",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          🏦 {h.insurance}
                        </div>
                      )}

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 4 }}>
                        {h.phone && (
                          <a
                            href={`tel:${h.phone}`}
                            style={{
                              flex: 1, padding: "10px 0", textAlign: "center",
                              background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                              color: "white", borderRadius: 10,
                              fontSize: 13, fontWeight: 700, textDecoration: "none",
                              boxShadow: "0 2px 8px rgba(108,63,197,0.28)",
                            }}
                          >📞 Call</a>
                        )}
                        <button style={{
                          flex: 1, padding: "10px 0",
                          border: "1.5px solid #E5E0FF",
                          background: "white", borderRadius: 10,
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                          color: "#6C3FC5",
                        }}>View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
