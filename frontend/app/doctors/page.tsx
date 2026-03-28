"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

const API = "https://cure-you-backend-production.up.railway.app/api";

interface Doctor {
  id: number;
  name: string;
  speciality: string;
  area: string;
  fee: number;
  rating: number;
  reviews: number;
  experience: number;
  hospital: string;
  verified: number;
  available_today: number;
  image_initials: string;
  education: string;
  languages: string;
}

const FEMALE_NAMES = [
  "Priya","Neha","Sunita","Anjali","Kavita","Rekha","Seema","Pooja",
  "Soni","Vandana","Anita","Ritu","Shikha","Meena","Asha","Nidhi",
];

function getDoctorPhoto(id: number, name: string): string {
  const isFemale = FEMALE_NAMES.some((fn) =>
    name.toLowerCase().includes(fn.toLowerCase())
  );
  const idx = (id % 60) + 1;
  return isFemale
    ? `https://randomuser.me/api/portraits/women/${idx}.jpg`
    : `https://randomuser.me/api/portraits/men/${idx}.jpg`;
}

type ExperienceFilter = "any" | "5" | "10" | "15" | "20";
type FeeFilter = "any" | "u500" | "500-1000" | "1000-2000" | "2000p";
type RatingFilter = "any" | "4.0" | "4.5" | "4.8";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [availableToday, setAvailableToday] = useState(false);
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>("any");
  const [feeFilter, setFeeFilter] = useState<FeeFilter>("any");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("any");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/doctors/specialities`)
      .then((r) => r.json())
      .then(setSpecialities);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedSpec) params.set("speciality", selectedSpec);
    fetch(`${API}/doctors?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setDoctors(d);
        setLoading(false);
      });
  }, [search, selectedSpec]);

  const anyFilterActive =
    search ||
    selectedSpec ||
    availableToday ||
    experienceFilter !== "any" ||
    feeFilter !== "any" ||
    ratingFilter !== "any";

  function clearAll() {
    setSearch("");
    setSelectedSpec("");
    setAvailableToday(false);
    setExperienceFilter("any");
    setFeeFilter("any");
    setRatingFilter("any");
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      if (availableToday && !d.available_today) return false;
      if (experienceFilter === "5" && d.experience < 5) return false;
      if (experienceFilter === "10" && d.experience < 10) return false;
      if (experienceFilter === "15" && d.experience < 15) return false;
      if (experienceFilter === "20" && d.experience < 20) return false;
      if (feeFilter === "u500" && d.fee >= 500) return false;
      if (feeFilter === "500-1000" && (d.fee < 500 || d.fee > 1000)) return false;
      if (feeFilter === "1000-2000" && (d.fee < 1000 || d.fee > 2000)) return false;
      if (feeFilter === "2000p" && d.fee < 2000) return false;
      if (ratingFilter === "4.0" && d.rating < 4.0) return false;
      if (ratingFilter === "4.5" && d.rating < 4.5) return false;
      if (ratingFilter === "4.8" && d.rating < 4.8) return false;
      return true;
    });
  }, [doctors, availableToday, experienceFilter, feeFilter, ratingFilter]);

  return (
    <>
      <style>{`
        .card-hover {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .card-hover:hover {
          box-shadow: 0 8px 32px rgba(108,63,197,0.13);
          transform: translateY(-2px);
        }
        .btn-book:hover {
          opacity: 0.9;
        }
        .btn-profile:hover {
          background: rgba(108,63,197,0.07) !important;
        }
        @media (max-width: 768px) {
          .page-grid {
            grid-template-columns: 1fr !important;
          }
          .sidebar {
            position: static !important;
          }
        }
      `}</style>

      {/* Top header bar */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E0FF", padding: "18px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1E1B2E", margin: 0 }}>
            Doctors in Faridabad
          </h1>
          <p style={{ color: "#6B7280", margin: "4px 0 0", fontSize: 14 }}>
            Verified credentials · Real fees · Real availability
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        <div
          className="page-grid"
          style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}
        >
          {/* LEFT SIDEBAR */}
          <aside
            className="sidebar"
            style={{
              position: "sticky",
              top: 24,
              alignSelf: "start",
              background: "white",
              border: "1px solid #E5E0FF",
              borderRadius: 14,
              padding: 20,
              height: "fit-content",
            }}
          >
            {/* Filters heading */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E" }}>Filters</span>
              {anyFilterActive && (
                <button
                  onClick={clearAll}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6C3FC5",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, hospital..."
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #E5E0FF",
                borderRadius: 8,
                fontSize: 13,
                outline: "none",
                background: "#F8F7FF",
                color: "#1E1B2E",
                boxSizing: "border-box",
                marginBottom: 20,
              }}
            />

            {/* Available Today toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1E1B2E" }}>Available Today</span>
              <div
                onClick={() => setAvailableToday(!availableToday)}
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: availableToday ? "#6C3FC5" : "#D1D5DB",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: availableToday ? 23 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                  }}
                />
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #E5E0FF", marginBottom: 18 }} />

            {/* Speciality */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1E1B2E", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Speciality
              </div>
              <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                {specialities.map((s) => (
                  <label
                    key={s}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: selectedSpec === s ? "#6C3FC5" : "#374151" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSpec === s}
                      onChange={() => setSelectedSpec(selectedSpec === s ? "" : s)}
                      style={{ accentColor: "#6C3FC5", width: 15, height: 15 }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #E5E0FF", marginBottom: 18 }} />

            {/* Experience */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1E1B2E", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Experience
              </div>
              {(["any", "5", "10", "15", "20"] as ExperienceFilter[]).map((val) => (
                <label
                  key={val}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: experienceFilter === val ? "#6C3FC5" : "#374151", marginBottom: 7 }}
                >
                  <input
                    type="radio"
                    name="experience"
                    checked={experienceFilter === val}
                    onChange={() => setExperienceFilter(val)}
                    style={{ accentColor: "#6C3FC5" }}
                  />
                  {val === "any" ? "Any" : `${val}+ years`}
                </label>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #E5E0FF", marginBottom: 18 }} />

            {/* Consultation Fee */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1E1B2E", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Consultation Fee
              </div>
              {([
                ["any", "Any"],
                ["u500", "Under ₹500"],
                ["500-1000", "₹500 – ₹1,000"],
                ["1000-2000", "₹1,000 – ₹2,000"],
                ["2000p", "₹2,000+"],
              ] as [FeeFilter, string][]).map(([val, label]) => (
                <label
                  key={val}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: feeFilter === val ? "#6C3FC5" : "#374151", marginBottom: 7 }}
                >
                  <input
                    type="radio"
                    name="fee"
                    checked={feeFilter === val}
                    onChange={() => setFeeFilter(val)}
                    style={{ accentColor: "#6C3FC5" }}
                  />
                  {label}
                </label>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #E5E0FF", marginBottom: 18 }} />

            {/* Rating */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1E1B2E", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Rating
              </div>
              {([
                ["any", "Any"],
                ["4.0", "4.0+"],
                ["4.5", "4.5+"],
                ["4.8", "4.8+"],
              ] as [RatingFilter, string][]).map(([val, label]) => (
                <label
                  key={val}
                  style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: ratingFilter === val ? "#6C3FC5" : "#374151", marginBottom: 7 }}
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === val}
                    onChange={() => setRatingFilter(val)}
                    style={{ accentColor: "#6C3FC5" }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div>
            {/* Count bar */}
            <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 16, fontWeight: 500 }}>
              {loading ? "Loading..." : `${filteredDoctors.length} doctors found`}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>
                <div style={{ fontSize: 16 }}>Loading doctors...</div>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>
                <div style={{ fontSize: 16 }}>No doctors match your filters.</div>
                <button onClick={clearAll} style={{ marginTop: 12, color: "#6C3FC5", background: "none", border: "none", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filteredDoctors.map((d) => (
                  <div
                    key={d.id}
                    className="card-hover"
                    style={{
                      background: "white",
                      border: "1px solid #E5E0FF",
                      borderRadius: 16,
                      padding: 20,
                    }}
                  >
                    <div style={{ display: "flex", gap: 18 }}>
                      {/* Photo */}
                      <div style={{ flexShrink: 0 }}>
                        <img
                          src={getDoctorPhoto(d.id, d.name)}
                          width={80}
                          height={80}
                          alt={d.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 14,
                            objectFit: "cover",
                            display: "block",
                            border: "2px solid #E5E0FF",
                          }}
                        />
                      </div>

                      {/* Info section */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                          {/* Left info */}
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                              <span style={{ fontWeight: 800, fontSize: 17, color: "#1E1B2E" }}>{d.name}</span>
                              {!!d.verified && (
                                <span style={{
                                  background: "rgba(110,231,183,0.15)",
                                  color: "#059669",
                                  fontSize: 11,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  fontWeight: 700,
                                  border: "1px solid #6EE7B7",
                                  whiteSpace: "nowrap",
                                }}>
                                  ✓ MCI Verified
                                </span>
                              )}
                              {!!d.available_today && (
                                <span style={{
                                  background: "rgba(108,63,197,0.1)",
                                  color: "#6C3FC5",
                                  fontSize: 11,
                                  padding: "2px 8px",
                                  borderRadius: 999,
                                  fontWeight: 700,
                                  border: "1px solid #C4B5FD",
                                  whiteSpace: "nowrap",
                                }}>
                                  Available Today
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: "#6C3FC5", fontWeight: 700, marginBottom: 2 }}>{d.speciality}</div>
                            <div style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}>{d.hospital}</div>
                            <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                              <span>📍</span> {d.area}
                            </div>
                          </div>

                          {/* Right: Fee */}
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#1E1B2E" }}>₹{d.fee}</div>
                            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Consultation fee</div>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                          <span style={{
                            background: "#6C3FC5",
                            color: "white",
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 6,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}>
                            ⭐ {d.rating}
                          </span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>{d.reviews} reviews</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>·</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>{d.experience} yrs experience</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>·</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>🗣 {d.languages}</span>
                        </div>

                        {/* Education */}
                        {d.education && (
                          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>{d.education}</div>
                        )}

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                          <Link
                            href={`/doctors/${d.id}`}
                            className="btn-book"
                            style={{
                              flex: 1,
                              padding: "10px 0",
                              background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                              color: "white",
                              borderRadius: 9,
                              fontWeight: 700,
                              fontSize: 13,
                              textAlign: "center",
                              textDecoration: "none",
                              display: "block",
                            }}
                          >
                            Book Appointment
                          </Link>
                          <Link
                            href={`/doctors/${d.id}`}
                            className="btn-profile"
                            style={{
                              padding: "10px 18px",
                              border: "1.5px solid #6C3FC5",
                              borderRadius: 9,
                              color: "#6C3FC5",
                              fontWeight: 700,
                              fontSize: 13,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              whiteSpace: "nowrap",
                              background: "transparent",
                            }}
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
