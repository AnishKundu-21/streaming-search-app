import RecommendedSection from "@/components/RecommendedSection";
import ScrollableSection from "@/components/ScrollableSection";
import HeroSection from "@/components/HeroSection";
import {
  getMoviesInTheaters,
  getStreamingContent,
  getAsianDramas,
  getAnime,
  getTopRated,
  searchMoviesAndTV,
} from "@/lib/tmdb";

const ADULT_KEYWORD_IDS = ["281741", "190370", "155477"];
const ACTION_GENRES = ["28", "53"];
const DRAMA_GENRES = ["18"];
const COMEDY_GENRES = ["35"];
const FAMILY_GENRES = ["10751"];
const ANIME_GENRES = ["16"];

const take = <T,>(items: T[] = [], count = 18) => items.slice(0, count);

type SearchParams = Record<string, string | string[] | undefined>;
type ContentItem = Awaited<ReturnType<typeof searchMoviesAndTV>>[number];

type ContentSection = {
  title: string;
  items: ContentItem[];
  defaultMediaType?: "movie" | "tv";
};

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedSearchParams =
    (await Promise.resolve(searchParams)) ?? ({} as SearchParams);
  const rawQuery = resolvedSearchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery ?? "";
  const normalizedQuery = query.trim();
  const isSearching = normalizedQuery.length > 0;

  let sections: ContentSection[] = [];
  let searchResults: ContentItem[] = [];

  if (isSearching) {
    searchResults = await searchMoviesAndTV(normalizedQuery);
    if (searchResults.length > 0) {
      sections.push({
        title: `Results for "${normalizedQuery}"`,
        items: take(searchResults, 30),
      });
    }
  } else {
    const [
      theaterReleases,
      topRatedMovies,
      topRatedTV,
      netflixShows,
      primeVideo,
      jioHotstar,
      crunchyroll,
      asianDramas,
      anime,
    ] = await Promise.all([
      getMoviesInTheaters(),
      getTopRated("movie"),
      getTopRated("tv"),
      getStreamingContent("8"), // Netflix
      getStreamingContent("119"), // Prime Video
      getStreamingContent("122,337,220"), // Hotstar, Disney+, JioCinema
      getStreamingContent("283"), // Crunchyroll
      getAsianDramas(),
      getAnime(),
    ]);

    sections = [
      {
        title: "Trending Right Now",
        items: take(theaterReleases),
        defaultMediaType: "movie",
      },
      {
        title: "Top Rated Movies",
        items: take(topRatedMovies),
        defaultMediaType: "movie",
      },
      {
        title: "Top Rated TV Shows",
        items: take(topRatedTV),
        defaultMediaType: "tv",
      },
      {
        title: "Netflix Shows",
        items: take(netflixShows),
        defaultMediaType: "tv",
      },
      {
        title: "Prime Video",
        items: take(primeVideo),
        defaultMediaType: "tv",
      },
      {
        title: "JioHotstar",
        items: take(jioHotstar),
        defaultMediaType: "tv",
      },
      {
        title: "Crunchyroll",
        items: take(crunchyroll),
        defaultMediaType: "tv",
      },
      {
        title: "Asian Dramas",
        items: take(asianDramas),
        defaultMediaType: "tv",
      },
      {
        title: "Anime",
        items: take(anime),
        defaultMediaType: "tv",
      },
    ];
  }

  const heroTagline = isSearching
    ? `Search results tailored to "${normalizedQuery}".`
    : "Discover the standouts in film and television from every major service.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isSearching && <HeroSection tagline={heroTagline} />}

      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        {!isSearching && <RecommendedSection />}

        {isSearching && sections.length === 0 ? (
          <div className="mt-32 border border-white/10 bg-black p-12 text-center">
            <p className="text-lg font-bold uppercase tracking-widest text-white/60">
              No matches for &ldquo;{normalizedQuery}&rdquo;.
            </p>
            <p className="mt-2 text-sm font-medium text-white/40">
              Try another title, person, or keyword.
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <ScrollableSection
              key={section.title}
              title={section.title}
              items={section.items}
              defaultMediaType={section.defaultMediaType}
            />
          ))
        )}
      </div>
    </div>
  );
}
