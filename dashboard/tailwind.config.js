/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#060a12",
        panel: "#0c1220",
        card: "#111827",
        elevated: "#1a2332",
        cyan: "#00e5ff",
        amber: "#ffab00",
        danger: "#ff1744",
        success: "#00e676",
        purple: "#d500f9",
        primary: "#e8eaf6",
        secondary: "#7986cb",
        muted: "#37474f",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
        outfit: ["Outfit", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out both",
        "slide-in-right": "slideInRight 0.3s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
