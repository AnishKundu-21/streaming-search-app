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
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tailored suggestions based on what you already love.
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            aria-label="Scroll left"
            onClick={() => scroll("left")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-muted text-foreground transition hover:border-accent/40 hover:text-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.293 4.293a1 1 0 010 1.414L9.414 8.586H16a1 1 0 110 2H9.414l2.879 2.879a1 1 0 11-1.414 1.414l-4.5-4.5a1 1 0 010-1.414l4.5-4.5a1 1 0 011.414 0z" />
            </svg>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll("right")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-muted text-foreground transition hover:border-accent/40 hover:text-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 4.293a1 1 0 010 1.414L10.586 8.586H4a1 1 0 100 2h6.586l-2.879 2.879a1 1 0 001.414 1.414l4.5-4.5a1 1 0 000-1.414l-4.5-4.5a1 1 0 00-1.414 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="mt-6 flex gap-4 overflow-x-auto scroll-smooth pb-2 pl-1 pr-4 scrollbar-hide sm:gap-6 snap-x snap-mandatory"
      >
        {items.map((item, index) => (
          <Link
            key={`${item.mediaType}-${item.id}`}
            href={`/${item.mediaType}/${item.id}`}
            className="group/item relative flex w-[68vw] max-w-[220px] flex-shrink-0 flex-col animate-fade-up snap-start sm:w-[180px] md:w-[200px]"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft transition-transform duration-500 group-hover/item:-translate-y-1 group-hover/item:shadow-lg">
              {item.posterPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  No Artwork
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 transition duration-500 group-hover/item:opacity-100" />
              <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
                {item.mediaType === "movie" ? "Film" : "Series"}
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover/item:text-accent">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
