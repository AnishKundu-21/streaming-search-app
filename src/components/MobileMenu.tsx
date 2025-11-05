"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

interface MobileMenuProps {
  links: { href: string; label: string }[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { session, signOut } = useAuth();
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
        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-surface-muted p-2 text-foreground shadow-soft transition hover:bg-accent hover:text-white"
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
        <div className="absolute right-0 top-14 w-64 rounded-2xl border border-white/10 bg-card p-4 shadow-soft">
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-foreground/80 transition hover:border-accent/40 hover:bg-surface-muted hover:text-foreground"
              >
                {link.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M7.293 4.293a1 1 0 011.414 0L14 9.586 8.707 14.88a1 1 0 11-1.414-1.414L11.172 10l-3.879-3.879a1 1 0 010-1.414z" />
                </svg>
              </Link>
            ))}
          </div>
          <div className="my-3 h-px bg-white/10" />
          {session ? (
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-lg"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/signin"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
