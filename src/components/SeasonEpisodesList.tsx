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
    <div className="space-y-4">
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
            className="group border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-accent hover:bg-black/60 hover:shadow-[0_0_30px_rgba(255,0,128,0.15)]"
          >
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="relative h-48 w-full flex-shrink-0 overflow-hidden border border-white/10 bg-black md:h-36 md:w-64">
                {episode.still_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={episode.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-[0.3em] text-white/20">
                    No Still
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="absolute bottom-2 left-3">
                  <span className="text-xs font-black uppercase text-white">
                    Ep {episode.episode_number}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase italic tracking-wide text-white group-hover:text-accent transition-colors">
                      {episode.name || "Untitled Episode"}
                    </h3>
                  </div>
                  <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-white/50">
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
                    className={`text-sm leading-relaxed text-white/70 transition-all ${!isExpanded ? "line-clamp-2" : ""
                      }`}
                  >
                    {displayText}
                  </p>
                  {shouldShowToggle && (
                    <button
                      onClick={() => toggleEpisode(episode.id)}
                      className="mt-2 text-xs font-bold uppercase tracking-widest text-accent transition hover:text-white"
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
