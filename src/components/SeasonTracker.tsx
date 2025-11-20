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
    <section className="mt-12 animate-fade-up animation-delay-400">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase italic tracking-wider text-white sm:text-3xl">
            Track Seasons
          </h2>
          <p className="text-sm font-bold uppercase tracking-widest text-white/60">
            Tap a season card to open a dedicated view with trailers, synopsis,
            and episode details.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            {tvTitle}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-320)}
              aria-label="Scroll seasons left"
              className="group border border-white/20 bg-black/50 p-3 text-white transition-all hover:border-accent hover:bg-accent hover:text-black"
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
              className="group border border-white/20 bg-black/50 p-3 text-white transition-all hover:border-accent hover:bg-accent hover:text-black"
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

      <div className="mt-8 overflow-x-auto pb-8 scrollbar-hide" ref={scrollRef}>
        <div className="flex gap-6">
          {validSeasons.map((season) => (
            <Link
              key={season.id}
              href={`/tv/${tvId}/season/${season.season_number}`}
              className="group relative w-[200px] flex-shrink-0"
            >
              <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(255,0,128,0.3)] group-hover:-translate-y-2">
                {season.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${season.poster_path}`}
                    alt={season.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                    No Art
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                    Season {season.season_number}
                  </span>
                  <p className="mt-1 text-lg font-bold uppercase italic leading-none text-white">
                    {season.name}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1 px-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  {season.episode_count} Episodes
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-accent transition-colors">
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
