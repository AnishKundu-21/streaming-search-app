import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/supabase-route";
import { tmdb } from "@/lib/tmdb";
import type { WatchedItem } from "@prisma/client";

type TMDBItem = {
  id: number;
  title?: string; // movies
  name?: string; // tv
  poster_path: string | null;
  media_type?: "movie" | "tv";
  popularity: number;
  release_date?: string;
  first_air_date?: string;
};

type RecommendationItem = {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  popularity: number;
  releaseDate?: string;
  firstAirDate?: string;
};

export async function GET() {
  /* ── auth ── */
  const { user, error } = await getRouteUser();
  if (error || !user) {
    console.error("Supabase auth error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── fetch user's recently watched titles ── */
  const watched: WatchedItem[] = await prisma.watchedItem.findMany({
    where: { userId: user.id },
    orderBy: { watchedAt: "desc" },
    take: 20,
  });

  if (watched.length === 0) {
    return NextResponse.json({ results: [] });
  }

  /* ── make TMDB calls in parallel ── */
  const recPromises = watched.map(async (item: WatchedItem) => {
    const endpoint =
      item.mediaType === "movie"
        ? `/movie/${item.contentId}/recommendations`
        : `/tv/${item.contentId}/similar`;

    try {
      const data = (await tmdb<{ results: TMDBItem[] }>(endpoint));
      return data.results.slice(0, 5).map(
        (r): RecommendationItem => ({
          id: r.id,
          title: r.title ?? r.name ?? "",
          mediaType: item.mediaType as "movie" | "tv",
          posterPath: r.poster_path,
          popularity: r.popularity,
          releaseDate: r.release_date,
          firstAirDate: r.first_air_date,
        })
      );
    } catch {
      return [];
    }
  });

  const recArrays = await Promise.all(recPromises);
  const allRecs = recArrays.flat();

  /* ── remove anything the user already watched ── */
  const watchedSet = new Set(
    watched.map((w: WatchedItem) => `${w.mediaType}-${w.contentId}`)
  );
  const uniqueMap = new Map<string, RecommendationItem>();

  for (const r of allRecs) {
    const key = `${r.mediaType}-${r.id}`;
    if (!watchedSet.has(key) && !uniqueMap.has(key)) {
      uniqueMap.set(key, r);
    }
  }

  /* ── sort by TMDB popularity ── */
  const final = Array.from(uniqueMap.values()).sort(
    (a, b) => b.popularity - a.popularity
  );

  // Take top 15 movies and top 15 TV shows if possible, or just mix top results
  const movies = final.filter((r) => r.mediaType === "movie").slice(0, 15);
  const tvShows = final.filter((r) => r.mediaType === "tv").slice(0, 15);

  // Combine and shuffle
  const combined = [...movies, ...tvShows].sort(() => Math.random() - 0.5);

  return NextResponse.json({ results: combined });
}

/* reject other verbs */
export const POST = () =>
  NextResponse.json({ error: "Method not allowed" }, { status: 405 });
export const PUT = POST;
export const PATCH = POST;
