"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Recommendation } from "@/hooks/useRecommendations";

interface RecommendedRowProps {
  title: string;
  items: Recommendation[];
}

export default function RecommendedRow({ title, items }: RecommendedRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const row = rowRef.current;
    if (!row) return;
    const scrollAmount = row.clientWidth * 0.9; // 90% viewport
    row.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (items.length === 0) {
    return null; // Don't render the section if there are no items
  }

  return (
    <section className="mb-12 bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-accent">{title}</h2>

        {/* scroll buttons – hidden on small screens */}
        <div className="hidden sm:flex gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-card hover:bg-card-hover"
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
            className="p-2 rounded-full bg-card hover:bg-card-hover"
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
        {items.map((item) => (
          <Link
            key={`${item.mediaType}-${item.id}`}
            href={`/${item.mediaType}/${item.id}`}
            className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-card">
              {item.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-accent">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
