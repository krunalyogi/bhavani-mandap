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
        gold: {
          50: "#fdf9ec",
          100: "#faf0cc",
          200: "#f5de96",
          300: "#f0c95a",
          400: "#edb72e",
          500: "#d4a017",  // primary gold
          600: "#b8860b",  // dark gold
          700: "#946a09",
          800: "#7a5608",
          900: "#624406",
        },
        maroon: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f3a8b7",
          400: "#eb738f",
          500: "#800000",  // primary maroon
          600: "#6b0000",
          700: "#5c0000",
          800: "#4a0000",
          900: "#3d0000",
        },
        cream: "#FDF8F0",
        ivory: "#FFFFF0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4a017 0%, #f0c95a 50%, #b8860b 100%)",
        "maroon-gradient": "linear-gradient(135deg, #800000 0%, #c0392b 100%)",
        "hero-pattern": "radial-gradient(ellipse at top, rgba(212,160,23,0.15) 0%, transparent 70%), radial-gradient(ellipse at bottom-right, rgba(128,0,0,0.1) 0%, transparent 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        "gold": "0 4px 20px rgba(212,160,23,0.3)",
        "gold-lg": "0 8px 40px rgba(212,160,23,0.4)",
        "maroon": "0 4px 20px rgba(128,0,0,0.3)",
        "premium": "0 20px 60px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
