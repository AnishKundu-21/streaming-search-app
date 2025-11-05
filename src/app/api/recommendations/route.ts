import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRouteUser } from "@/lib/supabase-route";
import type { WatchedItem } from "@prisma/client";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const TMDB_BASE = "https://api.themoviedb.org/3";

type TMDBItem = {
  id: number;
  title?: string; // movies
  name?: string; // tv
  poster_path: string | null;
  media_type?: "movie" | "tv";
  popularity: number;
};

type RecommendationItem = {
  id: number;
  title: string;
  mediaType: "movie" | "tv";
  posterPath: string | null;
  popularity: number;
};

/* ------- helper to call TMDB and return JSON ------- */
async function tmdb(path: string) {
  const url = `${TMDB_BASE}${path}?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // cache 1 hour
  if (!res.ok) throw new Error("TMDB request failed");
  return res.json();
}

/* ---------------------------  GET  --------------------------- */
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
    return NextResponse.json({ movies: [], tvShows: [] });
  }

  /* ── make TMDB calls in parallel ── */
  const recPromises = watched.map(async (item: WatchedItem) => {
    const endpoint =
      item.mediaType === "movie"
        ? `/movie/${item.contentId}/recommendations`
        : `/tv/${item.contentId}/similar`;

    try {
      const data = (await tmdb(endpoint)) as { results: TMDBItem[] };
      return data.results.slice(0, 5).map(
        (r): RecommendationItem => ({
          id: r.id,
          title: r.title ?? r.name ?? "",
          mediaType: item.mediaType as "movie" | "tv",
          posterPath: r.poster_path,
          popularity: r.popularity,
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

  /* ── sort by TMDB popularity & separate by media type ── */
  const final = Array.from(uniqueMap.values()).sort(
    (a, b) => b.popularity - a.popularity
  );

  const movies = final.filter((r) => r.mediaType === "movie").slice(0, 20);
  const tvShows = final.filter((r) => r.mediaType === "tv").slice(0, 20);

  return NextResponse.json({ movies, tvShows });
}

/* reject other verbs */
export const POST = () =>
  NextResponse.json({ error: "Method not allowed" }, { status: 405 });
export const DELETE = POST;
export const PUT = POST;
export const PATCH = POST;
