// src/hooks/useWatched.ts
"use client";

import useSWR from "swr";
import { useAuth } from "@/components/AuthProvider";

type WatchedItem = {
  id: string;
  userId: string;
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  watchedAt: string;
  rating?: number | null;
  seasonNumber?: number | null; // Add seasonNumber
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  });

/**
 * React hook for a signed-in user’s “already watched” list.
 *
 * addItem({ contentId, mediaType, title, posterPath?, rating?, seasonNumber? })
 * removeItem(contentId, mediaType, seasonNumber?)
 * isWatched(contentId, mediaType, seasonNumber?) → boolean
 */
export function useWatched() {
  /* Only fetch when authenticated */
  const { status } = useAuth();
  const enabled = status === "authenticated";

  const { data, error, isLoading, mutate } = useSWR<WatchedItem[]>(
    enabled ? "/api/watched" : null,
    fetcher
  );

  const normalizeSeason = (value?: number | null) =>
    typeof value === "number" && !Number.isNaN(value) ? value : 0;

  /* ---------- helpers ---------- */
  const addItem = async (item: {
    contentId: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath?: string | null;
    rating?: number;
    seasonNumber?: number | null; // Add seasonNumber
  }) => {
    await fetch("/api/watched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    mutate();
  };

  const removeItem = async (
    contentId: number,
    mediaType: "movie" | "tv",
    seasonNumber?: number | null // Add seasonNumber
  ) => {
    await fetch("/api/watched", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, mediaType, seasonNumber }),
    });
    mutate();
  };

  const isWatched = (
    contentId: number,
    mediaType: "movie" | "tv",
    seasonNumber?: number | null // Add seasonNumber
  ) =>
    (data ?? []).some(
      (i) =>
        i.contentId === contentId &&
        i.mediaType === mediaType &&
        normalizeSeason(i.seasonNumber) === normalizeSeason(seasonNumber)
    );

  return {
    watched: data ?? [],
    isLoading: isLoading && enabled,
    isError: error,
    addItem,
    removeItem,
    isWatched,
  };
}
