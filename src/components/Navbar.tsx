"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isDetailPage =
    pathname.startsWith("/movie/") || pathname.startsWith("/tv/");
  const isHomePage = pathname === "/";
  const isSearchPage = pathname.startsWith("/search");

  const navClass = isDetailPage
    ? "fixed top-0 left-0 right-0 z-30 bg-main border-b border-border"
    : "bg-main/95 backdrop-blur-lg border-b border-border sticky top-0 z-30";

  const textColor = isDetailPage
    ? "text-foreground drop-shadow-sm"
    : "text-foreground";

  const logoTextColor = isDetailPage
    ? "text-accent drop-shadow-sm"
    : "text-accent";

  const iconButtonClass = isDetailPage
    ? "hover:bg-card/60 transition-colors duration-200"
    : "hover:bg-card/40 backdrop-blur-sm transition-colors duration-200";

  return (
    <header
      className={`p-2 sm:p-4 flex justify-between items-center transition-all duration-300 ${navClass}`}
    >
      {/* Left section */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {!isHomePage && (
          <BackButton className={`${textColor} ${iconButtonClass}`} />
        )}
        <Link
          href="/"
          className={`text-xl sm:text-2xl font-bold ${logoTextColor}`}
        >
          StreamFinder
        </Link>
      </div>

      {/* Right section (Desktop) */}
      <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
        <Link
          href="/recommendations"
          className={`text-sm font-semibold ${textColor} hover:text-accent transition-colors duration-200`}
        >
          Discover
        </Link>

        {session && (
          <Link
            href="/watchlist"
            className={`text-sm font-semibold ${textColor} hover:text-accent transition-colors duration-200`}
          >
            My Watchlist
          </Link>
        )}

        <ThemeToggle className={`${textColor} ${iconButtonClass}`} />

        {status === "loading" ? (
          <div className={`h-8 w-20 rounded-md animate-pulse ${isDetailPage ? 'bg-card/80' : 'bg-card/60'}`} />
        ) : session ? (
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ${isDetailPage ? 'bg-card/80' : 'bg-card/60'}`}>
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={32}
                  height={32}
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-muted-foreground"
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
            >
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 text-foreground border ${isDetailPage 
                ? 'bg-card/60 hover:bg-card/80 border-border' 
                : 'bg-card/30 hover:bg-card/50 border-border/40 backdrop-blur-sm'
              }`}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 bg-accent/90 hover:bg-accent text-white ${isDetailPage ? '' : 'backdrop-blur-sm'}`}
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden flex items-center space-x-2">
        <ThemeToggle className={`${textColor} ${iconButtonClass}`} />
        <MobileMenu className={`${textColor} ${iconButtonClass}`} />
      </div>
    </header>
  );
}
