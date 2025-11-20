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

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="group relative overflow-hidden py-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between px-2">
        <div>
          <h2 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl md:text-6xl">
            {title}
          </h2>
          <div className="mt-2 h-1 w-24 bg-accent" />
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <button
            aria-label="Scroll left"
            onClick={() => scroll("left")}
            className="group/btn flex h-12 w-12 items-center justify-center border border-white/20 bg-black transition-colors hover:border-accent hover:bg-accent"
          >
            <svg className="h-5 w-5 text-white transition-transform group-hover/btn:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll("right")}
            className="group/btn flex h-12 w-12 items-center justify-center border border-white/20 bg-black transition-colors hover:border-accent hover:bg-accent"
          >
            <svg className="h-5 w-5 text-white transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="mt-10 flex gap-6 overflow-x-auto scroll-smooth pb-8 pl-2 pr-4 scrollbar-hide snap-x snap-mandatory"
      >
        {items.map((item, index) => {
          const mediaType = item.media_type ?? defaultMediaType ?? "movie";
          const titleText = item.title || item.name || "Untitled";
          const year =
            item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4);

          return (
            <Link
              key={`${mediaType}-${item.id}`}
              href={`/${mediaType}/${item.id}`}
              className="group/item relative flex w-[140px] sm:w-[200px] md:w-[240px] flex-shrink-0 flex-col snap-start"
            >
              <div className="relative aspect-[2/3] overflow-hidden border-2 border-transparent transition-all duration-300 group-hover/item:border-accent group-hover/item:shadow-[0_0_20px_rgba(255,0,85,0.4)]">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={titleText}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                    No Artwork
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />



                <span className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  {mediaType === "movie" ? "Film" : "Series"}
                </span>
              </div>

              <div className="mt-4">
                <h3 className="truncate font-display text-xl font-bold uppercase text-white transition-colors group-hover/item:text-accent">
                  {titleText}
                </h3>
                {year && (
                  <p className="text-xs font-bold tracking-widest text-white/50">
                    {year}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
