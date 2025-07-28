"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import WatchedButton from "./WatchedButton";
import WatchlistButton from "./WatchlistButton";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validSeasons = seasons.filter((s) => s.season_number > 0);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Track Seasons</h2>
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center"
        >
          <span className="font-semibold">
            Select a Season to Track or Update
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10">
            <div className="space-y-2 p-2 max-h-96 overflow-y-auto">
              {validSeasons.map((season) => (
                <div
                  key={season.id}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex-shrink-0 w-12">
                    {season.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                        alt={season.name}
                        width={100}
                        height={150}
                        className="rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-[72px] bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center text-xs">
                        Art
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-md font-bold">{season.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {season.episode_count} episodes
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <WatchlistButton
                      contentId={tvId}
                      mediaType="tv"
                      title={`${tvTitle} - ${season.name}`}
                      posterPath={season.poster_path}
                      seasonNumber={season.season_number}
                    />
                    <WatchedButton
                      contentId={tvId}
                      mediaType="tv"
                      title={`${tvTitle} - ${season.name}`}
                      posterPath={season.poster_path}
                      seasonNumber={season.season_number}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
