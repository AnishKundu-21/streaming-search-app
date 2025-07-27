"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isHomePage = pathname === "/";
  const isDetailPage =
    pathname.startsWith("/movie/") || pathname.startsWith("/tv/");

  const navClass = isDetailPage
    ? "absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/70 to-transparent"
    : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30";

  const logoTextColor = isDetailPage
    ? "text-white"
    : "text-blue-600 dark:text-blue-400";
  const logoTextShadow = isDetailPage
    ? { textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }
    : {};

  return (
    <header className={`p-4 flex justify-between items-center ${navClass}`}>
      {/* Left section */}
      <div className="flex items-center space-x-2">
        {!isHomePage && <BackButton />}
        <Link
          href="/"
          className={`text-2xl font-bold ${logoTextColor}`}
          style={logoTextShadow}
        >
          StreamFinder
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Link to the user’s watchlist (only show when signed in) */}
        {session && (
          <Link
            href="/watchlist"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            My Watchlist
          </Link>
        )}

        <ThemeToggle />

        {status === "loading" ? (
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ) : session ? (
          /* Logged-in state */
          <div className="flex items-center space-x-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut()}
              className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Logged-out state */
          <button
            onClick={() => router.push("/auth/signin")}
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
