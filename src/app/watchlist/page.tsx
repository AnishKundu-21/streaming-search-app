"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useWatched } from "@/hooks/useWatched";
import Image from "next/image";
import Link from "next/link";

// Define the type for a single item from the hooks
type ListItem = {
  id: string;
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  seasonNumber?: number | null;
  addedAt?: string;
  watchedAt?: string;
};

// Define the type for an item after grouping seasons
type GroupedListItem = {
  id: string; // Unique key for the group
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  date: string; // watchedAt or addedAt
  seasonInfo: string | null; // e.g., "Seasons 1-3, 5"
};

// Helper function to create season range strings (e.g., "1-3, 5")
const createSeasonRanges = (seasonNumbers: number[]): string => {
  if (!seasonNumbers.length) return "";
  const sorted = [...seasonNumbers].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    if (i === sorted.length || sorted[i] !== sorted[i - 1] + 1) {
      const end = sorted[i - 1];
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      if (i < sorted.length) {
        start = sorted[i];
      }
    }
  }
  return `Season${ranges.length > 1 ? "s" : ""} ${ranges.join(", ")}`;
};

// Main helper to process and group the raw list from the hooks
const groupItems = (items: ListItem[]): GroupedListItem[] => {
  const grouped = new Map<number, ListItem[]>();

  // Group all items by their main contentId
  for (const item of items) {
    if (!grouped.has(item.contentId)) {
      grouped.set(item.contentId, []);
    }
    grouped.get(item.contentId)!.push(item);
  }

  const result: GroupedListItem[] = [];

  // Process each group
  for (const group of grouped.values()) {
    const firstItem = group[0];
    if (
      firstItem.mediaType === "movie" ||
      !group.some((item) => item.seasonNumber)
    ) {
      // Handle movies or whole TV shows added without season tracking
      result.push({
        ...firstItem,
        id: firstItem.id,
        seasonInfo: null,
        date: firstItem.watchedAt ?? firstItem.addedAt ?? "",
      });
    } else {
      // It's a TV show with seasons, process them
      const seasonNumbers = group
        .map((i) => i.seasonNumber)
        .filter((n): n is number => n !== null && n !== undefined);

      const latestDateItem = group.reduce((latest, current) => {
        const latestDate = new Date(latest.watchedAt ?? latest.addedAt ?? 0);
        const currentDate = new Date(current.watchedAt ?? current.addedAt ?? 0);
        return currentDate > latestDate ? current : latest;
      });

      const mainShowPoster =
        group.find((s) => s.seasonNumber === 1)?.posterPath ??
        firstItem.posterPath;

      result.push({
        ...firstItem,
        id: `${firstItem.contentId}-group`,
        title: firstItem.title.split(" - Season")[0], // Get the base show title
        posterPath: mainShowPoster,
        seasonInfo: createSeasonRanges(seasonNumbers),
        date: latestDateItem.watchedAt ?? latestDateItem.addedAt ?? "",
      });
    }
  }

  // Sort the final list by date
  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export default function WatchlistPage() {
  const { data: session } = useSession();
  const {
    watchlist,
    isLoading: watchlistLoading,
    isError: watchlistError,
  } = useWatchlist();
  const {
    watched,
    isLoading: watchedLoading,
    isError: watchedError,
  } = useWatched();
  const [activeTab, setActiveTab] = useState<"watchlist" | "watched">(
    "watchlist"
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Sign in to view your watchlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Keep track of movies and TV shows you want to watch and have already
            watched.
          </p>
          <Link
            href="/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const isLoading = watchlistLoading || watchedLoading;
  const hasError = watchlistError || watchedError;

  if (isLoading) {
    // ... loading state remains the same
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">My Lists</h1>

          <div className="flex space-x-1 mb-8">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg mb-2" />
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-1" />
                <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    // ... error state remains the same
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Unable to load your lists</h1>
          <p className="text-gray-600 dark:text-gray-400">
            There was an error loading your watchlist and watched items. Please
            try again.
          </p>
        </div>
      </div>
    );
  }

  const groupedWatchlist = groupItems(watchlist);
  const groupedWatched = groupItems(watched);

  const currentItems =
    activeTab === "watchlist" ? groupedWatchlist : groupedWatched;
  const isEmpty = currentItems.length === 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Lists</h1>

        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "watchlist"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            To Watch ({groupedWatchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("watched")}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === "watched"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Already Watched ({groupedWatched.length})
          </button>
        </div>

        {isEmpty ? (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">
              {activeTab === "watchlist"
                ? "Your watchlist is empty"
                : "No watched items yet"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {activeTab === "watchlist"
                ? "Start adding movies and TV shows to keep track of what you want to watch."
                : 'Mark some movies and TV shows as "Already Watched" to see them here.'}
            </p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentItems.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/${item.mediaType}/${item.contentId}`}>
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-gray-800">
                    {item.posterPath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.mediaType === "movie" ? "Movie" : "TV"}
                    </div>
                  </div>
                </Link>

                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <Link href={`/${item.mediaType}/${item.contentId}`}>
                    {item.title}
                  </Link>
                </h3>

                {item.seasonInfo && (
                  <p className="text-xs font-bold text-blue-500 dark:text-blue-400">
                    {item.seasonInfo}
                  </p>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeTab === "watchlist"
                    ? `Added ${new Date(item.date).toLocaleDateString()}`
                    : `Watched ${new Date(item.date).toLocaleDateString()}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
