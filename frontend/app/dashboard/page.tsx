"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

const API = "http://localhost:5001/api";

interface Booking { id: number; booking_type: string; reference_name: string; test_name: string; booking_date: string; booking_time: string; status: string; amount: number; }
interface HealthRecord { id: number; record_type: string; title: string; test_name: string; lab_name: string; record_date: string; }

const STATUS_COLORS: Record<string, string> = { pending: "#d97706", confirmed: "#6C3FC5", completed: "#059669", cancelled: "#dc2626" };
const RECORD_ICONS: Record<string, string> = { lab_report: "🧪", prescription: "💊", discharge_summary: "🏥", scan: "🔬" };

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "bookings" | "records" | "profile">("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [recordSummary, setRecordSummary] = useState<{ total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/bookings`, { headers }).then(r => r.json()),
      fetch(`${API}/health-records`, { headers }).then(r => r.json()),
      fetch(`${API}/health-records/summary`, { headers }).then(r => r.json()),
    ]).then(([b, rec, summ]) => { setBookings(b); setRecords(rec); setRecordSummary(summ); setLoading(false); });
  }, [token, router]);

  const cancelBooking = async (id: number) => {
    await fetch(`${API}/bookings/${id}/cancel`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    showToast("Booking cancelled");
  };

  if (!user || loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", color: "#6B7280" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <div>Loading your dashboard...</div>
      </div>
    </div>
  );

  const tabStyle = (t: string) => ({
    padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
    background: tab === t ? "linear-gradient(135deg, #6C3FC5, #818CF8)" : "white",
    color: tab === t ? "white" : "#6B7280",
    transition: "all 0.15s",
  } as React.CSSProperties);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1E1B2E", marginBottom: 4 }}>
            Namaste, {user.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>📍 {user.area || "Faridabad"} {user.blood_group ? `· 🩸 ${user.blood_group}` : ""}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} style={{ padding: "8px 16px", border: "1px solid #E5E0FF", borderRadius: 8, background: "white", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { icon: "📅", label: "Total Bookings", value: bookings.length, color: "#6C3FC5" },
          { icon: "✅", label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "#059669" },
          { icon: "⏳", label: "Upcoming", value: bookings.filter(b => b.status === "pending" || b.status === "confirmed").length, color: "#d97706" },
          { icon: "📋", label: "Health Records", value: recordSummary?.total || 0, color: "#818CF8" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {(["overview","bookings","records","profile"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
            {{ overview: "Overview", bookings: "My Bookings", records: "Health Records", profile: "Profile" }[t]}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E1B2E", marginBottom: 16 }}>Recent Bookings</h3>
            {bookings.slice(0, 3).length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: "#9CA3AF", fontSize: 14 }}>
                No bookings yet. <Link href="/doctors" style={{ color: "#6C3FC5" }}>Find a doctor →</Link>
              </div>
            ) : bookings.slice(0, 3).map(b => (
              <div key={b.id} style={{ padding: "12px 0", borderBottom: "1px solid #F3F0FF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1B2E" }}>{b.reference_name}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{b.booking_date} {b.booking_time ? `at ${b.booking_time}` : ""}</div>
                </div>
                <span style={{ background: `${STATUS_COLORS[b.status]}15`, color: STATUS_COLORS[b.status], fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
          <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E1B2E", marginBottom: 16 }}>Quick Actions</h3>
            {[
              { href: "/doctors", icon: "🩺", label: "Book a Doctor", desc: "Find specialists in Faridabad" },
              { href: "/diagnostics", icon: "🧪", label: "Compare Lab Prices", desc: "Find cheapest NABL lab" },
              { href: "/nearby", icon: "✨", label: "Ask CureYou AI", desc: "Symptoms, reports, medicines" },
              { href: "/medicines", icon: "💊", label: "Find Generic Medicine", desc: "Save up to 90%" },
            ].map(a => (
              <Link key={a.href} href={a.href} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F3F0FF", textDecoration: "none" }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1B2E" }}>{a.label}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{a.desc}</div>
                </div>
                <span style={{ marginLeft: "auto", color: "#6C3FC5" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bookings */}
      {tab === "bookings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>No bookings yet</div>
              <Link href="/doctors" style={{ color: "#6C3FC5", fontWeight: 600 }}>Book your first doctor appointment →</Link>
            </div>
          ) : bookings.map(b => (
            <div key={b.id} style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 28 }}>{b.booking_type === "doctor" ? "🩺" : "🧪"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1E1B2E", marginBottom: 2 }}>{b.reference_name}</div>
                {b.test_name && <div style={{ fontSize: 13, color: "#6C3FC5" }}>{b.test_name}</div>}
                <div style={{ fontSize: 13, color: "#6B7280" }}>📅 {b.booking_date}{b.booking_time ? ` at ${b.booking_time}` : ""}</div>
              </div>
              {b.amount && <div style={{ fontWeight: 700, color: "#1E1B2E" }}>₹{b.amount}</div>}
              <span style={{ background: `${STATUS_COLORS[b.status]}15`, color: STATUS_COLORS[b.status], fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600 }}>{b.status}</span>
              {(b.status === "pending" || b.status === "confirmed") && (
                <button onClick={() => cancelBooking(b.id)} style={{ padding: "6px 14px", background: "white", border: "1px solid #fee2e2", color: "#dc2626", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Health Records */}
      {tab === "records" && (
        <div>
          {records.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>No health records yet</div>
              <div style={{ fontSize: 14 }}>Your lab reports, prescriptions, and scans will appear here</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {records.map(r => (
                <div key={r.id} style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 14, padding: 20 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 28 }}>{RECORD_ICONS[r.record_type] || "📄"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1E1B2E", marginBottom: 4 }}>{r.title}</div>
                      {r.test_name && <div style={{ fontSize: 12, color: "#6C3FC5" }}>{r.test_name}</div>}
                      {r.lab_name && <div style={{ fontSize: 12, color: "#6B7280" }}>🧪 {r.lab_name}</div>}
                      {r.record_date && <div style={{ fontSize: 12, color: "#9CA3AF" }}>📅 {r.record_date}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <div style={{ maxWidth: 500 }}>
          <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 24 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1E1B2E" }}>{user.name}</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>{user.email}</div>
              </div>
            </div>
            {[
              ["📞 Phone", user.phone || "Not set"],
              ["📍 Area", user.area || "Not set"],
              ["🩸 Blood Group", user.blood_group || "Not set"],
              ["⭐ Membership", user.pro_member ? "CureYou Pro" : "Free"],
            ].map(([label, value]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F3F0FF", fontSize: 14 }}>
                <span style={{ color: "#6B7280" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "#1E1B2E" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
