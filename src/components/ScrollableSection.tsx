"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Item {
  id: number;
  media_type?: "movie" | "tv";
  poster_path: string | null;
  title?: string; // movies
  name?: string; // tv
  first_air_date?: string;
  release_date?: string;
}

/**
 * Horizontal carousel section with left / right scroll buttons.
 *
 * Props:
 * - title : section heading
 * - items : TMDB results array (max ~20 recommended)
 * - defaultMediaType: The media type to assume if not present on the item
 */
export default function ScrollableSection({
  title,
  items,
  defaultMediaType,
}: {
  title: string;
  items: Item[];
  defaultMediaType?: "movie" | "tv";
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const row = rowRef.current;
    if (!row) return;
    const scrollAmount = row.clientWidth * 0.9; // 90 % viewport
    row.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>

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
        {items.map((item) => {
          const mediaType = item.media_type ?? defaultMediaType ?? "movie";
          return (
            <Link
              key={`${mediaType}-${item.id}`}
              href={`/${mediaType}/${item.id}`}
              className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-gray-800">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title || item.name || "Poster"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-500 dark:text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.title || item.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
