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
        primary: {
          DEFAULT: "#D4006A",
          hover: "#b8005d",
          light: "rgba(212, 0, 106, 0.12)",
          glow: "rgba(212, 0, 106, 0.25)",
        },
        surface: {
          DEFAULT: "#0A0A0A",
          alt: "#111111",
          card: "#1a1a1a",
          elevated: "#222222",
        },
        text: {
          DEFAULT: "#F5F0EB",
          muted: "#a09a95",
          dim: "#6b6560",
        },
        border: {
          DEFAULT: "#2a2a2a",
          light: "#333333",
        },
        success: {
          DEFAULT: "#22c55e",
          bg: "rgba(34, 197, 94, 0.12)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.12)",
        },
        error: {
          DEFAULT: "#ef4444",
          bg: "rgba(239, 68, 68, 0.12)",
        },
        info: {
          DEFAULT: "#3b82f6",
          bg: "rgba(59, 130, 246, 0.12)",
        },
      },
      fontFamily: {
        heading: ["Bebas Neue", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "skeleton": "skeletonLoading 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        skeletonLoading: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
