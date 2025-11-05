"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  runtime?: number | null;
  air_date?: string;
}

interface SeasonEpisodesListProps {
  episodes: Episode[];
}

const formatRuntime = (runtime?: number | null) => {
  if (!runtime || runtime <= 0) {
    return null;
  }
  if (runtime < 60) {
    return `${runtime} min`;
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
};

export default function SeasonEpisodesList({
  episodes,
}: SeasonEpisodesListProps) {
  const [expandedEpisodes, setExpandedEpisodes] = useState<
    Record<number, boolean>
  >({});
  const [overflowingEpisodes, setOverflowingEpisodes] = useState<
    Record<number, boolean>
  >({});
  const textRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  useEffect(() => {
    const checkOverflow = () => {
      const results: Record<number, boolean> = {};

      episodes.forEach((episode) => {
        const element = textRefs.current[episode.id];
        if (!element) return;

        const isOverflowing = element.scrollHeight - element.clientHeight > 1;
        results[episode.id] = isOverflowing;
      });

      setOverflowingEpisodes(results);
    };

    const raf = requestAnimationFrame(checkOverflow);
    window.addEventListener("resize", checkOverflow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [episodes]);

  const toggleEpisode = (episodeId: number) => {
    setExpandedEpisodes((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
  };

  if (!episodes || episodes.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-soft">
        Episode information is not available for this season yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {episodes.map((episode) => {
        const isExpanded = expandedEpisodes[episode.id] ?? false;
        const airDate = episode.air_date
          ? new Date(episode.air_date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : null;
        const runtime = formatRuntime(episode.runtime);
        const overview = episode.overview?.trim() ?? "";
        const displayText =
          overview.length > 0 ? overview : "Synopsis not provided.";
        const shouldShowToggle = overflowingEpisodes[episode.id] ?? false;

        return (
          <article
            key={episode.id}
            className="rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 hover:border-accent/40 hover:shadow-lg"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-border bg-surface-elevated md:h-32 md:w-56">
                {episode.still_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    No Still
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent">
                      Episode{" "}
                      {episode.episode_number.toString().padStart(2, "0")}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {episode.name || "Untitled Episode"}
                    </h3>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {airDate && <span>{airDate}</span>}
                    {runtime && (
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4a.75.75 0 00-1.5 0v4c0 .199.079.39.22.53l2.5 2.5a.75.75 0 101.06-1.06L10.75 9.69V6z" />
                        </svg>
                        {runtime}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p
                    ref={(el) => {
                      textRefs.current[episode.id] = el;
                    }}
                    className={`text-sm text-muted-foreground transition-all ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {displayText}
                  </p>
                  {shouldShowToggle && (
                    <button
                      onClick={() => toggleEpisode(episode.id)}
                      className="mt-2 text-sm font-semibold text-accent transition hover:text-accent-soft"
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
