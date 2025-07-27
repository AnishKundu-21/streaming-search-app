// src/hooks/useWatched.ts
"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

type WatchedItem = {
  id: string;
  userId: string;
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  watchedAt: string;
  rating?: number | null;
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  });

/**
 * React hook for a signed-in user’s “already watched” list.
 *
 * addItem({ contentId, mediaType, title, posterPath?, rating? })
 * removeItem(contentId, mediaType)
 * isWatched(contentId, mediaType) → boolean
 */
export function useWatched() {
  /* Only fetch when authenticated */
  const { status } = useSession();
  const enabled = status === "authenticated";

  const { data, error, isLoading, mutate } = useSWR<WatchedItem[]>(
    enabled ? "/api/watched" : null,
    fetcher
  );

  /* ---------- helpers ---------- */
  const addItem = async (item: {
    contentId: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath?: string | null;
    rating?: number;
  }) => {
    await fetch("/api/watched", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    mutate();
  };

  const removeItem = async (contentId: number, mediaType: "movie" | "tv") => {
    await fetch("/api/watched", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentId, mediaType }),
    });
    mutate();
  };

  const isWatched = (contentId: number, mediaType: "movie" | "tv") =>
    (data ?? []).some(
      (i) => i.contentId === contentId && i.mediaType === mediaType
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
