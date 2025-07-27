// src/hooks/useWatchlist.ts
"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

type WatchlistItem = {
  id: string;
  userId: string;
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  addedAt: string;
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  });

/**
 * React hook that returns the current user’s watch-list plus helpers
 *
 * addItem({ contentId, mediaType, title, posterPath })
 * removeItem(contentId, mediaType)
 * isInWatchlist(contentId, mediaType) → boolean
 */
export function useWatchlist() {
  /* Only fetch when the user is authenticated */
  const { status } = useSession();
  const enabled = status === "authenticated";

  const { data, error, isLoading, mutate } = useSWR<WatchlistItem[]>(
    enabled ? "/api/watchlist" : null,
    fetcher
  );

  /* -------- helpers -------- */
  const addItem = async (item: {
    contentId: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath?: string | null;
  }) => {
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    mutate(); // re-validate list
  };

  const removeItem = async (contentId: number, mediaType: "movie" | "tv") => {
    await fetch("/api/watchlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, mediaType }),
    });
    mutate();
  };

  const isInWatchlist = (contentId: number, mediaType: "movie" | "tv") =>
    (data ?? []).some(
      (i) => i.contentId === contentId && i.mediaType === mediaType
    );

  return {
    watchlist: data ?? [],
    isLoading: isLoading && enabled,
    isError: error,
    addItem,
    removeItem,
    isInWatchlist,
  };
}
