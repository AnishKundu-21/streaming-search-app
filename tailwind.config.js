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
        "accent-hover": "#5a4ccf",
        card: "var(--card-bg)",
        "card-hover": "var(--card-hover)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "var(--background)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
