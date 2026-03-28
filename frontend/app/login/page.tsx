"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast("Welcome back to CureYou! 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1E1B2E 0%, #2d1b5e 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "40px 28px", width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 20, margin: "0 auto 16px" }}>C</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E1B2E", marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#6B7280" }}>Sign in to your CureYou account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1E1B2E", display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com"
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1.5px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "#F8F7FF" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1E1B2E", display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="••••••••"
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1.5px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", background: "#F8F7FF" }} />
          </div>

          <button type="submit" disabled={loading} style={{ padding: "14px", background: loading ? "#9CA3AF" : "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#6B7280" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "#6C3FC5", fontWeight: 600, textDecoration: "none" }}>Create one free</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link href="/join" style={{ fontSize: 13, color: "#818CF8", textDecoration: "none" }}>Are you a doctor or lab? Join CureYou →</Link>
        </div>
      </div>
    </div>
  );
}
