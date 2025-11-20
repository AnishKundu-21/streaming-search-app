/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enables dark mode via 'dark' class (e.g., for theme toggle)
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card-bg)",
        "card-hover": "var(--card-hover)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-strong": "var(--accent-strong)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Oswald", "Impact", "system-ui", "sans-serif"], // Bold, condensed for headers
        mono: ["var(--font-mono)", "Courier New", "monospace"],
      },
      letterSpacing: {
        "widest-xl": "0.25em", // For that cinematic trailer text
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slow-pan": "slowPan 60s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slowPan: {
          "0%": { transform: "scale(1.1) translate(0, 0)" },
          "50%": { transform: "scale(1.1) translate(-2%, -2%)" },
          "100%": { transform: "scale(1.1) translate(0, 0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.2)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 60%, #000000 100%)",
      },
    },
  },
  plugins: [],
};
