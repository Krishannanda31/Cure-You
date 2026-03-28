"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", area: "", blood_group: "", gender: "" });
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      showToast("Account created! Welcome to CureYou 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 14px", border: "1.5px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "#F8F7FF" };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#1E1B2E", display: "block", marginBottom: 5 };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1E1B2E 0%, #2d1b5e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{ background: "white", borderRadius: 20, padding: isMobile ? "28px 20px" : "40px 36px", width: "100%", maxWidth: 480, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 20, margin: "0 auto 16px" }}>C</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E1B2E", marginBottom: 6 }}>Join CureYou</h1>
          <p style={{ fontSize: 14, color: "#6B7280" }}>Free forever. Your health. Your data.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input value={form.name} onChange={set("name")} required placeholder="Aap ka naam" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={form.phone} onChange={set("phone")} placeholder="9999999999" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" value={form.email} onChange={set("email")} required placeholder="you@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password *</label>
            <input type="password" value={form.password} onChange={set("password")} required placeholder="Min 6 characters" style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Area</label>
              <input value={form.area} onChange={set("area")} placeholder="Sector 16..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Blood Group</label>
              <select value={form.blood_group} onChange={set("blood_group")} style={inputStyle}>
                <option value="">Select</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={isMobile ? { gridColumn: "1 / -1" } : {}}>
              <label style={labelStyle}>Gender</label>
              <select value={form.gender} onChange={set("gender")} style={inputStyle}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ padding: "14px", background: loading ? "#9CA3AF" : "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#6B7280" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6C3FC5", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
