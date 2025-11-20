
// src/hooks/useRecommendations.ts
"use client";

import useSWR from "swr";
import { useAuth } from "@/components/AuthProvider";

export type Recommendation = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  popularity: number;
  releaseDate?: string;
  firstAirDate?: string;
};

// Define the shape of the data returned by the API
type RecommendationsResponse = {
  results: Recommendation[];
};

const fetcher = (url: string): Promise<RecommendationsResponse> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Network error");
    return r.json();
  });

/**
 * React hook to fetch personalised TMDB recommendations for the
 * currently-signed-in user.
 *
 * Returns:
 * - recommendations: Recommendation[]
 * - isLoading: boolean
 * - isError: Error | undefined
 * - refresh: () => void
 */
export function useRecommendations() {
  /* Only fetch when the user is authenticated */
  const { status } = useAuth();
  const enabled = status === "authenticated";

  const {
    data,
    error,
    isLoading,
    mutate: refresh,
  } = useSWR<RecommendationsResponse>(
    enabled ? "/api/recommendations" : null,
    fetcher
  );

  return {
    recommendations: data?.results || [],
    isLoading,
    isError: error,
    refresh,
  };
}
