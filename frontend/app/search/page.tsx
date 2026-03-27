"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const API = "http://localhost:5001/api";

interface SearchResults {
  query: string; total: number;
  doctors: { id: number; name: string; speciality: string; area: string; fee: number; rating: number; hospital: string }[];
  hospitals: { id: number; name: string; area: string; type: string; rating: number }[];
  tests: { test_name: string; test_category: string; min_price: number; max_price: number; lab_count: number }[];
  medicines: { id: number; brand_name: string; generic_name: string; brand_price: number; generic_price: number; category: string }[];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.length >= 2) { setQuery(q); runSearch(q); }
  }, [searchParams]);

  const runSearch = async (q: string) => {
    if (q.length < 2) return;
    setLoading(true);
    const r = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
    setResults(await r.json());
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 40, maxWidth: 620 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search doctors, tests, hospitals, medicines..."
          style={{ flex: 1, padding: "14px 18px", border: "2px solid #E5E0FF", borderRadius: 12, fontSize: 15, outline: "none", background: "white" }} autoFocus />
        <button type="submit" style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "14px 24px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Search</button>
      </form>

      {loading && <div style={{ textAlign: "center", padding: 60, color: "#6B7280" }}>Searching across all of CureYou...</div>}

      {results && !loading && (
        <div>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>
            <strong style={{ color: "#1E1B2E" }}>{results.total} results</strong> for &quot;{results.query}&quot;
          </div>

          {results.doctors.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E1B2E", marginBottom: 14 }}>🩺 Doctors ({results.doctors.length})</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                {results.doctors.map(d => (
                  <Link key={d.id} href={`/doctors/${d.id}`} style={{ textDecoration: "none" }}>
                    <div className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "16px 18px" }}>
                      <div style={{ fontWeight: 700, color: "#1E1B2E", marginBottom: 2 }}>{d.name}</div>
                      <div style={{ fontSize: 13, color: "#6C3FC5", marginBottom: 4 }}>{d.speciality} · {d.hospital}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#6B7280" }}>📍 {d.area}</span>
                        <span style={{ color: "#6C3FC5", fontWeight: 700 }}>₹{d.fee}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.tests.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E1B2E", marginBottom: 14 }}>🧪 Lab Tests ({results.tests.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.tests.map(t => (
                  <Link key={t.test_name} href={`/diagnostics?test=${encodeURIComponent(t.test_name)}`} style={{ textDecoration: "none" }}>
                    <div className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "#1E1B2E" }}>{t.test_name}</div>
                        <div style={{ fontSize: 13, color: "#6B7280" }}>Available at {t.lab_count} labs · {t.test_category}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#059669" }}>₹{t.min_price}</div>
                        <div style={{ fontSize: 11, color: "#6B7280" }}>cheapest</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.hospitals.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E1B2E", marginBottom: 14 }}>🏥 Hospitals ({results.hospitals.length})</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                {results.hospitals.map(h => (
                  <Link key={h.id} href="/hospitals" style={{ textDecoration: "none" }}>
                    <div className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "16px 18px" }}>
                      <div style={{ fontWeight: 700, color: "#1E1B2E", marginBottom: 2 }}>{h.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ color: "#6B7280" }}>📍 {h.area}</span>
                        <span style={{ color: "#818CF8" }}>★ {h.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.medicines.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E1B2E", marginBottom: 14 }}>💊 Medicines ({results.medicines.length})</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {results.medicines.map(m => (
                  <div key={m.id} className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ fontWeight: 700, color: "#1E1B2E", marginBottom: 2 }}>{m.brand_name}</div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>{m.generic_name}</div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div><div style={{ fontWeight: 700, color: "#1E1B2E" }}>₹{m.brand_price}</div><div style={{ fontSize: 11, color: "#6B7280" }}>Branded</div></div>
                      <div><div style={{ fontWeight: 700, color: "#059669" }}>₹{m.generic_price}</div><div style={{ fontSize: 11, color: "#6B7280" }}>Generic</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.total === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280" }}>No results for &quot;{results.query}&quot;</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>Try a different term — doctor name, test name, medicine, or hospital</div>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280" }}>Search across all of CureYou</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Doctors · Lab Tests · Hospitals · Medicines</div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
