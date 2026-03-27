import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        violet: {
          primary: "#6C3FC5",
          dark: "#4e2d91",
          light: "#8B5CF6",
        },
        indigo: {
          accent: "#818CF8",
        },
        mint: "#6EE7B7",
        cureyou: {
          bg: "#F8F7FF",
          card: "#FFFFFF",
          text: "#1E1B2E",
          muted: "#6B7280",
          border: "#E5E0FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
