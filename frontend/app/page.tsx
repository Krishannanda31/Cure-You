"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const quickSearchPills = ["CBC test", "Cardiologist", "Paracetamol generic", "Blood bank"];

const heroStats = [
  { icon: "🩺", n: "224+", label: "Doctors" },
  { icon: "🧪", n: "14", label: "Labs" },
  { icon: "💊", n: "500+", label: "Medicines" },
  { icon: "🏥", n: "13", label: "Hospitals" },
];

const categories = [
  { href: "/doctors", icon: "🩺", title: "Consult Doctor", subtitle: "Find verified specialists", color: "#6C3FC5", bg: "#EDE9FE" },
  { href: "/medicines", icon: "💊", title: "Order Medicines", subtitle: "Generic & branded drugs", color: "#dc2626", bg: "#FEE2E2" },
  { href: "/diagnostics", icon: "🧪", title: "Book Lab Test", subtitle: "Compare prices across labs", color: "#d97706", bg: "#FEF3C7" },
  { href: "/hospitals", icon: "🏥", title: "Find Hospitals", subtitle: "Beds, specialities & more", color: "#059669", bg: "#D1FAE5" },
  { href: "/nearby", icon: "🚑", title: "Emergency", subtitle: "Nearest emergency services", color: "#dc2626", bg: "#FEE2E2" },
  { href: "/nearby", icon: "✨", title: "AI Health Chat", subtitle: "Your 24/7 health companion", color: "#818CF8", bg: "#EDE9FE" },
];

const promoBanners = [
  {
    title: "Save ₹150 on Labs",
    subtitle: "Book any test package",
    cta: "Book Now",
    href: "/diagnostics",
    bg: "linear-gradient(135deg, #6C3FC5 0%, #818CF8 100%)",
    badge: "LIMITED",
  },
  {
    title: "Up to 80% Off Medicines",
    subtitle: "Generic alternatives available",
    cta: "Shop Now",
    href: "/medicines",
    bg: "linear-gradient(135deg, #dc2626 0%, #f97316 100%)",
    badge: "HOT DEAL",
  },
  {
    title: "Free AI Consultation",
    subtitle: "Chat with CureYou AI now",
    cta: "Chat Free",
    href: "/nearby",
    bg: "linear-gradient(135deg, #059669 0%, #6EE7B7 100%)",
    badge: "FREE",
  },
];

