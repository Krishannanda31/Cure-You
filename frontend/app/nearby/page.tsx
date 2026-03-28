"use client";
import { useState, useEffect, useRef } from "react";

const API = "https://cure-you-backend-production.up.railway.app/api";

interface Service {
  id: number; name: string; type: string; area: string; phone: string;
  open_24h: number; rating: number; distance_km: number;
}
interface ChatMessage { role: "user" | "assistant"; content: string; }

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  pharmacy:    { label: "Pharmacy",     icon: "💊", color: "#6C3FC5" },
  emergency:   { label: "Emergency",   icon: "🚨", color: "#dc2626" },
  blood_bank:  { label: "Blood Bank",  icon: "🩸", color: "#b91c1c" },
  ambulance:   { label: "Ambulance",   icon: "🚑", color: "#d97706" },
  diagnostic:  { label: "Diagnostics", icon: "🧪", color: "#818CF8" },
  home_nursing:{ label: "Home Care",   icon: "🏠", color: "#059669" },
};

const DISCOUNTS = ["10% OFF", "15% OFF", "Free Consultation", "₹50 Cashback", "20% OFF", "Buy 2 Get 1"];

const FEATURED_OFFERS = [
  {
    name: "Dr. Lal PathLabs",
    offer: "30% off CBC + Free consultation",
    price: "₹139",
    was: "₹199",
    gradient: "linear-gradient(135deg, #818CF8 0%, #6C3FC5 100%)",
    icon: "🧪",
  },
  {
    name: "Apollo Pharmacy",
    offer: "Buy medicines ₹500, get ₹75 cashback",
    price: "₹500+",
    was: null,
    gradient: "linear-gradient(135deg, #059669 0%, #6EE7B7 100%)",
    icon: "💊",
  },
  {
    name: "Aggarwal Diagnostic",
    offer: "Free home collection on orders ₹300+",
    price: "₹300+",
    was: null,
    gradient: "linear-gradient(135deg, #d97706 0%, #fcd34d 100%)",
    icon: "🏠",
  },
  {
    name: "MedPlus",
    offer: "Flat 20% off on all vitamins",
    price: "20% OFF",
    was: null,
    gradient: "linear-gradient(135deg, #b91c1c 0%, #f87171 100%)",
    icon: "💊",
  },
  {
    name: "City Hospital",
    offer: "Free OPD consultation on Saturdays",
    price: "FREE",
    was: "₹300",
    gradient: "linear-gradient(135deg, #6C3FC5 0%, #818CF8 100%)",
    icon: "🏥",
  },
];

const CONSULTATION_FEES: Record<string, number> = {
  pharmacy: 99,
  emergency: 499,
  blood_bank: 199,
  ambulance: 799,
  diagnostic: 299,
  home_nursing: 399,
};

const FILTER_TABS = [
  { key: "", label: "All" },
  { key: "pharmacy", label: "💊 Pharmacy" },
  { key: "diagnostic", label: "🧪 Diagnostics" },
  { key: "emergency", label: "🚨 Hospital" },
  { key: "blood_bank", label: "🩸 Blood Bank" },
  { key: "home_nursing", label: "🏠 Home Care" },
];

