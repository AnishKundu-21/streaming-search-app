"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import BackButton from "./BackButton";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/components/AuthProvider";

const baseLinks = [
  { href: "/recommendations", label: "DISCOVER" },
  { href: "/search", label: "EXPLORE" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { session, status, signOut } = useAuth();

  const isHomePage = pathname === "/";

  const navLinks = session
    ? [...baseLinks, { href: "/watchlist", label: "WATCHLIST" }]
    : baseLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      <div className="relative mx-auto flex h-24 max-w-screen-2xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <div className="flex items-center gap-6">
          {!isHomePage && <BackButton />}
          <Link href="/" className="group relative">
            <span className="font-display text-xl font-bold tracking-tighter text-white transition-transform duration-300 group-hover:scale-105 sm:text-3xl">
              STREAM<span className="text-accent">FINDER</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${isActive
                  ? "text-accent"
                  : "text-white/70 hover:text-white"
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-accent shadow-[0_0_10px_var(--accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
            {status === "loading" ? (
              <div className="h-10 w-24 animate-pulse rounded bg-white/10" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 transition-colors hover:border-accent">
                  {session.user?.user_metadata?.avatar_url ? (
                    <Image
                      src={session.user.user_metadata.avatar_url}
                      alt={
                        (session.user.user_metadata.full_name as
                          | string
                          | undefined) ||
                        session.user.email ||
                        "User avatar"
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-card text-sm font-bold text-accent">
                      {(
                        (session.user?.user_metadata?.full_name as
                          | string
                          | undefined) ||
                        session.user?.email ||
                        "SF"
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs font-bold uppercase tracking-widest text-white/60 transition hover:text-accent"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="group relative px-6 py-2 font-bold uppercase tracking-widest text-black transition-all hover:scale-105"
              >
                <div className="absolute inset-0 -skew-x-12 bg-white transition-all group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(255,0,85,0.5)]" />
                <span className="relative z-10 group-hover:text-white">Sign In</span>
              </Link>
            )}
          </div>
          <div className="sm:hidden">
            <MobileMenu links={[{ href: "/", label: "HOME" }, ...navLinks]} />
          </div>
        </div>
      </div >
    </header >
  );
}