const healthPackages = [
  { emoji: "🔬", name: "Full Body Checkup", tests: 72, price: 599, originalPrice: 1299, color: "#6C3FC5", bg: "#EDE9FE" },
  { emoji: "🩸", name: "Diabetes Panel", tests: 8, price: 349, originalPrice: 799, color: "#dc2626", bg: "#FEE2E2" },
  { emoji: "❤️", name: "Heart Health", tests: 12, price: 799, originalPrice: 1599, color: "#e11d48", bg: "#FFE4E6" },
  { emoji: "☀️", name: "Vitamin Profile", tests: 6, price: 499, originalPrice: 999, color: "#d97706", bg: "#FEF3C7" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const handlePillSearch = (pill: string) => {
    router.push(`/search?q=${encodeURIComponent(pill)}`);
  };

  return (
    <div style={{ background: "#F8F7FF", minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #1E1B2E 0%, #2d1b5e 50%, #1E1B2E 100%)",
        padding: isMobile ? "36px 20px 48px" : isTablet ? "48px 24px 60px" : "60px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(108,63,197,0.18)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(110,231,183,0.12)", filter: "blur(50px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile || isTablet ? "1fr" : "1fr 420px", gap: isMobile ? 32 : 60, alignItems: "center" }}>

          {/* LEFT: headline + search */}
          <div>
            {/* Location pill */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(110,231,183,0.12)", border: "1px solid rgba(110,231,183,0.3)", borderRadius: 999, padding: "6px 14px", marginBottom: 28 }}>
              <span style={{ fontSize: 13 }}>📍</span>
              <span style={{ color: "#6EE7B7", fontSize: 13, fontWeight: 600 }}>Faridabad, Haryana</span>
              <span style={{ color: "rgba(110,231,183,0.5)", fontSize: 12 }}>▾</span>
            </div>

            <h1 style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 900, lineHeight: 1.1, color: "white", marginBottom: 16, letterSpacing: "-0.5px" }}>
              Healthcare at your{" "}
              <span style={{ background: "linear-gradient(135deg, #818CF8, #6EE7B7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                fingertips.
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Find doctors, compare lab prices, order medicines, and chat with AI — all in one place. <strong style={{ color: "rgba(255,255,255,0.85)" }}>Aapka Wala Ilaaj.</strong>
            </p>

            {/* Big search bar */}
            <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", background: "white", borderRadius: 16, padding: "6px 6px 6px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.25)", border: "2px solid rgba(108,63,197,0.15)" }}>
                <span style={{ fontSize: 18, marginRight: 10, opacity: 0.5 }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search doctors, tests, hospitals, medicines..."
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#1E1B2E", background: "transparent", padding: "10px 0" }}
                />
                <button
                  type="submit"
                  style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "13px 28px", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick search pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, paddingTop: 6 }}>Try:</span>
              {quickSearchPills.map(pill => (
                <button
                  key={pill}
                  onClick={() => handlePillSearch(pill)}
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 14px", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: feature cards — hidden on mobile/tablet */}
          <div style={{ display: isMobile || isTablet ? "none" : "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "🩺", title: "Consult a Specialist", sub: "224+ verified doctors · Book in 2 mins", color: "#818CF8", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.25)", href: "/doctors" },
              { icon: "🧪", title: "Compare Lab Prices", sub: "Same test, different price — we show all", color: "#6EE7B7", bg: "rgba(110,231,183,0.1)", border: "rgba(110,231,183,0.25)", href: "/diagnostics" },
              { icon: "💊", title: "Order Medicines", sub: "Up to 80% off on generics · Fast delivery", color: "#FCD34D", bg: "rgba(252,211,77,0.1)", border: "rgba(252,211,77,0.22)", href: "/medicines" },
              { icon: "✨", title: "AI Health Chat", sub: "Ask symptoms, reports, medicines — free", color: "#C4B5FD", bg: "rgba(196,181,253,0.1)", border: "rgba(196,181,253,0.25)", href: "/nearby" },
            ].map(card => (
              <Link key={card.title} href={card.href} style={{ textDecoration: "none" }}>
                <div style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  transition: "transform 0.18s, background 0.18s",
                  backdropFilter: "blur(8px)",
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: "rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, border: `1px solid ${card.border}`,
                  }}>{card.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{card.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.4 }}>{card.sub}</div>
                  </div>
                  <span style={{ color: card.color, fontSize: 18, opacity: 0.7 }}>→</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── WHAT DO YOU NEED TODAY? ── */}
      <section style={{ padding: isMobile ? "36px 16px 32px" : "64px 24px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: isMobile ? 24 : 36 }}>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 32px)", fontWeight: 800, color: "#1E1B2E", marginBottom: 8 }}>
            What do you need today?
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15 }}>All your health services, right here</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : isTablet ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: isMobile ? 10 : 16, alignItems: "stretch" }}>
          {categories.map(cat => (
            <Link key={cat.href + cat.title} href={cat.href} style={{ textDecoration: "none", display: "flex" }}>
              <div
                className="card-hover"
                style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: isMobile ? 12 : 16, padding: isMobile ? "16px 8px" : "24px 16px", textAlign: "center", cursor: "pointer", flex: 1 }}
              >
                <div style={{ width: isMobile ? 44 : 56, height: isMobile ? 44 : 56, borderRadius: isMobile ? 12 : 16, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: isMobile ? "0 auto 10px" : "0 auto 14px", fontSize: isMobile ? 20 : 26 }}>
                  {cat.icon}
                </div>
                <div style={{ fontSize: isMobile ? 11 : 15, fontWeight: 700, color: "#1E1B2E", marginBottom: 3 }}>{cat.title}</div>
                {!isMobile && <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4 }}>{cat.subtitle}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROMO BANNERS ── */}
      <section style={{ padding: isMobile ? "0 16px 40px" : "0 24px 56px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {promoBanners.map(b => (
            <Link key={b.title} href={b.href} style={{ textDecoration: "none" }}>
              <div
                className="card-hover"
                style={{ background: b.bg, borderRadius: 18, padding: "28px 24px", position: "relative", overflow: "hidden", cursor: "pointer" }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, right: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ position: "relative" }}>
                  <span style={{ background: "rgba(255,255,255,0.25)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, letterSpacing: 0.5 }}>
                    {b.badge}
                  </span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "white", margin: "12px 0 6px" }}>{b.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 18 }}>{b.subtitle}</p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "white", borderRadius: 999, padding: "8px 18px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E1B2E" }}>{b.cta}</span>
                    <span style={{ fontSize: 13, color: "#6C3FC5" }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── POPULAR HEALTH PACKAGES ── */}
      <section style={{ padding: isMobile ? "0 16px 48px" : "0 24px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#1E1B2E", marginBottom: 4 }}>
              Popular Health Packages
            </h2>
            <p style={{ color: "#6B7280", fontSize: 14 }}>NABL-certified labs · Home sample collection</p>
          </div>
          <Link href="/diagnostics" style={{ color: "#6C3FC5", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            View all packages →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
          {healthPackages.map(pkg => (
            <div
              key={pkg.name}
              className="card-hover"
              style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 18, overflow: "hidden", cursor: "pointer" }}
            >
              {/* Colored image area */}
              <div style={{ background: pkg.bg, height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, position: "relative" }}>
                {pkg.emoji}
                <div style={{ position: "absolute", top: 10, right: 12, background: pkg.color, color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                  {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% off
                </div>
              </div>
              <div style={{ padding: "18px 18px 20px" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1E1B2E", marginBottom: 4 }}>{pkg.name}</div>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>Includes {pkg.tests} tests</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#1E1B2E" }}>₹{pkg.price}</span>
                    <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 6, textDecoration: "line-through" }}>₹{pkg.originalPrice}</span>
                  </div>
                  <Link href="/diagnostics" style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", fontSize: 13, fontWeight: 700, padding: "8px 16px", borderRadius: 10, textDecoration: "none" }}>
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KITNA LIYA? PRICE ALERT BANNER ── */}
      <section style={{ padding: isMobile ? "0 16px 48px" : "0 24px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #1E1B2E 0%, #2d1b5e 60%, #1E1B2E 100%)", borderRadius: isMobile ? 16 : 20, padding: isMobile ? "24px 20px" : "36px 40px", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: 80, width: 200, height: 200, borderRadius: "50%", background: "rgba(108,63,197,0.2)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-block", background: "rgba(110,231,183,0.15)", border: "1px solid rgba(110,231,183,0.3)", borderRadius: 999, padding: "4px 14px", marginBottom: 12 }}>
              <span style={{ color: "#6EE7B7", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>💰 KITNA LIYA?</span>
            </div>
            <h3 style={{ fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 800, color: "white", marginBottom: 8 }}>
              CBC test prices vary <span style={{ color: "#6EE7B7" }}>₹199</span> to <span style={{ color: "white" }}>₹350</span> nearby
            </h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
              Same test. Same city. ₹151 difference. CureYou shows you the cheapest NABL-certified lab near you.
            </p>
          </div>
          <Link
            href="/diagnostics"
            style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, position: "relative" }}
          >
            Compare Now →
          </Link>
        </div>
      </section>

      {/* ── PROVIDER CTA ── */}
      <section style={{ padding: isMobile ? "0 16px 48px" : "0 24px 64px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F8F7FF 100%)", border: "1.5px solid #E5E0FF", borderRadius: isMobile ? 16 : 20, padding: isMobile ? "32px 20px" : "48px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏥</div>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "#1E1B2E", marginBottom: 12 }}>
            Are you a doctor, lab, or hospital in Faridabad?
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, marginBottom: 12, maxWidth: 540, margin: "0 auto 20px" }}>
            List your practice on CureYou for free. Get verified. Start receiving patients today.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/join" style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block" }}>
              Join as Doctor / Lab
            </Link>
            <Link href="/hospitals" style={{ background: "white", color: "#6C3FC5", padding: "14px 32px", borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block", border: "1.5px solid #E5E0FF" }}>
              List Your Hospital
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d0b1a", padding: "40px 24px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 8 }}>
                Cure<span style={{ color: "#818CF8" }}>You</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, maxWidth: 200, lineHeight: 1.6 }}>
                Healthcare simplified for Faridabad.
              </div>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { heading: "Services", links: [{ label: "Doctors", href: "/doctors" }, { label: "Diagnostics", href: "/diagnostics" }, { label: "Medicines", href: "/medicines" }, { label: "Hospitals", href: "/hospitals" }] },
                { heading: "Quick Links", links: [{ label: "Emergency", href: "/nearby" }, { label: "AI Chat", href: "/nearby" }, { label: "Join as Provider", href: "/join" }] },
              ].map(col => (
                <div key={col.heading}>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
                    {col.heading}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {col.links.map(l => (
                      <Link key={l.label} href={l.href} style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none" }}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>© 2025 CureYou · Faridabad, Haryana</span>
            <span style={{ color: "#818CF8", fontSize: 13 }}>cureyou.in · Aapka Wala Ilaaj</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
