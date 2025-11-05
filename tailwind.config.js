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
      // Add custom theme extensions here if needed (e.g., colors, fonts)
      colors: {
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-strong": "var(--accent-strong)",
        card: "var(--card-bg)",
        "card-hover": "var(--card-hover)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "var(--background)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        surface: "var(--surface-elevated)",
        "surface-muted": "var(--surface-muted)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        float: "float 10s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, -6px, 0)" },
          "50%": { transform: "translate3d(0, 6px, 0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Space Grotesk", "system-ui", "sans-serif"],
        display: ["var(--font-serif)", "Oxanium", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Source Code Pro", "monospace"],
      },
    },
  },
  plugins: [],
};
