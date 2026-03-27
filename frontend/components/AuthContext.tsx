"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = "http://localhost:5001/api";

interface User {
  id: number; name: string; email: string; phone?: string;
  area?: string; blood_group?: string; pro_member?: number;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
interface RegisterData {
  name: string; email: string; password: string;
  phone?: string; area?: string; blood_group?: string; gender?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("cureyou_token");
    if (t) {
      setToken(t);
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.ok ? r.json() : null)
        .then(u => { if (u) setUser(u); else { localStorage.removeItem("cureyou_token"); setToken(null); } })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch(`${API}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("cureyou_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: RegisterData) => {
    const r = await fetch(`${API}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Registration failed");
    localStorage.setItem("cureyou_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("cureyou_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
