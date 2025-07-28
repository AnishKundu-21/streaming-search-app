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

  const isDetailPage =
    pathname.startsWith("/movie/") || pathname.startsWith("/tv/");
  const isHomePage = pathname === "/";

  const navClass = isDetailPage
    ? "absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/60 to-transparent"
    : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30";

  const textColor = isDetailPage
    ? "text-white"
    : "text-gray-700 dark:text-gray-300";

  const logoTextColor = isDetailPage
    ? "text-white"
    : "text-blue-600 dark:text-blue-400";

  const textShadow = isDetailPage
    ? { textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }
    : {};

  const iconButtonClass = isDetailPage
    ? "hover:bg-white/10"
    : "hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <header className={`p-4 flex justify-between items-center ${navClass}`}>
      {/* Left section */}
      <div className="flex items-center space-x-2">
        {!isHomePage && (
          <BackButton
            className={`${textColor} ${iconButtonClass}`}
            style={textShadow}
          />
        )}
        <Link
          href="/"
          className={`text-2xl font-bold ${logoTextColor}`}
          style={textShadow}
        >
          StreamFinder
        </Link>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <Link
          href="/recommendations"
          className={`text-sm font-semibold ${textColor} hover:text-blue-600 dark:hover:text-blue-400`}
          style={textShadow}
        >
          Discover
        </Link>

        {session && (
          <Link
            href="/watchlist"
            className={`text-sm font-semibold ${textColor} hover:text-blue-600 dark:hover:text-blue-400`}
            style={textShadow}
          >
            My Watchlist
          </Link>
        )}

        <ThemeToggle
          className={`${textColor} ${iconButtonClass}`}
          style={textShadow}
        />

        {status === "loading" ? (
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ) : session ? (
          /* Logged-in state */
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={32}
                  height={32}
                />
              ) : (
                // Generic user icon SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm font-semibold hidden sm:block ${textColor}`}
              style={textShadow}
            >
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
                isDetailPage
                  ? "bg-black/20 hover:bg-black/40 text-white border border-white/30"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              }`}
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
