import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the auth helper for this specific API route
const { auth } = NextAuth(authOptions);

/**
 * One document per watch-list item:
 * {
 *   id         String   @id  @default(auto())  @map("_id")
 *   userId     String   // session.user.id
 *   contentId  Int      // TMDB id
 *   mediaType  String   // "movie" | "tv"
 *   title      String
 *   posterPath String?
 *   addedAt    DateTime @default(now())
 * }
 */

/* ─────────── GET – return current user's watchlist ─────────── */
export async function GET(request: Request) {
  const session = await auth();

  console.log("GET /api/watchlist - Session:", session); // Debug log

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.watchlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { addedAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

/* ─────────── POST – add / update an item ─────────── */
export async function POST(request: Request) {
  const session = await auth();

  console.log("POST /api/watchlist - Session:", session); // Debug log

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { contentId, mediaType, title, posterPath } = await request.json();

    if (!contentId || !mediaType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.watchlistItem.upsert({
      where: {
        userId_contentId_mediaType: {
          userId: session.user.id,
          contentId: Number(contentId),
          mediaType,
        },
      },
      update: { title, posterPath },
      create: {
        userId: session.user.id,
        contentId: Number(contentId),
        mediaType,
        title: title ?? "",
        posterPath,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

/* ─────────── DELETE – remove an item ─────────── */
export async function DELETE(request: Request) {
  const session = await auth();

  console.log("DELETE /api/watchlist - Session:", session); // Debug log

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { contentId, mediaType } = await request.json();

    if (!contentId || !mediaType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.watchlistItem.delete({
      where: {
        userId_contentId_mediaType: {
          userId: session.user.id,
          contentId: Number(contentId),
          mediaType,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
