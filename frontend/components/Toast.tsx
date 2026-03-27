"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface Toast { id: number; message: string; type: "success" | "error" | "info"; }
interface ToastContextType { showToast: (message: string, type?: "success" | "error" | "info") => void; }

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const colors = { success: "#059669", error: "#dc2626", info: "#6C3FC5" };
  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "white", border: `1px solid ${colors[t.type]}30`,
            borderLeft: `4px solid ${colors[t.type]}`,
            padding: "12px 18px", borderRadius: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            animation: "slideIn 0.2s ease",
            minWidth: 280, maxWidth: 380,
          }}>
            <span style={{ color: colors[t.type], fontWeight: 700, fontSize: 16 }}>{icons[t.type]}</span>
            <span style={{ fontSize: 14, color: "#1E1B2E", lineHeight: 1.4 }}>{t.message}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
