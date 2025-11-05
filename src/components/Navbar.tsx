"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import BackButton from "./BackButton";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/components/AuthProvider";

const baseLinks = [
  { href: "/recommendations", label: "Discover" },
  { href: "/search", label: "Explore" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { session, status, signOut } = useAuth();

  const isDetailPage =
    pathname.startsWith("/movie/") || pathname.startsWith("/tv/");
  const isHomePage = pathname === "/";

  const navLinks = session
    ? [...baseLinks, { href: "/watchlist", label: "My Watchlist" }]
    : baseLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-black">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {!isHomePage && <BackButton />}
          <Link href="/" className="text-xl font-bold text-white sm:text-2xl">
            StreamFinder
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded bg-card" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border">
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
                  <div className="flex h-full w-full items-center justify-center bg-card text-sm font-semibold text-accent">
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
                className="px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-white"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-soft"
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
