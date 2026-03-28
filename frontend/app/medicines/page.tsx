"use client";
import { useState, useEffect } from "react";

const API = "https://cure-you-backend-production.up.railway.app/api";

interface Medicine {
  id: number; brand_name: string; generic_name: string; manufacturer: string;
  type: string; brand_price: number; generic_price: number; jan_aushadhi_price: number;
  category: string; requires_prescription: number; substitutes?: Medicine[];
}

interface Pharmacy {
  id: number; name: string; area: string; phone: string;
  open_24h: number; rating: number; distance_km: number;
}

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  "Pain Relief":     { emoji: "🩹", color: "#dc2626" },
  "Antibiotics":     { emoji: "🦠", color: "#7c3aed" },
  "Diabetes":        { emoji: "🩸", color: "#6C3FC5" },
  "Cardiovascular":  { emoji: "❤️", color: "#e11d48" },
  "Vitamins":        { emoji: "☀️", color: "#d97706" },
  "Antacids":        { emoji: "🧴", color: "#059669" },
  "Respiratory":     { emoji: "🫁", color: "#2563eb" },
  "Dermatology":     { emoji: "🌿", color: "#16a34a" },
  "Ophthalmology":   { emoji: "👁️", color: "#0891b2" },
  "Gynecology":      { emoji: "🌸", color: "#db2777" },
  "Neurology":       { emoji: "🧠", color: "#7c3aed" },
  "Thyroid":         { emoji: "⚖️", color: "#d97706" },
};

const DISCOUNT_OFFERS = [
  { store: "Dr. Lal PathLabs Pharmacy", offer: "15% off on all generics", emoji: "🏥", color: "#7c3aed" },
  { store: "Apollo Pharmacy", offer: "Buy 2 get 1 on vitamins", emoji: "💊", color: "#e11d48" },
  { store: "MedPlus", offer: "20% off on diabetes medicines", emoji: "🩸", color: "#059669" },
  { store: "Jan Aushadhi Kendra", offer: "Always 50–90% cheaper", emoji: "🌿", color: "#d97706" },
];

const CHEMIST_DISCOUNTS = ["15% OFF", "20% OFF", "10% OFF", "25% OFF", "Buy2Get1", "12% OFF", "18% OFF", "30% OFF"];

function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? { emoji: "💊", color: "#6C3FC5" };
}

function savings(m: Medicine) {
  return m.brand_price && m.generic_price
    ? Math.round(((m.brand_price - m.generic_price) / m.brand_price) * 100)
    : 0;
}

