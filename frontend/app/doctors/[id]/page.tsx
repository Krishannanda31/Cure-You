"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/Toast";

const API = "/api";
interface Doctor { id: number; name: string; speciality: string; area: string; fee: number; rating: number; reviews: number; experience: number; hospital: string; verified: number; image_initials: string; education: string; languages: string; available_today: number; }
interface Slot { time: string; available: boolean; }

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

  // Get next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { value: d.toISOString().split("T")[0], label: d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }) };
  });

  useEffect(() => {
    fetch(`${API}/doctors/${id}`).then(r => r.json()).then(setDoctor);
  }, [id]);

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`${API}/bookings/slots/${id}?date=${selectedDate}`).then(r => r.json()).then(setSlots);
  }, [selectedDate, id]);

  const handleBook = async () => {
    if (!token) { router.push("/login"); return; }
    if (!selectedDate || !selectedTime) { showToast("Please select a date and time", "error"); return; }
    setBooking(true);
    try {
      const r = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ booking_type: "doctor", reference_id: doctor!.id, reference_name: doctor!.name, booking_date: selectedDate, booking_time: selectedTime, notes, amount: doctor!.fee })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      showToast(`Appointment booked with ${doctor!.name} on ${selectedDate} at ${selectedTime} ✓`);
      router.push("/dashboard");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Booking failed", "error");
    } finally { setBooking(false); }
  };

  if (!doctor) return <div style={{ textAlign: "center", padding: 80, color: "#6B7280" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
      {/* Doctor Header */}
      <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 20, padding: 32, marginBottom: 24, display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg, #6C3FC5, #818CF8)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
          {doctor.image_initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E1B2E" }}>{doctor.name}</h1>
            {doctor.verified ? <span style={{ background: "rgba(110,231,183,0.15)", color: "#059669", fontSize: 12, padding: "3px 10px", borderRadius: 999, fontWeight: 600 }}>✓ Verified</span> : null}
          </div>
          <div style={{ fontSize: 16, color: "#6C3FC5", fontWeight: 600, marginBottom: 4 }}>{doctor.speciality}</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>{doctor.hospital} · {doctor.area}</div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>🎓 {doctor.education}</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>🗣️ {doctor.languages}</div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[["₹" + doctor.fee, "Consult Fee", "#6C3FC5"], [doctor.rating + "★", doctor.reviews + " reviews", "#818CF8"], [doctor.experience + " yrs", "Experience", "#059669"]].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: "center", padding: "16px 18px", background: "#F8F7FF", borderRadius: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking */}
      <div style={{ background: "white", border: "1px solid #E5E0FF", borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E1B2E", marginBottom: 24 }}>Book an Appointment</h2>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1B2E", marginBottom: 12 }}>Select Date</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {dates.map(d => (
              <button key={d.value} onClick={() => { setSelectedDate(d.value); setSelectedTime(""); }} style={{
                padding: "10px 16px", borderRadius: 10, border: "1.5px solid",
                borderColor: selectedDate === d.value ? "#6C3FC5" : "#E5E0FF",
                background: selectedDate === d.value ? "rgba(108,63,197,0.08)" : "white",
                color: selectedDate === d.value ? "#6C3FC5" : "#6B7280",
                fontSize: 13, fontWeight: 500, cursor: "pointer"
              }}>{d.label}</button>
            ))}
          </div>
        </div>

        {selectedDate && slots.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1B2E", marginBottom: 12 }}>Select Time</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {slots.map(s => (
                <button key={s.time} disabled={!s.available} onClick={() => setSelectedTime(s.time)} style={{
                  padding: "8px 16px", borderRadius: 8, border: "1.5px solid",
                  borderColor: !s.available ? "#F3F0FF" : selectedTime === s.time ? "#6C3FC5" : "#E5E0FF",
                  background: !s.available ? "#F9F9F9" : selectedTime === s.time ? "rgba(108,63,197,0.08)" : "white",
                  color: !s.available ? "#9CA3AF" : selectedTime === s.time ? "#6C3FC5" : "#1E1B2E",
                  fontSize: 13, cursor: s.available ? "pointer" : "not-allowed",
                  textDecoration: !s.available ? "line-through" : "none"
                }}>{s.time}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: "#1E1B2E", display: "block", marginBottom: 8 }}>Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe your symptoms or reason for visit..."
            style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #E5E0FF", borderRadius: 10, fontSize: 14, outline: "none", resize: "vertical", minHeight: 80, background: "#F8F7FF" }} />
        </div>

        {selectedDate && selectedTime && (
          <div style={{ background: "rgba(108,63,197,0.06)", border: "1px solid rgba(108,63,197,0.2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: "#1E1B2E" }}>
              <strong>Appointment summary:</strong> {doctor.name} · {selectedDate} at {selectedTime} · <strong style={{ color: "#6C3FC5" }}>₹{doctor.fee}</strong>
            </div>
          </div>
        )}

        <button onClick={handleBook} disabled={booking || !selectedDate || !selectedTime} style={{
          width: "100%", padding: "14px", background: (!selectedDate || !selectedTime || booking) ? "#9CA3AF" : "linear-gradient(135deg, #6C3FC5, #818CF8)",
          color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: (!selectedDate || !selectedTime || booking) ? "not-allowed" : "pointer"
        }}>
          {!user ? "Login to Book" : booking ? "Confirming..." : selectedDate && selectedTime ? `Confirm Appointment — ₹${doctor.fee}` : "Select Date & Time to Book"}
        </button>
      </div>
    </div>
  );
}
