"use client";
import { useState, useEffect, useRef } from "react";

const API = "https://cure-you-backend-production.up.railway.app/api";

interface Service {
  id: number; name: string; type: string; area: string; phone: string;
  open_24h: number; rating: number; distance_km: number;
}
interface ChatMessage { role: "user" | "assistant"; content: string; }

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  pharmacy:    { label: "Pharmacies",     icon: "💊", color: "#6C3FC5" },
  emergency:   { label: "Emergency",      icon: "🚨", color: "#dc2626" },
  blood_bank:  { label: "Blood Banks",    icon: "🩸", color: "#b91c1c" },
  ambulance:   { label: "Ambulance",      icon: "🚑", color: "#d97706" },
  diagnostic:  { label: "Diagnostics",    icon: "🧪", color: "#818CF8" },
  home_nursing:{ label: "Home Nursing",   icon: "🏠", color: "#059669" },
};

export default function NearbyPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: "Namaste! 👋 Main CureYou AI hoon. Aap mujhse apne symptoms, lab reports, medicines, ya kisi bhi health question ke baare mein pooch sakte hain. Main aapki help karne ke liye yahan hoon!\n\nWhat's on your mind today?" }]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (typeFilter) p.set("type", typeFilter);
    fetch(`${API}/nearby?${p}`).then(r => r.json()).then(d => { setServices(d); setLoading(false); });
  }, [typeFilter]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
      setMessages([...newMessages, { role: "assistant", content: "Sorry, AI service is unavailable right now. Please add your ANTHROPIC_API_KEY to backend/.env to enable AI." }]);
    }
    setAiLoading(false);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 8 }}>Nearby + CureYou AI</h1>
        <p style={{ color: "#6B7280" }}>Emergency services in Faridabad · Your personal AI health companion</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Left: Nearby Services */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E1B2E", marginBottom: 16 }}>📍 Emergency Services</h2>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <button onClick={() => setTypeFilter("")} style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid", borderColor: !typeFilter ? "#6C3FC5" : "#E5E0FF", background: !typeFilter ? "rgba(108,63,197,0.1)" : "white", color: !typeFilter ? "#6C3FC5" : "#6B7280", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>All</button>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <button key={k} onClick={() => setTypeFilter(typeFilter === k ? "" : k)} style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid", borderColor: typeFilter === k ? "#6C3FC5" : "#E5E0FF", background: typeFilter === k ? "rgba(108,63,197,0.1)" : "white", color: typeFilter === k ? "#6C3FC5" : "#6B7280", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          {/* Emergency highlight */}
          <div style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>🆘</span>
            <div>
              <div style={{ fontWeight: 700, color: "#dc2626", fontSize: 14 }}>Emergency? Call 108 immediately</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Free government ambulance · Covers all of Faridabad 24/7</div>
            </div>
            <a href="tel:108" style={{ marginLeft: "auto", background: "#dc2626", color: "white", padding: "8px 16px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 13, whiteSpace: "nowrap" }}>Call 108</a>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>Loading services...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto", paddingRight: 4 }}>
              {services.map(s => {
                const meta = TYPE_LABELS[s.type] || { label: s.type, icon: "📍", color: "#6B7280" };
                return (
                  <div key={s.id} className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${meta.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{meta.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#1E1B2E", marginBottom: 2 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>📍 {s.area}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                          {s.open_24h ? <span style={{ background: "rgba(16,185,129,0.1)", color: "#059669", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>Open 24/7</span> : null}
                          {s.rating ? <span style={{ fontSize: 12, color: "#6B7280" }}>⭐ {s.rating}</span> : null}
                          {s.distance_km ? <span style={{ fontSize: 12, color: "#818CF8" }}>📏 ~{s.distance_km}km</span> : null}
                        </div>
                      </div>
                      {s.phone && <a href={`tel:${s.phone}`} style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>📞 Call</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: AI Chat */}
        <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", height: "75vh" }}>
          <div style={{ background: "linear-gradient(135deg, #1E1B2E, #2d1b5e)", padding: "18px 22px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6C3FC5, #6EE7B7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✨</div>
            <div>
              <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>CureYou AI</div>
              <div style={{ fontSize: 12, color: "rgba(110,231,183,0.8)" }}>Your personal health companion · Powered by Claude</div>
            </div>
            <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: 999, background: "#6EE7B7" }} />
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: m.role === "user" ? "linear-gradient(135deg, #6C3FC5, #818CF8)" : "#F8F7FF",
                  color: m.role === "user" ? "white" : "#1E1B2E",
                  fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
                  border: m.role === "assistant" ? "1px solid #E5E0FF" : "none"
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ display: "flex" }}>
                <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#F8F7FF", border: "1px solid #E5E0FF", color: "#6B7280", fontSize: 14 }}>
                  <span>CureYou AI is thinking</span>
                  <span style={{ animation: "pulse 1s infinite" }}>...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: "14px 16px", borderTop: "1px solid #E5E0FF", display: "flex", gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about symptoms, medicines, reports..."
              style={{ flex: 1, padding: "12px 14px", border: "1px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "#F8F7FF" }}
            />
            <button onClick={sendMessage} disabled={aiLoading || !input.trim()} style={{ padding: "12px 18px", background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 20, opacity: (!input.trim() || aiLoading) ? 0.5 : 1 }}>↑</button>
          </div>
          <div style={{ padding: "8px 16px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["I have chest pain", "Explain my HbA1c 7.2", "CBC test kya hota hai", "Nearest blood bank"].map(q => (
              <button key={q} onClick={() => { setInput(q); }} style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid #E5E0FF", background: "white", color: "#6C3FC5", fontSize: 11, cursor: "pointer" }}>{q}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
