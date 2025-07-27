// src/hooks/useRecommendations.ts
"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";

export type Recommendation = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  popularity: number;
};

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  });

/**
 * React hook to fetch personalised TMDB recommendations for the
 * currently-signed-in user.
 *
 * Returns:
 *  - recommendations : Recommendation[]
 *  - isLoading       : boolean
 *  - isError         : Error | undefined
 *  - refresh         : () => void
 */
export function useRecommendations() {
  /* Only fetch when the user is authenticated */
  const { status } = useSession();
  const enabled = status === "authenticated";

  const {
    data,
    error,
    isLoading,
    mutate: refresh,
  } = useSWR<Recommendation[]>(
    enabled ? "/api/recommendations" : null,
    fetcher,
    { keepPreviousData: true }
  );

  return {
    recommendations: data ?? [],
    isLoading: isLoading && enabled,
    isError: error,
    refresh,
  };
}
