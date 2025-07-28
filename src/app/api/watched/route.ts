import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { WatchedItem } from "@prisma/client";

/* Create per-route auth() helper (NextAuth v5) */
const { auth } = NextAuth(authOptions);

/* ─────────────── GET /api/watched ───────────────
   Return the signed-in user’s watched list */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items: WatchedItem[] = await prisma.watchedItem.findMany({
    where: { userId: session.user.id },
    orderBy: { watchedAt: "desc" },
  });

  return NextResponse.json(items);
}

/* ─────────────── POST /api/watched ───────────────
   Add or update a watched entry */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: {
    contentId: number;
    mediaType: "movie" | "tv";
    title: string;
    posterPath?: string | null;
    rating?: number | null;
    seasonNumber?: number | null;
  } = await request.json();

  const { contentId, mediaType, title, posterPath, rating, seasonNumber } =
    body;
  if (!contentId || !mediaType || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const season = seasonNumber ? Number(seasonNumber) : 0;

  await prisma.watchedItem.upsert({
    where: {
      userId_contentId_mediaType_seasonNumber: {
        userId: session.user.id,
        contentId: Number(contentId),
        mediaType,
        seasonNumber: season,
      },
    },
    update: {
      watchedAt: new Date(),
      rating,
      title,
      posterPath,
    },
    create: {
      userId: session.user.id,
      contentId: Number(contentId),
      mediaType,
      seasonNumber: season,
      title,
      posterPath,
      rating,
    },
  });

  return NextResponse.json({ ok: true });
}

/* ────────────── DELETE /api/watched ──────────────
   Remove a watched entry */
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentId, mediaType, seasonNumber } = (await request.json()) as {
    contentId: number;
    mediaType: "movie" | "tv";
    seasonNumber?: number | null;
  };

  if (!contentId || !mediaType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const season = seasonNumber ? Number(seasonNumber) : 0;

  await prisma.watchedItem.delete({
    where: {
      userId_contentId_mediaType_seasonNumber: {
        userId: session.user.id,
        contentId: Number(contentId),
        mediaType,
        seasonNumber: season,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
