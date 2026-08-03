import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        "accent-hover": "var(--accent-hover)",
        "accent-soft": "var(--accent-soft)",
        seller: "var(--seller)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        hero: "0 32px 64px -12px rgba(0, 0, 0, 0.35)",
        nav: "0 1px 0 var(--border)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      backgroundImage: {
        "accent-gradient": "var(--accent-gradient)",
      },
    },
  },
  plugins: [],
};

export default config;
