"use client";

import Image from "next/image";
import Link from "next/link";

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

  if (validSeasons.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Track Seasons</h2>
          <p className="text-sm text-muted-foreground">
            Tap a season card to open a dedicated view with trailers, synopsis,
            and episode details.
          </p>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {tvTitle}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto pb-4 scrollbar-hide">
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
