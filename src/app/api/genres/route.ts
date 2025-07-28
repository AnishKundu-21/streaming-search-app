import { NextResponse } from "next/server";
import { getGenres } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("mediaType") as "movie" | "tv" | null;

  if (!mediaType) {
    return NextResponse.json(
      { error: "mediaType is required" },
      { status: 400 }
    );
  }

  try {
    const { genres } = await getGenres(mediaType);
    return NextResponse.json(genres);
  } catch (error) {
    console.error("Genres API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