/* ─── PAYMENT MODAL ───────────────────────────────────────────────── */
function PaymentModal({
  pharmacy,
  onClose,
}: {
  pharmacy: Pharmacy;
  onClose: () => void;
}) {
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
      setTimeout(onClose, 2000);
    }, 1800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(30,27,46,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 20,
          width: "100%",
          maxWidth: 420,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(108,63,197,0.2)",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
          padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 17 }}>Complete Payment</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>{pharmacy.name}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "none", cursor: "pointer",
              color: "white", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </div>

        <div style={{ padding: "24px 24px 20px" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#059669", marginBottom: 6 }}>Payment Successful!</div>
              <div style={{ color: "#6B7280", fontSize: 13 }}>Your booking is confirmed. Closing…</div>
            </div>
          ) : (
            <>
              {/* Amount */}
              <div style={{
                background: "#F8F7FF",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 20,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 3 }}>Booking Fee</div>
                  <div style={{ fontWeight: 800, fontSize: 26, color: "#1E1B2E" }}>₹99</div>
                </div>
                <div style={{
                  background: "rgba(108,63,197,0.1)",
                  borderRadius: 10, padding: "6px 12px",
                  fontSize: 12, fontWeight: 600, color: "#6C3FC5"
                }}>Secure Pay 🔒</div>
              </div>

              {/* Payment options */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                Payment Method
              </div>

              {(["upi", "card", "netbanking"] as const).map(method => {
                const labels: Record<string, { label: string; sub: string; emoji: string }> = {
                  upi:        { label: "UPI", sub: "Google Pay, PhonePe, Paytm", emoji: "📱" },
                  card:       { label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay", emoji: "💳" },
                  netbanking: { label: "Net Banking", sub: "All major banks supported", emoji: "🏦" },
                };
                const { label, sub, emoji } = labels[method];
                const isSelected = payMethod === method;
                return (
                  <div
                    key={method}
                    onClick={() => setPayMethod(method)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: isSelected ? "1.5px solid #6C3FC5" : "1.5px solid #E5E0FF",
                      background: isSelected ? "rgba(108,63,197,0.05)" : "white",
                      cursor: "pointer",
                      marginBottom: 8,
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1E1B2E" }}>{label}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{sub}</div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: isSelected ? "5px solid #6C3FC5" : "2px solid #D1D5DB",
                      flexShrink: 0,
                      transition: "border 0.15s",
                    }} />
                  </div>
                );
              })}

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={paying}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 12,
                  border: "none",
                  background: paying ? "#D1D5DB" : "linear-gradient(135deg, #6C3FC5, #818CF8)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: paying ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {paying ? "Processing…" : "Pay Now ₹99"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────── */
export default function MedicinesPage() {
  // Medicines state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedData, setExpandedData] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"medicines" | "chemists">("medicines");

  // Location state
  const [locationGranted, setLocationGranted] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // Chemists state
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [pharmLoading, setPharmLoading] = useState(false);
  const [pharmLoaded, setPharmLoaded] = useState(false);

  // Payment modal state
  const [payPharmacy, setPayPharmacy] = useState<Pharmacy | null>(null);

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
    setExpandedData(null);
    const r = await fetch(`${API}/medicines/${id}`);
    setExpandedData(await r.json());
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocationGranted(true);
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      () => { /* denied */ }
    );
  };

  const loadPharmacies = () => {
    if (pharmLoaded) return;
    setPharmLoading(true);
    fetch(`${API}/nearby?type=pharmacy`)
      .then(r => r.json())
      .then(d => { setPharmacies(d); setPharmLoading(false); setPharmLoaded(true); })
      .catch(() => { setPharmLoading(false); setPharmLoaded(true); });
  };

  const handleTabSwitch = (tab: "medicines" | "chemists") => {
    setActiveTab(tab);
    if (tab === "chemists") loadPharmacies();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF", fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* TOP HEADER BAR */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #E5E0FF",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(108,63,197,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 22 }}>💊</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#1E1B2E" }}>Medicines</span>
        </div>

        {/* SEARCH BAR */}
        <div style={{ flex: 1, maxWidth: 600, position: "relative" }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 16, color: "#9CA3AF", pointerEvents: "none"
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medicines, generic names..."
            style={{
              width: "100%",
              padding: "10px 16px 10px 42px",
              border: "1.5px solid #E5E0FF",
              borderRadius: 50,
              fontSize: 14,
              outline: "none",
              background: "#F8F7FF",
              color: "#1E1B2E",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "#6C3FC5")}
            onBlur={e => (e.target.style.borderColor = "#E5E0FF")}
          />
        </div>
      </div>

      {/* BODY: SIDEBAR + MAIN */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 0, minHeight: "calc(100vh - 64px)" }}>

        {/* LEFT SIDEBAR */}
        <aside style={{
          background: "white",
          borderRight: "1px solid #E5E0FF",
          position: "sticky",
          top: 64,
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          padding: "20px 0",
        }}>
          <div style={{ padding: "0 16px 12px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Shop by Category
          </div>

          {/* ALL MEDICINES ROW */}
          <button
            onClick={() => setCategory("")}
            onMouseEnter={() => setHoveredCat("__all")}
            onMouseLeave={() => setHoveredCat(null)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              background: category === ""
                ? "linear-gradient(90deg, rgba(108,63,197,0.1), rgba(108,63,197,0.04))"
                : hoveredCat === "__all" ? "#F8F7FF" : "transparent",
              textAlign: "left",
              borderLeft: category === "" ? "3px solid #6C3FC5" : "3px solid transparent",
              transition: "background 0.12s",
            }}
          >
            <span style={{
              width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(108,63,197,0.1)", fontSize: 16, flexShrink: 0
            }}>🏥</span>
            <span style={{ fontSize: 13, fontWeight: category === "" ? 700 : 500, color: category === "" ? "#6C3FC5" : "#1E1B2E" }}>
              All Medicines
            </span>
          </button>

          {/* DIVIDER */}
          <div style={{ height: 1, background: "#F3F0FF", margin: "8px 0" }} />

          {/* CATEGORY ROWS */}
          {categories.map(cat => {
            const meta = getCategoryMeta(cat);
            const isActive = category === cat;
            const isHovered = hoveredCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                onMouseEnter={() => setHoveredCat(cat)}
                onMouseLeave={() => setHoveredCat(null)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                  background: isActive
                    ? `linear-gradient(90deg, ${meta.color}18, ${meta.color}06)`
                    : isHovered ? "#F8F7FF" : "transparent",
                  textAlign: "left",
                  borderLeft: isActive ? `3px solid ${meta.color}` : "3px solid transparent",
                  transition: "background 0.12s",
                }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${meta.color}18`, fontSize: 16, flexShrink: 0
                }}>{meta.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? meta.color : "#374151" }}>
                  {cat}
                </span>
              </button>
            );
          })}
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main style={{ padding: "24px 28px", minWidth: 0 }}>

          {/* ── TWO TABS ─────────────────────────────────────── */}
          <div style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: "white",
            border: "1px solid #E5E0FF",
            borderRadius: 14,
            padding: 4,
            alignSelf: "flex-start",
            width: "fit-content",
          }}>
            {(["medicines", "chemists"] as const).map(tab => {
              const isActive = activeTab === tab;
              const label = tab === "medicines" ? "💊 Medicines" : "🏪 Chemists Near You";
              return (
                <button
                  key={tab}
                  onClick={() => handleTabSwitch(tab)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 14,
                    background: isActive
                      ? "linear-gradient(135deg, #6C3FC5, #818CF8)"
                      : "transparent",
                    color: isActive ? "white" : "#6B7280",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── MEDICINES TAB ─────────────────────────────────── */}
          {activeTab === "medicines" && (
            <>
              {/* COUNT ROW */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: "#6B7280" }}>
                  {loading ? "Loading..." : <><strong style={{ color: "#1E1B2E" }}>{medicines.length}</strong> medicines found{category && <> in <span style={{ color: getCategoryMeta(category).color, fontWeight: 600 }}>{category}</span></>}</>}
                </span>
                {category && (
                  <button
                    onClick={() => setCategory("")}
                    style={{
                      fontSize: 12, padding: "3px 10px", borderRadius: 999,
                      border: "1px solid #E5E0FF", background: "white",
                      color: "#6B7280", cursor: "pointer"
                    }}
                  >Clear ×</button>
                )}
              </div>

              {/* INFO BANNER */}
              <div style={{
                background: "linear-gradient(135deg, #1E1B2E 0%, #2d1b5e 60%, #3b1f7a 100%)",
                borderRadius: 14,
                padding: "16px 22px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                    Generic = Same molecule, huge savings
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.5 }}>
                    Generics are chemically identical to branded drugs. Jan Aushadhi stores offer even deeper discounts.
                  </div>
                </div>
                <div style={{ marginLeft: "auto", flexShrink: 0, textAlign: "right" }}>
                  <div style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 20 }}>Up to 90%</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>cheaper</div>
                </div>
              </div>

              {/* PRODUCT GRID */}
              {loading ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 16
                }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{
                      background: "white", borderRadius: 16, border: "1px solid #E5E0FF",
                      overflow: "hidden", animation: "pulse 1.5s infinite"
                    }}>
                      <div style={{ height: 120, background: "#F3F0FF" }} />
                      <div style={{ padding: 14 }}>
                        <div style={{ height: 14, background: "#F3F0FF", borderRadius: 4, marginBottom: 8 }} />
                        <div style={{ height: 11, background: "#F3F0FF", borderRadius: 4, width: "70%", marginBottom: 12 }} />
                        <div style={{ height: 32, background: "#F3F0FF", borderRadius: 8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 16
                }}>
                  {medicines.map(m => {
                    const meta = getCategoryMeta(m.category);
                    const savePct = savings(m);
                    const isExpanded = expanded === m.id;
                    const isHov = hoveredCard === m.id;

                    return (
                      <div key={m.id} style={{ display: "flex", flexDirection: "column" }}>
                        {/* PRODUCT CARD */}
                        <div
                          onMouseEnter={() => setHoveredCard(m.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          style={{
                            background: "white",
                            borderRadius: 16,
                            border: isExpanded ? `1.5px solid ${meta.color}` : "1px solid #E5E0FF",
                            overflow: "hidden",
                            boxShadow: isHov
                              ? "0 8px 24px rgba(108,63,197,0.12)"
                              : "0 1px 4px rgba(0,0,0,0.04)",
                            transform: isHov ? "translateY(-2px)" : "translateY(0)",
                            transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* IMAGE AREA */}
                          <div style={{
                            height: 120,
                            background: `linear-gradient(135deg, ${meta.color}22 0%, ${meta.color}10 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}>
                            <span style={{ fontSize: 44 }}>{meta.emoji}</span>
                            {/* CATEGORY BADGE */}
                            <span style={{
                              position: "absolute", top: 8, left: 8,
                              background: `${meta.color}22`,
                              color: meta.color,
                              fontSize: 10, fontWeight: 700,
                              padding: "2px 8px", borderRadius: 999,
                              backdropFilter: "blur(4px)",
                              border: `1px solid ${meta.color}33`,
                            }}>{m.category}</span>
                            {/* RX / OTC BADGE */}
                            {m.requires_prescription ? (
                              <span style={{
                                position: "absolute", top: 8, right: 8,
                                background: "rgba(220,38,38,0.1)", color: "#dc2626",
                                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                                border: "1px solid rgba(220,38,38,0.2)"
                              }}>Rx</span>
                            ) : (
                              <span style={{
                                position: "absolute", top: 8, right: 8,
                                background: "rgba(5,150,105,0.1)", color: "#059669",
                                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                                border: "1px solid rgba(5,150,105,0.2)"
                              }}>OTC</span>
                            )}
                          </div>

                          {/* CARD BODY */}
                          <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#1E1B2E", marginBottom: 3, lineHeight: 1.3 }}>
                              {m.brand_name}
                            </div>
                            <div style={{
                              fontSize: 12, color: "#6B7280", marginBottom: 3,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                            }}>
                              {m.generic_name}
                            </div>
                            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>
                              {m.manufacturer}
                            </div>

                            {/* PRICE ROW */}
                            <div style={{ marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>₹{m.brand_price}</span>
                                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Brand</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                                <span style={{ fontSize: 16, fontWeight: 800, color: "#6C3FC5" }}>₹{m.generic_price}</span>
                                <span style={{ fontSize: 11, color: "#6B7280" }}>Generic</span>
                              </div>
                              {m.jan_aushadhi_price ? (
                                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>₹{m.jan_aushadhi_price}</span>
                                  <span style={{ fontSize: 11, color: "#6B7280" }}>Jan Aushadhi</span>
                                </div>
                              ) : null}
                            </div>

                            {/* SAVINGS BADGE */}
                            {savePct > 0 && (
                              <div style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                background: "rgba(110,231,183,0.15)",
                                border: "1px solid rgba(110,231,183,0.4)",
                                borderRadius: 6, padding: "3px 8px",
                                marginBottom: 10, alignSelf: "flex-start"
                              }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#059669" }}>-{savePct}%</span>
                                <span style={{ fontSize: 10, color: "#059669" }}>SAVE</span>
                              </div>
                            )}

                            {/* VIEW DETAILS BUTTON */}
                            <button
                              onClick={() => toggle(m.id)}
                              style={{
                                marginTop: "auto",
                                width: "100%",
                                padding: "9px 0",
                                borderRadius: 10,
                                border: isExpanded ? "none" : `1.5px solid #6C3FC5`,
                                background: isExpanded
                                  ? "linear-gradient(135deg, #6C3FC5, #818CF8)"
                                  : "transparent",
                                color: isExpanded ? "white" : "#6C3FC5",
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                              onMouseEnter={e => {
                                if (!isExpanded) {
                                  (e.currentTarget as HTMLButtonElement).style.background = "#6C3FC5";
                                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isExpanded) {
                                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                  (e.currentTarget as HTMLButtonElement).style.color = "#6C3FC5";
                                }
                              }}
                            >
                              {isExpanded ? "Hide Details ▲" : "View Details ▼"}
                            </button>
                          </div>
                        </div>

                        {/* EXPANDED DETAILS PANEL */}
                        {isExpanded && (
                          <div style={{
                            background: "white",
                            border: `1.5px solid ${meta.color}`,
                            borderTop: "none",
                            borderRadius: "0 0 16px 16px",
                            padding: "16px 14px",
                            marginTop: -8,
                          }}>
                            {expandedData === null ? (
                              <div style={{ textAlign: "center", padding: "12px 0", color: "#9CA3AF", fontSize: 13 }}>
                                Loading details...
                              </div>
                            ) : (
                              <>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                                  <div style={{
                                    flex: 1, background: "#F8F7FF", borderRadius: 8, padding: "8px 10px", minWidth: 90
                                  }}>
                                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Generic</div>
                                    <div style={{ fontSize: 12, color: "#1E1B2E", fontWeight: 600 }}>{expandedData.generic_name}</div>
                                  </div>
                                  <div style={{
                                    flex: 1, background: "#F8F7FF", borderRadius: 8, padding: "8px 10px", minWidth: 60
                                  }}>
                                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Type</div>
                                    <div style={{ fontSize: 12, color: "#1E1B2E", fontWeight: 600 }}>{expandedData.type}</div>
                                  </div>
                                </div>

                                {expandedData.substitutes && expandedData.substitutes.length > 0 && (
                                  <>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                                      Same molecule, other brands
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                      {expandedData.substitutes.map(s => (
                                        <div key={s.id} style={{
                                          background: "#F8F7FF",
                                          border: "1px solid #E5E0FF",
                                          borderRadius: 10,
                                          padding: "8px 10px",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          gap: 8,
                                        }}>
                                          <div>
                                            <div style={{ fontWeight: 700, fontSize: 12, color: "#1E1B2E" }}>{s.brand_name}</div>
                                            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.manufacturer}</div>
                                          </div>
                                          <div style={{ fontWeight: 800, fontSize: 13, color: "#6C3FC5", flexShrink: 0 }}>₹{s.brand_price}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {!loading && medicines.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E", marginBottom: 6 }}>No medicines found</div>
                  <div style={{ color: "#9CA3AF", fontSize: 14 }}>Try a different search term or category</div>
                </div>
              )}
            </>
          )}

          {/* ── CHEMISTS TAB ──────────────────────────────────── */}
          {activeTab === "chemists" && (
            <>
              {/* LOCATION BANNER */}
              {!locationGranted && (
                <div style={{
                  background: "linear-gradient(135deg, #fef3c7, #fffbeb)",
                  border: "1px solid #fcd34d",
                  borderRadius: 12,
                  padding: "12px 18px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <span style={{ fontSize: 20 }}>📍</span>
                  <span style={{ fontSize: 13, color: "#92400e", flex: 1, fontWeight: 500 }}>
                    Enable location to find medicines near you
                  </span>
                  <button
                    onClick={requestLocation}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >Allow</button>
                </div>
              )}

              {/* DISCOUNT OFFERS SECTION */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 14
                }}>
                  <span style={{ fontSize: 18 }}>🏷️</span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E" }}>Exclusive Offers</span>
                  <span style={{
                    background: "rgba(110,231,183,0.2)", color: "#059669",
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    border: "1px solid rgba(110,231,183,0.4)",
                  }}>Live Deals</span>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 12,
                }}>
                  {DISCOUNT_OFFERS.map((offer, i) => (
                    <div
                      key={i}
                      style={{
                        background: "white",
                        border: "1px solid #E5E0FF",
                        borderRadius: 14,
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        boxShadow: "0 2px 8px rgba(108,63,197,0.06)",
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: `${offer.color}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>{offer.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 700, fontSize: 13, color: "#1E1B2E",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          marginBottom: 3,
                        }}>{offer.store}</div>
                        <div style={{
                          fontSize: 12, color: offer.color, fontWeight: 600,
                        }}>{offer.offer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHEMISTS NEAR YOU */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>🏪</span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E" }}>Chemists Near You</span>
                  {locationGranted && (
                    <span style={{
                      background: "rgba(108,63,197,0.1)", color: "#6C3FC5",
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    }}>📍 Location On</span>
                  )}
                </div>

                {pharmLoading ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                  }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} style={{
                        background: "white", borderRadius: 16, border: "1px solid #E5E0FF",
                        overflow: "hidden", animation: "pulse 1.5s infinite"
                      }}>
                        <div style={{ height: 80, background: "#F3F0FF" }} />
                        <div style={{ padding: 14 }}>
                          <div style={{ height: 14, background: "#F3F0FF", borderRadius: 4, marginBottom: 8 }} />
                          <div style={{ height: 11, background: "#F3F0FF", borderRadius: 4, width: "60%", marginBottom: 12 }} />
                          <div style={{ display: "flex", gap: 8 }}>
                            <div style={{ flex: 1, height: 32, background: "#F3F0FF", borderRadius: 8 }} />
                            <div style={{ flex: 1, height: 32, background: "#F3F0FF", borderRadius: 8 }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pharmacies.length === 0 && pharmLoaded ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏪</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1E1B2E", marginBottom: 6 }}>No chemists found</div>
                    <div style={{ color: "#9CA3AF", fontSize: 14 }}>Check back later</div>
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                  }}>
                    {pharmacies.map((ph, idx) => {
                      const discountLabel = CHEMIST_DISCOUNTS[idx % CHEMIST_DISCOUNTS.length];
                      return (
                        <div
                          key={ph.id}
                          style={{
                            background: "white",
                            borderRadius: 16,
                            border: "1px solid #E5E0FF",
                            overflow: "hidden",
                            boxShadow: "0 2px 10px rgba(108,63,197,0.07)",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* TOP COLORED STRIP */}
                          <div style={{
                            background: "linear-gradient(135deg, #059669, #6EE7B7)",
                            padding: "16px 18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 28 }}>🏪</span>
                              <div>
                                <div style={{ color: "white", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>
                                  {ph.name}
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>
                                  {ph.area}
                                </div>
                              </div>
                            </div>
                            {/* Discount badge */}
                            <div style={{
                              background: "rgba(255,255,255,0.25)",
                              borderRadius: 8,
                              padding: "4px 10px",
                              color: "white",
                              fontWeight: 800,
                              fontSize: 12,
                              flexShrink: 0,
                            }}>{discountLabel}</div>
                          </div>

                          {/* CARD BODY */}
                          <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                              {/* Rating */}
                              <div style={{
                                display: "flex", alignItems: "center", gap: 4,
                                background: "#FEF9C3", borderRadius: 6, padding: "3px 8px",
                              }}>
                                <span style={{ fontSize: 12 }}>⭐</span>
                                <span style={{ fontWeight: 700, fontSize: 12, color: "#92400e" }}>{ph.rating.toFixed(1)}</span>
                              </div>

                              {/* Open 24/7 */}
                              {ph.open_24h ? (
                                <div style={{
                                  background: "rgba(5,150,105,0.1)", color: "#059669",
                                  fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                                  border: "1px solid rgba(5,150,105,0.2)",
                                }}>Open 24/7</div>
                              ) : (
                                <div style={{
                                  background: "rgba(107,114,128,0.08)", color: "#6B7280",
                                  fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                                }}>Regular Hours</div>
                              )}

                              {/* Distance */}
                              {locationGranted && (
                                <div style={{
                                  background: "rgba(108,63,197,0.08)", color: "#6C3FC5",
                                  fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                                }}>📍 {ph.distance_km.toFixed(1)} km</div>
                              )}
                            </div>

                            {/* Spacer */}
                            <div style={{ flex: 1 }} />

                            {/* ACTION BUTTONS */}
                            <div style={{ display: "flex", gap: 8 }}>
                              <a
                                href={`tel:${ph.phone}`}
                                style={{
                                  flex: 1,
                                  padding: "9px 0",
                                  borderRadius: 10,
                                  border: "1.5px solid #6C3FC5",
                                  background: "transparent",
                                  color: "#6C3FC5",
                                  fontWeight: 700,
                                  fontSize: 13,
                                  cursor: "pointer",
                                  textAlign: "center",
                                  textDecoration: "none",
                                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={e => {
                                  (e.currentTarget as HTMLAnchorElement).style.background = "#6C3FC5";
                                  (e.currentTarget as HTMLAnchorElement).style.color = "white";
                                }}
                                onMouseLeave={e => {
                                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                  (e.currentTarget as HTMLAnchorElement).style.color = "#6C3FC5";
                                }}
                              >
                                📞 Call
                              </a>
                              <button
                                onClick={() => setPayPharmacy(ph)}
                                style={{
                                  flex: 1,
                                  padding: "9px 0",
                                  borderRadius: 10,
                                  border: "none",
                                  background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                                  color: "white",
                                  fontWeight: 700,
                                  fontSize: 13,
                                  cursor: "pointer",
                                  transition: "opacity 0.15s",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                              >
                                Pay &amp; Book
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* PAYMENT MODAL */}
      {payPharmacy && (
        <PaymentModal
          pharmacy={payPharmacy}
          onClose={() => setPayPharmacy(null)}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input { font-family: inherit; }
        a { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E5E0FF; border-radius: 3px; }
      `}</style>
    </div>
  );
}
