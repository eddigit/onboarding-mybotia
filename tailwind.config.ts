import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040714",
          900: "#070b1a",
          800: "#0b1026",
          700: "#0f1632",
          600: "#141c42",
          500: "#1a2352",
        },
        accent: {
          blue: "#4f7df3",
          indigo: "#635bff",
          purple: "#7c3aed",
          cyan: "#22d3ee",
        },
        txt: {
          primary: "#f0f2ff",
          secondary: "#9ba3c2",
          muted: "#5e6688",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        brand: ["'Major Mono Display'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(79, 125, 243, 0.12)",
        "glow-accent": "0 4px 40px rgba(99, 91, 255, 0.2)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
