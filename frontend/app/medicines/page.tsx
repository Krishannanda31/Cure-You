"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:5001/api";

interface Medicine {
  id: number; brand_name: string; generic_name: string; manufacturer: string;
  type: string; brand_price: number; generic_price: number; jan_aushadhi_price: number;
  category: string; requires_prescription: number; substitutes?: Medicine[];
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedData, setExpandedData] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/medicines/categories`).then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("q", search);
    if (category) p.set("category", category);
    fetch(`${API}/medicines?${p}`).then(r => r.json()).then(d => { setMedicines(d); setLoading(false); });
  }, [search, category]);

  const toggle = async (id: number) => {
    if (expanded === id) { setExpanded(null); setExpandedData(null); return; }
    setExpanded(id);
    const r = await fetch(`${API}/medicines/${id}`);
    setExpandedData(await r.json());
  };

  const savings = (m: Medicine) => m.brand_price && m.generic_price ? Math.round(((m.brand_price - m.generic_price) / m.brand_price) * 100) : 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 8 }}>Medicine Price Comparison</h1>
        <p style={{ color: "#6B7280" }}>Branded vs generic vs Jan Aushadhi. Same molecule. Massive savings.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search medicine name or generic..." style={{ flex: 1, minWidth: 260, padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "white" }} />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, background: "white", minWidth: 160 }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background: "linear-gradient(135deg, #1E1B2E, #2d1b5e)", borderRadius: 14, padding: "18px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 24 }}>💡</span>
        <div>
          <div style={{ color: "white", fontWeight: 600, fontSize: 15 }}>Generic medicines are chemically identical to branded ones</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Same molecule. Same efficacy. Fraction of the price. Jan Aushadhi stores available across Faridabad.</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6B7280" }}>Loading medicines...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {medicines.map(m => (
            <div key={m.id} style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, overflow: "hidden" }}>
              <div onClick={() => toggle(m.id)} className="card-hover" style={{ padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1E1B2E" }}>{m.brand_name}</span>
                    <span style={{ background: "rgba(108,63,197,0.08)", color: "#6C3FC5", fontSize: 11, padding: "2px 8px", borderRadius: 999 }}>{m.category}</span>
                    {m.requires_prescription ? <span style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", fontSize: 11, padding: "2px 8px", borderRadius: 999 }}>Rx</span> : <span style={{ background: "rgba(16,185,129,0.08)", color: "#059669", fontSize: 11, padding: "2px 8px", borderRadius: 999 }}>OTC</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>{m.generic_name} · {m.manufacturer}</div>
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#1E1B2E" }}>₹{m.brand_price}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Branded</div>
                  </div>
                  <div style={{ color: "#E5E0FF", fontSize: 20 }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#6C3FC5" }}>₹{m.generic_price}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Generic</div>
                  </div>
                  {m.jan_aushadhi_price && (
                    <>
                      <div style={{ color: "#E5E0FF", fontSize: 20 }}>→</div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#059669" }}>₹{m.jan_aushadhi_price}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>Jan Aushadhi</div>
                      </div>
                    </>
                  )}
                  {savings(m) > 0 && (
                    <div style={{ background: "rgba(110,231,183,0.15)", border: "1px solid #6EE7B7", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>-{savings(m)}%</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>Savings</div>
                    </div>
                  )}
                  <div style={{ color: "#6C3FC5", fontSize: 18 }}>{expanded === m.id ? "▲" : "▼"}</div>
                </div>
              </div>

              {expanded === m.id && expandedData && (
                <div style={{ padding: "0 24px 20px", borderTop: "1px solid #F3F0FF" }}>
                  <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12, marginTop: 12 }}>
                    <strong>Generic name:</strong> {expandedData.generic_name} &nbsp;·&nbsp; <strong>Type:</strong> {expandedData.type}
                  </div>
                  {expandedData.substitutes && expandedData.substitutes.length > 0 && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B2E", marginBottom: 10 }}>Other brands with same molecule:</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {expandedData.substitutes.map(s => (
                          <div key={s.id} style={{ background: "#F8F7FF", border: "1px solid #E5E0FF", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                            <div style={{ fontWeight: 600, color: "#1E1B2E" }}>{s.brand_name}</div>
                            <div style={{ color: "#6C3FC5", fontWeight: 700 }}>₹{s.brand_price}</div>
                            <div style={{ color: "#6B7280" }}>{s.manufacturer}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
