"use client";
import { useState, useEffect } from "react";

const API = "https://cure-you-backend-production.up.railway.app/api";

interface Hospital {
  id: number; name: string; area: string; type: string; beds: number;
  icu_beds: number; rating: number; reviews: number; accreditation: string;
  specialities: string; insurance: string; phone: string; emergency: number;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("q", search);
    if (typeFilter) p.set("type", typeFilter);
    fetch(`${API}/hospitals?${p}`).then(r => r.json()).then(d => { setHospitals(d); setLoading(false); });
  }, [search, typeFilter]);

  const accreditBadge = (acc: string) => {
    if (!acc) return null;
    const colors: Record<string, string> = { NABH: "#6C3FC5", NABL: "#818CF8", JCI: "#6EE7B7", Government: "#6B7280" };
    return acc.split(",").map(a => a.trim()).map(a => {
      const key = Object.keys(colors).find(k => a.includes(k)) || "Government";
      return <span key={a} style={{ background: `rgba(${key === "JCI" ? "110,231,183" : key === "NABL" ? "129,140,248" : "108,63,197"},0.12)`, color: colors[key], padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, marginRight: 4 }}>{a}</span>;
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 8 }}>Hospitals in Faridabad</h1>
        <p style={{ color: "#6B7280" }}>NABH accredited · Beds & ICU count · Insurance accepted</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hospitals, specialities..." style={{ flex: 1, minWidth: 280, padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "white" }} />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, background: "white", minWidth: 180 }}>
          <option value="">All Types</option>
          <option value="Super Specialty">Super Specialty</option>
          <option value="Multi Specialty">Multi Specialty</option>
          <option value="Government">Government</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>Loading hospitals...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {hospitals.map(h => (
            <div key={h.id} className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E1B2E" }}>{h.name}</h3>
                    {h.emergency ? <span style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>🚨 24/7 Emergency</span> : null}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>📍 {h.area}</div>
                  <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <span style={{ background: "rgba(108,63,197,0.08)", color: "#6C3FC5", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500 }}>{h.type}</span>
                    {accreditBadge(h.accreditation)}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                    <strong>Specialities:</strong> {h.specialities?.slice(0, 100)}{h.specialities?.length > 100 ? "..." : ""}
                  </div>
                  {h.insurance && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>🏦 <strong>Insurance:</strong> {h.insurance?.slice(0, 80)}...</div>}
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                  {[
                    { label: "Rating", val: `${h.rating}★`, sub: `${h.reviews} reviews`, color: "#6C3FC5" },
                    { label: "Total Beds", val: h.beds || "N/A", color: "#818CF8" },
                    { label: "ICU Beds", val: h.icu_beds || "N/A", color: "#6EE7B7" },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: "center", padding: "14px 16px", background: "#F8F7FF", borderRadius: 12, minWidth: 80 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{s.label}</div>
                      {s.sub && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{s.sub}</div>}
                    </div>
                  ))}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {h.phone && <a href={`tel:${h.phone}`} style={{ padding: "10px 16px", background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>📞 Call</a>}
                    <button style={{ padding: "10px 16px", border: "1px solid #E5E0FF", background: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#6C3FC5" }}>View Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
