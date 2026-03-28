import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { LocationProvider } from "../components/LocationContext";

export const metadata: Metadata = {
  title: "CureYou — Your Health. Handled.",
  description: "India's AI-powered healthcare companion. Find doctors, compare lab prices, discover hospitals — all in Faridabad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <LocationProvider>
              <Navbar />
              <main style={{ minHeight: "100vh", paddingTop: "64px" }}>
                {children}
              </main>
            </LocationProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
