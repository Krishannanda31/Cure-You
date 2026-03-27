"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:5001/api";

interface TestResult {
  lab_id: number; lab_name: string; area: string; price: number;
  rating: number; nabl_certified: number; home_collection: number;
  phone: string; turnaround_hours: number; test_name: string;
}

const POPULAR = ["CBC (Complete Blood Count)", "HbA1c", "Vitamin D (25-OH)", "Thyroid Profile (TSH, T3, T4)", "Lipid Profile", "LFT (Liver Function Test)", "KFT (Kidney Function Test)", "Blood Sugar Fasting"];

export default function DiagnosticsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TestResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setSearched(true);
    const r = await fetch(`${API}/labs/compare?test=${encodeURIComponent(q)}`);
    setResults(await r.json());
    setLoading(false);
  };

  const cheapest = results.length ? results[0].price : 0;
  const expensive = results.length ? results[results.length - 1].price : 0;
  const saving = expensive - cheapest;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 8 }}>Compare Lab Test Prices</h1>
        <p style={{ color: "#6B7280" }}>Same test. Different labs. Different prices. CureYou shows you all of them.</p>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, maxWidth: 600 }}>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search(query)}
          placeholder="e.g. CBC, Vitamin D, HbA1c, Thyroid..."
          style={{ flex: 1, padding: "14px 18px", border: "2px solid #E5E0FF", borderRadius: 12, fontSize: 15, outline: "none", background: "white" }}
        />
        <button onClick={() => search(query)} style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "14px 24px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
          Compare
        </button>
      </div>

      {/* Popular tests */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>Popular:</span>
        {POPULAR.map(t => (
          <button key={t} onClick={() => { setQuery(t); search(t); }} style={{
            padding: "6px 12px", borderRadius: 999, border: "1px solid #E5E0FF",
            background: "white", color: "#6C3FC5", fontSize: 12, fontWeight: 500, cursor: "pointer"
          }}>{t}</button>
        ))}
      </div>

      {/* Savings Banner */}
      {searched && !loading && results.length > 1 && (
        <div style={{ background: "linear-gradient(135deg, #1E1B2E, #2d1b5e)", borderRadius: 16, padding: "24px 28px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Price range for: <strong style={{ color: "white" }}>{results[0]?.test_name}</strong></div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>₹{cheapest} <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }}>to</span> ₹{expensive}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 }}>across {results.length} labs in Faridabad</div>
          </div>
          <div style={{ background: "rgba(110,231,183,0.15)", border: "1px solid rgba(110,231,183,0.4)", borderRadius: 12, padding: "16px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#6EE7B7", fontWeight: 600, marginBottom: 4 }}>MAX YOU CAN SAVE</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#6EE7B7" }}>₹{saving}</div>
            <div style={{ fontSize: 11, color: "rgba(110,231,183,0.7)" }}>by choosing the cheapest NABL lab</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>Comparing prices...</div>
      ) : searched && results.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>No results found. Try a different test name.</div>
      ) : (
        <div>
          {results.map((r, i) => (
            <div key={`${r.lab_id}-${i}`} className="card-hover" style={{
              background: "white", border: `1px solid ${i === 0 ? "#6EE7B7" : "#E5E0FF"}`,
              borderRadius: 14, padding: "20px 24px", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
            }}>
              {i === 0 && (
                <div style={{ position: "absolute" }}>
                  <span style={{ background: "#6EE7B7", color: "#1E1B2E", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>CHEAPEST</span>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E" }}>{r.lab_name}</span>
                  {i === 0 && <span style={{ background: "rgba(110,231,183,0.2)", color: "#059669", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>Cheapest</span>}
                  {r.nabl_certified ? <span style={{ background: "rgba(108,63,197,0.1)", color: "#6C3FC5", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>NABL</span> : null}
                  {r.home_collection ? <span style={{ background: "rgba(129,140,248,0.1)", color: "#818CF8", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>🏠 Home Collection</span> : null}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>📍 {r.area}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>⭐ {r.rating} · ⏱ Results in {r.turnaround_hours}h</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: i === 0 ? "#059669" : "#1E1B2E" }}>₹{r.price}</div>
                {i > 0 && <div style={{ fontSize: 12, color: "#dc2626" }}>₹{r.price - cheapest} more than cheapest</div>}
                <button style={{ marginTop: 8, padding: "8px 16px", background: i === 0 ? "linear-gradient(135deg, #6C3FC5, #818CF8)" : "white", color: i === 0 ? "white" : "#6C3FC5", border: "1px solid #E5E0FF", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searched && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧪</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Search any lab test above</div>
          <div style={{ fontSize: 14 }}>We'll show you prices from all labs in Faridabad — sorted cheapest first</div>
        </div>
      )}
    </div>
  );
}
