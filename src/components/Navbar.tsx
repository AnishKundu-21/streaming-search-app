"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BackButton from "./BackButton";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Make navbar transparent on detail pages with backdrops
  const isDetailPage =
    pathname.startsWith("/movie/") || pathname.startsWith("/tv/");
  const navClass = isDetailPage
    ? "bg-transparent absolute top-0 left-0 right-0 z-20"
    : "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10";

  const logoTextColor = isDetailPage
    ? "text-white"
    : "text-blue-600 dark:text-blue-400";
  const logoTextShadow = isDetailPage
    ? { textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }
    : {};

  return (
    <header className={`p-4 flex justify-between items-center ${navClass}`}>
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
      <ThemeToggle />
    </header>
  );
}