export default function NearbyPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Payment modal state
  const [payModal, setPayModal] = useState<{ service: Service } | null>(null);
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: "Koi emergency toh nahi? 🙏\nMain aapki kis prakar sahayata kar sakta hoon — pharmacy, doctor, lab test, ya koi bhi health sawaal."
  }]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (typeFilter) p.set("type", typeFilter);
    fetch(`${API}/nearby?${p}`).then(r => r.json()).then(d => { setServices(d); setLoading(false); });
  }, [typeFilter]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      () => { setLocationGranted(true); setLocationLoading(false); },
      (err) => { setLocationError(err.message || "Could not get your location. Please allow access."); setLocationLoading(false); }
    );
  };

  const openPayModal = (service: Service) => {
    setPayModal({ service });
    setPayMethod("upi");
    setPayLoading(false);
    setPaySuccess(false);
  };

  const closePayModal = () => {
    setPayModal(null);
    setPaySuccess(false);
    setPayLoading(false);
  };

  const handlePay = () => {
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPaySuccess(true);
      setTimeout(() => closePayModal(), 1800);
    }, 1600);
  };

  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMessages);
    setAiLoading(true);
    try {
      const r = await fetch(`${API}/ai/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages.slice(-6) })
      });
      const data = await r.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || data.error }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "AI service se connect nahi ho pa raha. Thodi der baad dobara try karein. 🙏" }]);
    }
    setAiLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF" }}>

      {/* ── HERO: full viewport AI chat ── */}
      <div style={{
        background: "linear-gradient(160deg, #0f0c1e 0%, #1a1035 50%, #0f0c1e 100%)",
        height: "calc(100vh - 64px)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -80, right: 120, width: 400, height: 400, borderRadius: "50%", background: "rgba(108,63,197,0.15)", filter: "blur(90px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: 80, width: 300, height: 300, borderRadius: "50%", background: "rgba(110,231,183,0.07)", filter: "blur(70px)", pointerEvents: "none" }} />

        {/* Header bar */}
        <div style={{ padding: isMobile ? "16px 20px 16px" : "40px 40px 16px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #6C3FC5, #6EE7B7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✨</div>
          <div>
            <div style={{ fontWeight: 800, color: "white", fontSize: 18 }}>CureYou AI</div>
            <div style={{ fontSize: 12, color: "rgba(110,231,183,0.8)" }}>Your personal health assistant · Faridabad</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "#6EE7B7", boxShadow: "0 0 8px #6EE7B7" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 40px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 860, width: "100%", margin: "0 auto", alignSelf: "stretch" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 10 }}>
              {m.role === "assistant" && (
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>✨</div>
              )}
              <div style={{
                maxWidth: "75%", padding: "12px 16px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user" ? "linear-gradient(135deg, #6C3FC5, #818CF8)" : "rgba(255,255,255,0.07)",
                color: "white", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
                border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none",
                boxShadow: m.role === "user" ? "0 4px 20px rgba(108,63,197,0.4)" : "none",
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>✨</div>
              <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                Thinking<span style={{ letterSpacing: 3 }}>···</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        <div style={{ padding: isMobile ? "0 16px 10px" : "0 40px 10px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", maxWidth: 860, width: "100%", margin: "0 auto", alignSelf: "stretch", flexShrink: 0 }}>
          {["Nearest pharmacy", "Chest pain help", "Blood bank", "Home nurse", "Lab test"].map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: isMobile ? "10px 16px 20px" : "10px 40px 28px", display: "flex", gap: 10, maxWidth: 860, width: "100%", margin: "0 auto", alignSelf: "stretch", flexShrink: 0 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything — symptoms, nearest pharmacy, lab tests, doctors..."
            style={{ flex: 1, padding: "14px 18px", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 14, fontSize: 14, outline: "none", background: "rgba(255,255,255,0.07)", color: "white", backdropFilter: "blur(8px)" }}
          />
          <button onClick={sendMessage} disabled={aiLoading || !input.trim()} style={{ padding: "14px 20px", background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", border: "none", borderRadius: 14, fontWeight: 800, cursor: (!input.trim() || aiLoading) ? "not-allowed" : "pointer", fontSize: 20, opacity: (!input.trim() || aiLoading) ? 0.35 : 1, flexShrink: 0, boxShadow: "0 4px 20px rgba(108,63,197,0.5)" }}>↑</button>
        </div>
      </div>

      {/* ── BELOW HERO: all services ── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: isMobile ? "16px 14px" : "28px 32px" }}>

        {/* Payment Modal */}
        {payModal && (
          <div
            onClick={closePayModal}
            style={{
              position: "fixed", inset: 0, background: "rgba(30,27,46,0.55)",
              zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "white", borderRadius: isMobile ? 16 : 20,
                padding: isMobile ? "24px 18px" : "32px 28px",
                width: isMobile ? "calc(100vw - 32px)" : 380,
                maxWidth: 420,
                boxShadow: "0 20px 60px rgba(108,63,197,0.18)",
                border: "1px solid #E5E0FF"
              }}
            >
              {paySuccess ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: "#059669", marginBottom: 6 }}>
                    Booked Successfully!
                  </div>
                  <div style={{ fontSize: 13, color: "#6B7280" }}>
                    Your appointment at {payModal.service.name} is confirmed.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: "#1E1B2E", marginBottom: 4 }}>
                      {payModal.service.type === "pharmacy" ? "Pay for Medicines" : "Book Appointment"}
                    </div>
                    <div style={{ fontSize: 14, color: "#6C3FC5", fontWeight: 600 }}>
                      {payModal.service.name}
                    </div>
                  </div>

                  <div style={{
                    background: "#F8F7FF", borderRadius: 12, padding: "14px 16px",
                    marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>Consultation Fee</div>
                      <div style={{ fontWeight: 800, fontSize: 22, color: "#1E1B2E" }}>
                        ₹{CONSULTATION_FEES[payModal.service.type] || 299}
                      </div>
                    </div>
                    <div style={{
                      background: "rgba(108,63,197,0.1)", color: "#6C3FC5",
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999
                    }}>
                      CureYou Pay
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Payment Method
                    </div>
                    {(["upi", "card", "netbanking"] as const).map(method => (
                      <label
                        key={method}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 14px", borderRadius: 10, marginBottom: 8,
                          border: `1.5px solid ${payMethod === method ? "#6C3FC5" : "#E5E0FF"}`,
                          background: payMethod === method ? "rgba(108,63,197,0.04)" : "white",
                          cursor: "pointer", transition: "all 0.15s"
                        }}
                      >
                        <input
                          type="radio"
                          checked={payMethod === method}
                          onChange={() => setPayMethod(method)}
                          style={{ accentColor: "#6C3FC5" }}
                        />
                        <span style={{ fontSize: 20 }}>
                          {method === "upi" ? "📱" : method === "card" ? "💳" : "🏦"}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1E1B2E" }}>
                          {method === "upi" ? "UPI" : method === "card" ? "Card" : "Net Banking"}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={closePayModal}
                      style={{
                        flex: 1, padding: "13px", borderRadius: 12,
                        border: "1.5px solid #E5E0FF", background: "white",
                        color: "#6B7280", fontWeight: 700, fontSize: 14, cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePay}
                      disabled={payLoading}
                      style={{
                        flex: 2, padding: "13px", borderRadius: 12,
                        border: "none",
                        background: payLoading ? "#C4B5FD" : "linear-gradient(135deg, #6C3FC5, #818CF8)",
                        color: "white", fontWeight: 800, fontSize: 14, cursor: payLoading ? "not-allowed" : "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      {payLoading ? "Processing..." : `Pay ₹${CONSULTATION_FEES[payModal.service.type] || 299}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Services section — full width */}
        <div>
          <div>

            {/* Location Permission Banner */}
            {!locationGranted && (
              <div style={{
                background: "linear-gradient(135deg, #6C3FC5 0%, #818CF8 100%)",
                borderRadius: 14, padding: "16px 20px", marginBottom: 18,
                display: "flex", alignItems: "center", flexWrap: "wrap",
                gap: 12, boxShadow: "0 6px 24px rgba(108,63,197,0.28)"
              }}>
                <div style={{ fontSize: 38, flexShrink: 0 }}>📍</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: "white", fontSize: 17, marginBottom: 4 }}>
                    Find exclusive deals near you — Enable Location
                  </div>
                  {locationError ? (
                    <div style={{ fontSize: 12, color: "#fca5a5" }}>{locationError}</div>
                  ) : (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>
                      Unlock personalised offers &amp; discounts from verified facilities
                    </div>
                  )}
                </div>
                <button
                  onClick={requestLocation}
                  disabled={locationLoading}
                  style={{
                    background: "white", color: "#6C3FC5", border: "none",
                    borderRadius: 12, padding: "12px 22px", fontWeight: 800,
                    fontSize: 14, cursor: locationLoading ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap", opacity: locationLoading ? 0.7 : 1, flexShrink: 0,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.12)"
                  }}
                >
                  {locationLoading ? "Locating..." : "Allow Location"}
                </button>
              </div>
            )}

            {/* Location success bar */}
            {locationGranted && (
              <div style={{
                background: "rgba(110,231,183,0.13)", border: "1px solid rgba(110,231,183,0.45)",
                borderRadius: 12, padding: "12px 18px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10
              }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <span style={{ color: "#059669", fontWeight: 700, fontSize: 13 }}>Using your location</span>
                <span style={{ color: "#6B7280", fontSize: 12, marginLeft: 4 }}>· Faridabad</span>
              </div>
            )}

            {/* Featured Deals Horizontal Scroll */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#1E1B2E", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                🎉 Featured Offers
              </div>
              <div style={{
                display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8,
                scrollbarWidth: "none"
              }}>
                {FEATURED_OFFERS.map((offer, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: 260, width: 260, borderRadius: 16, overflow: "hidden",
                      flexShrink: 0, background: offer.gradient,
                      boxShadow: "0 4px 20px rgba(108,63,197,0.15)", cursor: "pointer"
                    }}
                  >
                    <div style={{ padding: "18px 18px 14px" }}>
                      <div style={{ fontSize: 30, marginBottom: 8 }}>{offer.icon}</div>
                      <div style={{ fontWeight: 800, color: "white", fontSize: 14, marginBottom: 4 }}>
                        {offer.name}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 12, lineHeight: 1.5 }}>
                        {offer.offer}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span style={{ fontWeight: 900, color: "white", fontSize: 18 }}>{offer.price}</span>
                          {offer.was && (
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textDecoration: "line-through", marginLeft: 6 }}>
                              {offer.was}
                            </span>
                          )}
                        </div>
                        <button style={{
                          background: "rgba(255,255,255,0.22)", color: "white",
                          border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 10,
                          padding: "7px 14px", fontWeight: 800, fontSize: 12, cursor: "pointer",
                          backdropFilter: "blur(4px)"
                        }}>
                          Book &amp; Pay
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setTypeFilter(tab.key)}
                  style={{
                    padding: "8px 18px", borderRadius: 999,
                    border: `1.5px solid ${typeFilter === tab.key ? "#6C3FC5" : "#E5E0FF"}`,
                    background: typeFilter === tab.key ? "#6C3FC5" : "white",
                    color: typeFilter === tab.key ? "white" : "#6B7280",
                    fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Emergency Card */}
            <div style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              borderRadius: 16, padding: "18px 22px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 16,
              boxShadow: "0 4px 20px rgba(220,38,38,0.25)"
            }}>
              <div style={{ fontSize: 34 }}>🆘</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: "white", fontSize: 16, marginBottom: 3 }}>
                  Emergency? Call 108
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                  Free · 24/7 · All Faridabad
                </div>
              </div>
              <a
                href="tel:108"
                style={{
                  background: "white", color: "#dc2626", padding: "11px 22px",
                  borderRadius: 11, fontWeight: 800, textDecoration: "none",
                  fontSize: 14, whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >
                Call 108
              </a>
            </div>

            {/* Service Cards Grid */}
            {loading ? (
              <div style={{
                textAlign: "center", padding: "60px 0", color: "#6B7280",
                background: "white", borderRadius: 16, border: "1px solid #E5E0FF"
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                <div style={{ fontWeight: 600 }}>Loading services...</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {services.map(s => {
                  const meta = TYPE_LABELS[s.type] || { label: s.type, icon: "📍", color: "#6B7280" };
                  const discount = DISCOUNTS[s.id % DISCOUNTS.length];
                  const fee = CONSULTATION_FEES[s.type] || 299;
                  const isPayOnly = s.type === "pharmacy";
                  return (
                    <div
                      key={s.id}
                      className="card-hover"
                      style={{
                        background: "white", border: "1px solid #E5E0FF",
                        borderRadius: 18, overflow: "hidden", display: "flex",
                        flexDirection: "column", position: "relative"
                      }}
                    >
                      {/* Card image area */}
                      <div style={{
                        height: 160, position: "relative", flexShrink: 0,
                        background: `linear-gradient(135deg, ${meta.color}33 0%, ${meta.color}66 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56
                      }}>
                        {meta.icon}

                        {/* OPEN 24/7 ribbon */}
                        {s.open_24h ? (
                          <div style={{
                            position: "absolute", top: 12, left: 0,
                            background: "#059669", color: "white", fontSize: 10,
                            fontWeight: 800, padding: "4px 12px 4px 8px",
                            borderRadius: "0 999px 999px 0",
                            boxShadow: "0 2px 6px rgba(5,150,105,0.35)"
                          }}>
                            OPEN 24/7
                          </div>
                        ) : null}

                        {/* Discount badge */}
                        <div style={{
                          position: "absolute", top: 12, right: 12,
                          background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                          color: "white", fontSize: 10, fontWeight: 800,
                          padding: "5px 10px", borderRadius: 8,
                          boxShadow: "0 2px 8px rgba(108,63,197,0.4)"
                        }}>
                          {discount}
                        </div>

                        {/* Type badge overlay */}
                        <div style={{
                          position: "absolute", bottom: 10, left: 12,
                          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
                          color: meta.color, fontSize: 11, fontWeight: 800,
                          padding: "4px 10px", borderRadius: 8,
                          display: "flex", alignItems: "center", gap: 4
                        }}>
                          {meta.icon} {meta.label}
                        </div>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#1E1B2E", lineHeight: 1.3 }}>
                          {s.name}
                        </div>

                        <div style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                          📍 {s.area}
                        </div>

                        {/* Rating + distance */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {s.rating ? (
                            <span style={{ fontSize: 13, color: "#1E1B2E", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                              ⭐ {s.rating}
                            </span>
                          ) : null}
                          {s.distance_km ? (
                            <span style={{ fontSize: 12, color: "#818CF8", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                              📏 ~{s.distance_km} km
                            </span>
                          ) : null}
                        </div>

                        {/* CureYou Pay badge */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            background: "rgba(108,63,197,0.08)", color: "#6C3FC5",
                            fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 999,
                            border: "1px solid rgba(108,63,197,0.18)"
                          }}>
                            ✓ Accepting CureYou Pay
                          </span>
                        </div>

                        {/* Action bar */}
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          {s.phone && (
                            <a
                              href={`tel:${s.phone}`}
                              style={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                gap: 6, border: "1.5px solid #E5E0FF", background: "white",
                                color: "#6C3FC5", padding: "10px 12px", borderRadius: 11,
                                fontSize: 13, fontWeight: 700, textDecoration: "none", cursor: "pointer"
                              }}
                            >
                              📞 Call
                            </a>
                          )}
                          <button
                            onClick={() => openPayModal(s)}
                            style={{
                              flex: 2, display: "flex", alignItems: "center", justifyContent: "center",
                              gap: 6, background: "linear-gradient(135deg, #6C3FC5, #818CF8)",
                              color: "white", border: "none", padding: "10px 14px",
                              borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: "pointer",
                              boxShadow: "0 2px 10px rgba(108,63,197,0.28)"
                            }}
                          >
                            {isPayOnly ? "Pay Now" : "Book & Pay"} → <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>₹{fee}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
