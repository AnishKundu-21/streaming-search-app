import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const OMDB_BASE_URL = "http://www.omdbapi.com";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");
    const mediaType = searchParams.get("mediaType");

    if (!tmdbId || !mediaType) {
        return NextResponse.json(
            { error: "Missing tmdbId or mediaType" },
            { status: 400 }
        );
    }

    if (!TMDB_API_KEY) {
        console.error("Missing TMDB_API_KEY");
        return NextResponse.json({ rating: null });
    }

    try {
        // Fetch details from TMDB to get vote_average
        const tmdbResponse = await fetch(
            `${TMDB_BASE_URL}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}`
        );

        if (!tmdbResponse.ok) {
            console.warn(`TMDB fetch failed for ${mediaType}/${tmdbId}: ${tmdbResponse.status}`);
            return NextResponse.json({ rating: null });
        }

        const tmdbData = await tmdbResponse.json();

        // Format vote_average to 1 decimal place (e.g., 7.8)
        const rating = tmdbData.vote_average
            ? tmdbData.vote_average.toFixed(1)
            : null;

        return NextResponse.json({ rating });
    } catch (error) {
        console.error("Rating fetch error:", error);
        return NextResponse.json({ rating: null });
    }
}
