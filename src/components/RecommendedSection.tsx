"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRecommendations } from "@/hooks/useRecommendations";
import Image from "next/image";
import Link from "next/link";

export default function RecommendedSection() {
  const { data: session } = useSession();
  const { recommendations, isLoading, isError } = useRecommendations();
  const rowRef = useRef<HTMLDivElement>(null);

  // Don't show recommendations if user is not signed in
  if (!session) {
    return null;
  }

  const scroll = (dir: "left" | "right") => {
    const row = rowRef.current;
    if (!row) return;
    const scrollAmount = row.clientWidth * 0.9; // 90% viewport
    row.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] animate-pulse"
            >
              <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg mb-2" />
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-1" />
              <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load recommendations. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // No recommendations available
  if (recommendations.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No recommendations yet!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mark some movies or TV shows as &quot;Already Watched&quot; to get
            personalized recommendations.
          </p>
        </div>
      </section>
    );
  }

  // Show recommendations in horizontal scrollable format
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Recommended for You ({recommendations.length} items)
        </h2>

        {/* scroll buttons – hidden on small screens */}
        <div className="hidden sm:flex gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 15.707a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-200"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 4.293a1 1 0 010 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* scroll container */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {recommendations.map((item) => (
          <Link
            key={`${item.mediaType}-${item.id}`}
            href={`/${item.mediaType}/${item.id}`}
            className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-gray-800">
              {item.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-gray-500 dark:text-gray-400">
                  No Image
                </div>
              )}

              {/* Media type indicator */}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {item.mediaType === "movie" ? "Movie" : "TV"}
              </div>
            </div>

            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {item.title}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
