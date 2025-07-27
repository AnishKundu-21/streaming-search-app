import { NextResponse } from "next/server";
import { searchContent, getWatchProviders } from "@/lib/tmdb"; // Adjust alias if needed

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const country = searchParams.get("country") || "IN";
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const genre = searchParams.get("genre");
  const minRating = searchParams.get("minRating");
  const provider = searchParams.get("provider");

  if (!query)
    return NextResponse.json({ error: "Query required" }, { status: 400 });

  try {
    // CORRECTED: Convert null to undefined before passing to the function
    const contents = await searchContent(
      query,
      type,
      genre ?? undefined,
      minRating ?? undefined
    );
    if (!contents || contents.length === 0)
      return NextResponse.json({ error: "No results found" }, { status: 404 });

    const results = await Promise.all(
      contents.slice(0, 10).map(async (content) => {
        const providers = await getWatchProviders(content.id, type);
        let availability = providers[country] || {
          note: "Not available in selected country",
        };

        if (provider) {
          const providerId = parseInt(provider);
          availability = {
            ...availability,
            flatrate:
              availability.flatrate?.filter(
                (p: any) => p.provider_id === providerId
              ) || [],
            buy:
              availability.buy?.filter(
                (p: any) => p.provider_id === providerId
              ) || [],
            rent:
              availability.rent?.filter(
                (p: any) => p.provider_id === providerId
              ) || [],
          };
          if (
            !availability.flatrate.length &&
            !availability.buy.length &&
            !availability.rent.length
          ) {
            availability.note = "Not available on selected provider";
          }
        }

        return {
          id: content.id,
          title: content.title || content.name,
          posterPath: content.poster_path,
          overview: content.overview,
          availability,
        };
      })
    );

    const filteredResults = provider
      ? results.filter(
          (r) =>
            !r.availability.note ||
            r.availability.note !== "Not available on selected provider"
        )
      : results;

    return NextResponse.json({ results: filteredResults, country });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "API error occurred" }, { status: 500 });
  }
}
