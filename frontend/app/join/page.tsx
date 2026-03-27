"use client";
import { useState } from "react";
import { useToast } from "@/components/Toast";

const API = "https://cure-you-backend-production.up.railway.app/api";

export default function JoinPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ provider_type: "lab", name: "", contact_person: "", email: "", phone: "", address: "", area: "", registration_number: "", accreditation: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(`${API}/providers/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      showToast("Registration submitted! We'll verify and activate your profile within 24 hours. ✓");
      setSubmitted(true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Submission failed", "error");
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "11px 14px", border: "1.5px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "#F8F7FF" };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#1E1B2E", display: "block", marginBottom: 5 };

  if (submitted) return (
    <div style={{ maxWidth: 560, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 20, padding: "48px 40px" }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1E1B2E", marginBottom: 12 }}>Registration Submitted!</h2>
        <p style={{ color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>Our team will verify your credentials and activate your CureYou profile within <strong>24 hours</strong>. You&apos;ll receive a confirmation on your email.</p>
        <div style={{ background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.3)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, color: "#6B7280" }}>What happens next:</div>
          <div style={{ fontSize: 14, color: "#1E1B2E", marginTop: 8, textAlign: "left" }}>
            {["✓ Document verification (NABL/MCI/registration)","✓ CureYou Verified badge awarded","✓ Profile goes live — visible to all users","✓ Patients can book directly through CureYou"].map(s => <div key={s} style={{ marginBottom: 4 }}>{s}</div>)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 10 }}>Join CureYou as a Provider</h1>
        <p style={{ color: "#6B7280", fontSize: 16 }}>Free listing. Zero upfront cost. Start getting patients today.</p>
      </div>

      {/* Benefits */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 36 }}>
        {[
          ["🆓", "Free Listing", "No setup fee. No monthly charge to list."],
          ["✓", "Verified Badge", "CureYou Verified — builds patient trust instantly."],
          ["📊", "Analytics", "See who's viewing your profile and where they come from."],
          ["📅", "Direct Bookings", "Patients book directly through CureYou — you get notified."],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1E1B2E", marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 20, padding: "32px 28px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={labelStyle}>Provider Type *</label>
            <select value={form.provider_type} onChange={set("provider_type")} style={inputStyle}>
              <option value="lab">Diagnostic Lab</option>
              <option value="doctor">Doctor / Clinic</option>
              <option value="hospital">Hospital</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Name of {form.provider_type === "doctor" ? "Doctor/Clinic" : form.provider_type === "lab" ? "Lab" : "Provider"} *</label>
              <input value={form.name} onChange={set("name")} required placeholder={form.provider_type === "lab" ? "e.g. City Diagnostics" : "Dr. Full Name / Clinic Name"} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contact Person</label>
              <input value={form.contact_person} onChange={set("contact_person")} placeholder="Your name" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={form.email} onChange={set("email")} required placeholder="contact@yourbusiness.in" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input value={form.phone} onChange={set("phone")} required placeholder="9999999999" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Address in Faridabad</label>
            <input value={form.address} onChange={set("address")} placeholder="Full address with sector/area" style={inputStyle} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Registration / Licence No.</label>
              <input value={form.registration_number} onChange={set("registration_number")} placeholder={form.provider_type === "doctor" ? "MCI Reg. No." : "NABL / CDSCO No."} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Accreditation</label>
              <input value={form.accreditation} onChange={set("accreditation")} placeholder="NABL, NABH, JCI..." style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ padding: "14px", background: loading ? "#9CA3AF" : "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "Submitting..." : "Submit Registration — Free"}
          </button>
        </form>
      </div>
    </div>
  );
}
