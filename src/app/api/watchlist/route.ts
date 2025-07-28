import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const { auth } = NextAuth(authOptions);

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.watchlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentId, mediaType, title, posterPath, seasonNumber } =
    await request.json();
  if (!contentId || !mediaType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const season = seasonNumber ? Number(seasonNumber) : 0;

  await prisma.watchlistItem.upsert({
    where: {
      userId_contentId_mediaType_seasonNumber: {
        userId: session.user.id,
        contentId: Number(contentId),
        mediaType,
        seasonNumber: season,
      },
    },
    update: { title, posterPath },
    create: {
      userId: session.user.id,
      contentId: Number(contentId),
      mediaType,
      seasonNumber: season,
      title: title ?? "",
      posterPath,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentId, mediaType, seasonNumber } = await request.json();
  if (!contentId || !mediaType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const season = seasonNumber ? Number(seasonNumber) : 0;

  // Use deleteMany to avoid errors if the record doesn't exist
  await prisma.watchlistItem.deleteMany({
    where: {
      userId: session.user.id,
      contentId: Number(contentId),
      mediaType,
      seasonNumber: season,
    },
  });

  return NextResponse.json({ ok: true });
}