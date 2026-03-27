"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useState } from "react";

const links = [
  { href: "/doctors", label: "Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/diagnostics", label: "Diagnostics" },
  { href: "/medicines", label: "Medicines" },
  { href: "/nearby", label: "Nearby + AI" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: "100%", display: "flex", alignItems: "center", gap: 8 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", marginRight: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 13 }}>C</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#6C3FC5" }}>CureYou</span>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "6px 12px", borderRadius: 8, textDecoration: "none",
              fontSize: 13, fontWeight: 500,
              background: pathname === l.href ? "rgba(108,63,197,0.1)" : "transparent",
              color: pathname === l.href ? "#6C3FC5" : "#1E1B2E",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <div style={{ background: "rgba(108,63,197,0.08)", color: "#6C3FC5", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            📍 Faridabad
          </div>

          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name.split(" ")[0]}
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "white", border: "1px solid #E5E0FF", borderRadius: 12, boxShadow: "0 8px 30px rgba(108,63,197,0.15)", minWidth: 180, zIndex: 100, overflow: "hidden" }}>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 16px", fontSize: 14, color: "#1E1B2E", textDecoration: "none", borderBottom: "1px solid #F3F0FF" }}>📊 My Dashboard</Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 16px", fontSize: 14, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>↩ Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ background: "linear-gradient(135deg, #6C3FC5, #818CF8)", color: "white", padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
