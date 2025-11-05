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
      <section className="rounded-3xl border border-white/10 bg-card p-12 text-center shadow-soft">
        <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-white">
          Sign in to view your lists
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Keep track of what&apos;s next and record what you&apos;ve already
          enjoyed.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(181,98,255,0.45)] transition hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(181,98,255,0.55)]"
          >
            Sign In
          </Link>
        </div>
      </section>
    );
  }

  const isLoading = watchlistLoading || watchedLoading;
  const hasError = watchlistError || watchedError;

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-card p-10 shadow-soft">
        <div className="h-10 w-48 animate-pulse rounded-full border border-white/20 bg-white/5" />
        <div className="mt-8 flex gap-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-36 animate-pulse rounded-full border border-white/20 bg-white/5"
            />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-2xl border border-white/20 bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="rounded-3xl border border-white/10 bg-card p-12 text-center shadow-soft">
        <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-white">
          Unable to load your lists
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Something went wrong fetching your watchlist. Please refresh the page
          and try again.
        </p>
      </section>
    );
  }

  const groupedWatchlist = groupItems(watchlist);
  const groupedWatched = groupItems(watched);

  const currentItems =
    activeTab === "watchlist" ? groupedWatchlist : groupedWatched;
  const isEmpty = currentItems.length === 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-card p-8 shadow-soft sm:p-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-white sm:text-4xl">
            My lists
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seamlessly manage what to watch next and remember what you have
            already completed.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {(
          [
            {
              key: "watchlist" as const,
              label: `To Watch (${groupedWatchlist.length})`,
            },
            {
              key: "watched" as const,
              label: `Already Watched (${groupedWatched.length})`,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              activeTab === tab.key
                ? "border-transparent bg-accent text-white shadow-[0_18px_36px_rgba(181,98,255,0.45)]"
                : "border-white/20 bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isEmpty ? (
        <div className="mt-10 rounded-2xl border border-white/20 bg-white/5 p-12 text-center backdrop-blur">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white">
            {activeTab === "watchlist"
              ? "Your watchlist is empty"
              : "No watched items yet"}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {activeTab === "watchlist"
              ? "Start adding movies and series to keep track of what you want to explore."
              : 'Mark a movie or series as "Already Watched" to see it here.'}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_18px_36px_rgba(181,98,255,0.45)] transition hover:scale-[1.02] hover:shadow-[0_24px_50px_rgba(181,98,255,0.55)]"
            >
              Browse content
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {currentItems.map((item, index) => (
            <div
              key={item.id}
              className="group/item flex flex-col animate-fade-up"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <Link href={`/${item.mediaType}/${item.contentId}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-soft transition-transform duration-500 group-hover/item:-translate-y-1 group-hover/item:shadow-lg">
                  {item.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      No Artwork
                    </div>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
                    {item.mediaType === "movie" ? "Film" : "Series"}
                  </span>
                </div>
              </Link>

              <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover/item:text-accent-soft">
                <Link href={`/${item.mediaType}/${item.contentId}`}>
                  {item.title}
                </Link>
              </h3>

              {item.seasonInfo && (
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {item.seasonInfo}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {activeTab === "watchlist"
                  ? `Added ${new Date(item.date).toLocaleDateString()}`
                  : `Watched ${new Date(item.date).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
