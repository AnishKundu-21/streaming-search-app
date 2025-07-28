"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

interface MobileMenuProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function MobileMenu({ className, style }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sm:hidden" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-md ${className || ""}`}
        style={style}
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            <Link
              href="/recommendations"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Discover
            </Link>
            {session && (
              <Link
                href="/watchlist"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                My Watchlist
              </Link>
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            {session ? (
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
