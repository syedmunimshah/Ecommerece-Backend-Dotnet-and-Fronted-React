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
      // Colors that get opacity modifiers (bg-surface/90, ring-accent/30) must be
      // declared as rgb channels + <alpha-value>. Given a plain `var(--x)` holding a
      // hex, Tailwind emits invalid CSS for the modifier and the browser drops the
      // whole rule — which is how auth inputs ended up with no background at all.
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        border: "rgb(var(--border-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        seller: "rgb(var(--seller-rgb) / <alpha-value>)",
        "accent-foreground": "var(--accent-foreground)",
        "accent-hover": "var(--accent-hover)",
        "accent-soft": "var(--accent-soft)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
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
