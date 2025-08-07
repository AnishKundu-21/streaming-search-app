import Image from "next/image";
import Link from "next/link";
import RecommendedSection from "@/components/RecommendedSection";
import ScrollableSection from "@/components/ScrollableSection";
import {
  searchMoviesAndTV,
  getTrending,
  getTopRated,
  getDiscover,
} from "@/lib/tmdb";

// TMDB Genre IDs
const ACTION_ID = "28";
const DRAMA_ID = "18";
const ROMANCE_ID = "10749";
const ANIMATION_ID = "16";
const TV_ACTION_ADVENTURE_ID = "10759";
const TV_SCI_FI_FANTASY_ID = "10765";

// TMDB Keyword IDs to exclude (for filtering adult content)
const ADULT_KEYWORD_IDS = [
  "281741", // nudity
  "190370", // erotic movie
  "155477", // softcore
];

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  media_type?: "movie" | "tv";
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  popularity: number;
  genre_ids?: number[];
  origin_country?: string[];
}

// Helper to fetch, combine, and sort genre data
const getCombinedGenreSection = async (
  movieGenreIds: string[],
  tvGenreIds: string[],
  countryCode?: string
) => {
  const [movies, tvShows] = await Promise.all([
    getDiscover("movie", movieGenreIds, countryCode, ADULT_KEYWORD_IDS),
    getDiscover("tv", tvGenreIds, countryCode, ADULT_KEYWORD_IDS),
  ]);

  // Manually add the media_type to each item before combining
  const typedMovies = movies.map((item) => ({
    ...item,
    media_type: "movie" as const,
  }));
  const typedTvShows = tvShows.map((item) => ({
    ...item,
    media_type: "tv" as const,
  }));

  const combined = [...typedMovies, ...typedTvShows].sort(
    (a, b) => b.popularity - a.popularity
  );

  return combined.slice(0, 50);
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let searchResults: TMDBItem[] = [];
  let trendingMovies: TMDBItem[] = [];
  let trendingTV: TMDBItem[] = [];
  let topRatedMovies: TMDBItem[] = [];
  let topRatedTV: TMDBItem[] = [];
  // Genre-specific fetches
  let action: TMDBItem[] = [];
  let drama: TMDBItem[] = [];
  let romance: TMDBItem[] = [];
  let kdramas: TMDBItem[] = [];
  let anime: TMDBItem[] = [];
  let animation: TMDBItem[] = [];

  if (query) {
    searchResults = await searchMoviesAndTV(query);
  } else {
    [
      trendingMovies,
      trendingTV,
      topRatedMovies,
      topRatedTV,
      action,
      drama,
      romance,
      kdramas,
      anime,
      animation,
    ] = await Promise.all([
      getTrending("movie"),
      getTrending("tv"),
      getTopRated("movie"),
      getTopRated("tv"),
      getCombinedGenreSection([ACTION_ID], [TV_ACTION_ADVENTURE_ID]),
      getCombinedGenreSection([DRAMA_ID], [DRAMA_ID]),
      getCombinedGenreSection([ROMANCE_ID], [TV_SCI_FI_FANTASY_ID]),
      Promise.all([
        getDiscover("tv", [DRAMA_ID], "KR", ADULT_KEYWORD_IDS),
        getDiscover("tv", [DRAMA_ID], "CN", ADULT_KEYWORD_IDS),
        getDiscover("tv", [DRAMA_ID], "JP", ADULT_KEYWORD_IDS),
      ]).then((results) => {
        const combined = results.flat();
        // Filter out anime and animation from East Asian Dramas section
        const filtered = combined.filter((item) => {
          // Filter out if it has animation genre (ID 16)
          if (item.genre_ids?.includes(16)) {
            return false;
          }

          // Additional filtering for potential anime content by title keywords
          const title = (item.name || item.title || "").toLowerCase();
          const animeKeywords = [
            "anime",
            "dragon ball",
            "naruto",
            "one piece",
            "attack on titan",
            "demon slayer",
            "my hero academia",
            "jujutsu kaisen",
            "bleach",
            "hunter x hunter",
            "death note",
            "fullmetal alchemist",
            "cowboy bebop",
            "studio ghibli",
            "spirited away",
            "princess mononoke",
          ];

          const isLikelyAnime = animeKeywords.some((keyword) =>
            title.includes(keyword)
          );

          return !isLikelyAnime;
        });
        return filtered
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 50);
      }),
      getDiscover("tv", [ANIMATION_ID], "JP", ADULT_KEYWORD_IDS),
      getCombinedGenreSection([ANIMATION_ID], [ANIMATION_ID]),
    ]);
  }

  return (
    <div className="min-h-screen bg-main text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero / Search Section */}
        <div className="text-center my-8 md:my-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Find Your Next <span className="text-accent">Stream</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover movies and TV shows with streaming availability across the
            globe.
          </p>
          <form
            action="/search"
            method="GET"
            className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 mb-8 px-4 sm:px-0"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for movies or TV shows..."
              className="flex-1 w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {query ? (
          // Search Results
          <></>
        ) : (
          // Homepage Content
          <>
            <RecommendedSection />
            <ScrollableSection
              title="Trending Movies"
              items={trendingMovies ?? []}
              defaultMediaType="movie"
            />
            <ScrollableSection
              title="Trending TV Shows"
              items={trendingTV ?? []}
              defaultMediaType="tv"
            />
            <ScrollableSection title="Popular in Action" items={action ?? []} />
            <ScrollableSection title="Popular in Drama" items={drama ?? []} />
            <ScrollableSection
              title="Popular in Romance"
              items={romance ?? []}
            />
            <ScrollableSection
              title="Popular in Animation"
              items={animation ?? []}
            />
            <ScrollableSection
              title="East Asian Dramas"
              items={kdramas ?? []}
              defaultMediaType="tv"
            />
            <ScrollableSection
              title="Popular Anime"
              items={anime ?? []}
              defaultMediaType="tv"
            />
          </>
        )}
      </div>
    </div>
  );
}
