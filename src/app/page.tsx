import Image from "next/image";
import Link from "next/link";
import RecommendedSection from "@/components/RecommendedSection";
import ScrollableSection from "@/components/ScrollableSection";
import { searchMoviesAndTV } from "@/lib/tmdb";

/* ---------- simple fetch helpers (home-page only) ---------- */
const TMDB = (path: string) =>
  fetch(
    `https://api.themoviedb.org/3${path}?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
    { next: { revalidate: 60 * 60 } }
  )
    .then((r) => r.json())
    .then((d) => d.results?.slice(0, 20) ?? []);

const getTrending = (media: "all" | "movie" | "tv") =>
  TMDB(`/trending/${media}/week`);
const getTopRated = (media: "movie" | "tv") => TMDB(`/${media}/top_rated`);
const getUpcoming = () => TMDB("/movie/upcoming");
const getNowPlaying = () => TMDB("/movie/now_playing");

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  media_type?: "movie" | "tv";
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  /* ––––– data fetches ––––– */
  let searchResults: TMDBItem[] = [];
  let trendingMovies: TMDBItem[] = [];
  let trendingTV: TMDBItem[] = [];
  let trendingAll: TMDBItem[] = [];
  let topRatedMovies: TMDBItem[] = [];
  let topRatedTV: TMDBItem[] = [];
  let upcomingMovies: TMDBItem[] = [];
  let nowPlaying: TMDBItem[] = [];

  if (query) {
    searchResults = await searchMoviesAndTV(query);
  } else {
    [
      trendingMovies,
      trendingTV,
      trendingAll,
      topRatedMovies,
      topRatedTV,
      upcomingMovies,
      nowPlaying,
    ] = await Promise.all([
      getTrending("movie"),
      getTrending("tv"),
      getTrending("all"),
      getTopRated("movie"),
      getTopRated("tv"),
      getUpcoming(),
      getNowPlaying(),
    ]);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        {/* ── hero / search –– */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Next{" "}
            <span className="text-blue-600 dark:text-blue-400">Stream</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Discover movies and TV shows with streaming availability in India
          </p>
          <form method="GET" className="max-w-2xl mx-auto flex gap-2 mb-8">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for movies or TV shows..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* ── search-results vs browse –– */}
        {query ? (
          <>
            <h2 className="text-2xl font-bold mb-6">
              Search Results for &quot;{query}&quot;
            </h2>
            {searchResults.length ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={`${item.media_type ?? "movie"}-${item.id}`}
                    className="group"
                  >
                    <Link href={`/${item.media_type ?? "movie"}/${item.id}`}>
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-gray-800">
                        {item.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                            alt={item.title || item.name || "Poster"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            No Image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {item.media_type === "tv" || item.first_air_date
                            ? "TV"
                            : "Movie"}
                        </div>
                      </div>
                    </Link>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <Link href={`/${item.media_type ?? "movie"}/${item.id}`}>
                        {item.title || item.name}
                      </Link>
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No results found – try another term.
              </p>
            )}
          </>
        ) : (
          <>
            <RecommendedSection />
            <ScrollableSection title="Trending This Week" items={trendingAll} />
            <ScrollableSection
              title="Top-Rated Movies"
              items={topRatedMovies}
              defaultMediaType="movie"
            />
            <ScrollableSection
              title="Top-Rated TV Shows"
              items={topRatedTV}
              defaultMediaType="tv"
            />
            <ScrollableSection
              title="Upcoming Movies"
              items={upcomingMovies}
              defaultMediaType="movie"
            />
            <ScrollableSection
              title="Now Playing in Theatres"
              items={nowPlaying}
              defaultMediaType="movie"
            />
            <ScrollableSection
              title="Trending Movies"
              items={trendingMovies}
              defaultMediaType="movie"
            />
            <ScrollableSection
              title="Trending TV Shows"
              items={trendingTV}
              defaultMediaType="tv"
            />
          </>
        )}
      </div>
    </div>
  );
}
