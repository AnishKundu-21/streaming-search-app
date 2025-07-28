import { NextResponse } from "next/server";
import { getDiscover } from "@/lib/tmdb";

// TMDB Keyword IDs to exclude (for filtering adult content)
const ADULT_KEYWORD_IDS = [
  "281741", // nudity
  "190370", // erotic movie
  "155477", // softcore
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("mediaType") as "movie" | "tv" | null;
  const genreId = searchParams.get("genreId");

  if (!mediaType || !genreId) {
    return NextResponse.json(
      { error: "mediaType and genreId are required" },
      { status: 400 }
    );
  }

  try {
    const results = await getDiscover(
      mediaType,
      [genreId],
      undefined,
      ADULT_KEYWORD_IDS
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Discover API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch discover results" },
      { status: 500 }
    );
  }
}
