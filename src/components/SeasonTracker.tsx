"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

interface SeasonTrackerProps {
  tvId: number;
  tvTitle: string;
  seasons: Season[];
}

export default function SeasonTracker({
  tvId,
  tvTitle,
  seasons,
}: SeasonTrackerProps) {
  const validSeasons = seasons.filter((s) => s.season_number > 0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (validSeasons.length === 0) {
    return null;
  }

  const scrollBy = (offset: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Track Seasons</h2>
          <p className="text-sm text-muted-foreground">
            Tap a season card to open a dedicated view with trailers, synopsis,
            and episode details.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {tvTitle}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-320)}
              aria-label="Scroll seasons left"
              className="rounded-full border border-border bg-surface-elevated/70 p-2 text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.78 4.22a.75.75 0 010 1.06L8.56 9.5l4.22 4.22a.75.75 0 11-1.06 1.06l-4.75-4.75a.75.75 0 010-1.06l4.75-4.75a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(320)}
              aria-label="Scroll seasons right"
              className="rounded-full border border-border bg-surface-elevated/70 p-2 text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.22 4.22a.75.75 0 000 1.06l4.22 4.22-4.22 4.22a.75.75 0 101.06 1.06l4.75-4.75a.75.75 0 000-1.06l-4.75-4.75a.75.75 0 00-1.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto pb-4 scrollbar-hide" ref={scrollRef}>
        <div className="flex gap-6">
          {validSeasons.map((season) => (
            <Link
              key={season.id}
              href={`/tv/${tvId}/season/${season.season_number}`}
              className="group/wrapper relative w-[170px] flex-shrink-0"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-soft transition duration-500 group-hover/wrapper:-translate-y-1 group-hover/wrapper:border-accent/60">
                {season.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
                    alt={season.name}
                    fill
                    className="object-cover transition duration-500 group-hover/wrapper:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-elevated text-xs uppercase tracking-widest text-muted-foreground">
                    No Art
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
                    Season {season.season_number}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white line-clamp-2">
                    {season.name}
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {season.episode_count} Episodes
                </p>
                <p className="text-sm font-semibold text-foreground">
                  View details
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
