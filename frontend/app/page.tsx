"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const modules = [
  { href: "/doctors", icon: "🩺", title: "Doctors", desc: "Find verified doctors by speciality, area & fee. Compare ratings and book instantly." },
  { href: "/hospitals", icon: "🏥", title: "Hospitals", desc: "All hospitals in Faridabad with beds, specialities, and insurance accepted." },
  { href: "/diagnostics", icon: "🧪", title: "Diagnostics", desc: "Compare CBC, HbA1c, Vitamin D prices across every lab near you. Stop overpaying." },
  { href: "/medicines", icon: "💊", title: "Medicines", desc: "Find generic alternatives. Jan Aushadhi prices. Stop paying 10x for the same molecule." },
  { href: "/nearby", icon: "📍", title: "Nearby + AI", desc: "Emergency services, blood banks, pharmacies — plus CureYou AI, your health companion." },
];

const stats = [
  { n: "224+", label: "Verified Doctors" },
  { n: "13", label: "Hospitals Listed" },
  { n: "14", label: "Labs Compared" },
  { n: "92", label: "Test Prices Tracked" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #1E1B2E 0%, #2d1b5e 50%, #1E1B2E 100%)", padding: "80px 24px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(110,231,183,0.15)", border: "1px solid rgba(110,231,183,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: "#6EE7B7", fontSize: 13, fontWeight: 600 }}>🚀 Now live for Faridabad — Healthcare. Simplified.</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, color: "white", marginBottom: 20 }}>
            Your Health.{" "}
            <span style={{ background: "linear-gradient(135deg, #818CF8, #6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Handled.
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, lineHeight: 1.7, marginBottom: 12 }}>
            India&apos;s first true healthcare companion. Find the right doctor, compare lab prices across every lab in Faridabad, and get AI-powered health guidance — all in one place.
          </p>
          <p style={{ color: "rgba(110,231,183,0.8)", fontSize: 15, fontWeight: 500, marginBottom: 40 }}>Aapka Wala Ilaaj.</p>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, maxWidth: 540, margin: "0 auto 48px" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search doctors, tests, hospitals, medicines..."
              style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: "1px solid rgba(129,140,248,0.3)", background: "rgba(255,255,255,0.07)", color: "white", fontSize: 15, outline: "none" }}
            />
            <button type="submit" style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "14px 24px", borderRadius: 10, border: "none", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Search</button>
          </form>

          {/* Stats */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {stats.map(s => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Alert Banner */}
      <div style={{ background: "linear-gradient(90deg, #6C3FC5, #818CF8)", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "white", fontWeight: 700 }}>💰 Kitna Liya?</span>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>CBC test prices in Faridabad range from <strong style={{ color: "#6EE7B7" }}>₹199</strong> to <strong style={{ color: "white" }}>₹350</strong>. CureYou shows you the cheapest NABL-certified lab near you.</span>
          <Link href="/diagnostics" style={{ background: "white", color: "#6C3FC5", padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Compare Now →</Link>
        </div>
      </div>

      {/* 5 Modules */}
      <section style={{ padding: "64px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1E1B2E", marginBottom: 12 }}>Everything you need. One platform.</h2>
          <p style={{ color: "#6B7280", fontSize: 16 }}>Five deeply integrated modules. One account. One AI brain that knows your health.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {modules.map(m => (
            <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 16, padding: 28, cursor: "pointer" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{m.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1E1B2E", marginBottom: 8 }}>{m.title}</div>
                <div style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{m.desc}</div>
                <div style={{ marginTop: 20, color: "#6C3FC5", fontWeight: 600, fontSize: 14 }}>Explore {m.title} →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why CureYou */}
      <section style={{ background: "#1E1B2E", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 40 }}>Why CureYou exists</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              ["₹199 vs ₹350", "Same CBC test. Two labs. 200 metres apart. CureYou shows you before you go."],
              ["224+ Doctors", "Every specialist in Faridabad — verified credentials, real fees, real availability."],
              ["AI 24/7", "Symptom checker, report reader, medicine guide. Always on. Always honest."],
              ["Zero Ads", "No sponsored results hiding cheaper options. Pure, honest healthcare data."],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: 24, background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(129,140,248,0.15)" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#818CF8", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join as Provider */}
      <section style={{ padding: "64px 24px", background: "#F8F7FF" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1E1B2E", marginBottom: 12 }}>Are you a doctor, lab, or hospital in Faridabad?</h2>
          <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 24 }}>List your practice on CureYou for free. Get verified. Start receiving patients.</p>
          <Link href="/join" style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "14px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
            Join CureYou — Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0d0b1a", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          © 2025 CureYou · Faridabad, Haryana · <span style={{ color: "#818CF8" }}>cureyou.in</span> · Aapka Wala Ilaaj
        </div>
      </footer>
    </div>
  );
}
