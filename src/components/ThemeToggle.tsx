"use client";

import { useState, useEffect } from "react";

interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function ThemeToggle({ className, style }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(initialTheme);
    if (initialTheme) {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  const knobPosition = isDarkMode ? "translate-x-6" : "translate-x-0";

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-10 w-16 items-center justify-between rounded-full border border-white/20 bg-white/10 px-1 transition-[background,box-shadow] duration-300 hover:border-white/40 hover:shadow-[0_12px_24px_rgba(4,0,24,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 ${
        className || ""
      }`}
      style={style}
      aria-label="Toggle theme"
      aria-pressed={isDarkMode}
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-white/5 dark:bg-white/10" />
      <span
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-amber-500 shadow-lg transition-transform duration-300 ease-out ${
          mounted && isDarkMode
            ? `${knobPosition} bg-slate-900 text-indigo-200`
            : knobPosition
        }`}
      >
        {mounted && isDarkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21.752 15.002A9.718 9.718 0 0112.998 3.75a.75.75 0 00-1.309-.562 8.218 8.218 0 01-1.905 12.876 8.216 8.216 0 009.215 0 .75.75 0 00.753-.15z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
            <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 19.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 11.25a.75.75 0 01.75.75v.002a.75.75 0 01-1.5 0v-.002a.75.75 0 01.75-.75zM20.25 12a.75.75 0 01.75-.75h.002a.75.75 0 010 1.5h-.002a.75.75 0 01-.75-.75zM5.712 5.712a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.062l-1.06-1.061a.75.75 0 010-1.061zM16.166 16.166a.75.75 0 011.061 0l1.061 1.06a.75.75 0 11-1.061 1.062l-1.06-1.062a.75.75 0 010-1.06zM16.166 7.834a.75.75 0 010-1.061l1.06-1.061a.75.75 0 111.062 1.061l-1.062 1.06a.75.75 0 01-1.06 0zM7.834 16.166a.75.75 0 010 1.061l-1.061 1.061a.75.75 0 11-1.062-1.061l1.062-1.061a.75.75 0 011.06 0z" />
          </svg>
        )}
      </span>
    </button>
  );
}
