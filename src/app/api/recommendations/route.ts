import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { WatchedItem } from "@prisma/client";

const { auth } = NextAuth(authOptions);

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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── fetch user's recently watched titles ── */
  const watched: WatchedItem[] = await prisma.watchedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { watchedAt: "desc" },
    take: 20,
  });

  if (watched.length === 0) {
    return NextResponse.json([]); // nothing to base on
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

  /* ── sort by TMDB popularity & limit ── */
  const final = Array.from(uniqueMap.values())
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40);

  return NextResponse.json(final);
}

/* reject other verbs */
export const POST = () =>
  NextResponse.json({ error: "Method not allowed" }, { status: 405 });
export const DELETE = POST;
export const PUT = POST;
export const PATCH = POST;
