"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:5001/api";

interface Doctor {
  id: number; name: string; speciality: string; area: string; fee: number;
  rating: number; reviews: number; experience: number; hospital: string;
  verified: number; available_today: number; image_initials: string;
  education: string; languages: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/doctors/specialities`).then(r => r.json()).then(setSpecialities);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedSpec) params.set("speciality", selectedSpec);
    fetch(`${API}/doctors?${params}`).then(r => r.json()).then(d => { setDoctors(d); setLoading(false); });
  }, [search, selectedSpec]);

  const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 8 }}>Find Doctors in Faridabad</h1>
        <p style={{ color: "#6B7280" }}>Verified credentials · Real fees · Real availability</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, speciality, hospital..."
          style={{ flex: 1, minWidth: 280, padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "white" }}
        />
        <select
          value={selectedSpec} onChange={e => setSelectedSpec(e.target.value)}
          style={{ padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, background: "white", color: "#1E1B2E", minWidth: 180 }}
        >
          <option value="">All Specialities</option>
          {specialities.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || selectedSpec) && (
          <button onClick={() => { setSearch(""); setSelectedSpec(""); }} style={{ padding: "12px 16px", border: "1px solid #E5E0FF", borderRadius: 10, background: "white", cursor: "pointer", fontSize: 13, color: "#6B7280" }}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Speciality pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {["Cardiologist","Orthopaedic","Neurologist","Gynaecologist","Dermatologist","Paediatrician"].map(s => (
          <button key={s} onClick={() => setSelectedSpec(selectedSpec === s ? "" : s)} style={{
            padding: "6px 14px", borderRadius: 999, border: "1px solid",
            borderColor: selectedSpec === s ? "#6C3FC5" : "#E5E0FF",
            background: selectedSpec === s ? "rgba(108,63,197,0.1)" : "white",
            color: selectedSpec === s ? "#6C3FC5" : "#6B7280",
            fontSize: 13, fontWeight: 500, cursor: "pointer"
          }}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>Loading doctors...</div>
      ) : (
        <>
          <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>{doctors.length} doctors found</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {doctors.map(d => (
              <div key={d.id} className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                    {d.image_initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E" }}>{d.name}</span>
                      {d.verified ? <span style={{ background: "rgba(110,231,183,0.15)", color: "#059669", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>✓ Verified</span> : null}
                    </div>
                    <div style={{ fontSize: 13, color: "#6C3FC5", fontWeight: 600 }}>{d.speciality}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{d.hospital}</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  📍 {d.area}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ textAlign: "center", padding: "10px 8px", background: "#F8F7FF", borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1E1B2E" }}>₹{d.fee}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Consult Fee</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 8px", background: "#F8F7FF", borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#6C3FC5" }}>{d.rating}</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>{d.reviews} reviews</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 8px", background: "#F8F7FF", borderRadius: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1E1B2E" }}>{d.experience}yr</div>
                    <div style={{ fontSize: 11, color: "#6B7280" }}>Experience</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#6EE7B7", marginBottom: 4 }}>★ {stars(d.rating)} {d.rating}/5</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 16 }}>🗣️ {d.languages}</div>

                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`/doctors/${d.id}`} style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
                    Book Appointment
                  </a>
                  {d.available_today ? (
                    <div style={{ background: "rgba(110,231,183,0.1)", border: "1px solid #6EE7B7", color: "#059669", padding: "10px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center" }}>
                      Today
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
