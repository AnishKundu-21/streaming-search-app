import { getContentList } from "@/lib/tmdb";
import ContentRow from "@/components/ContentRow";

export default async function Home() {
  // Fetch multiple content lists concurrently on the server
  const [popularMovies, topRatedMovies, popularTv, topRatedTv] =
    await Promise.all([
      getContentList("popular", "movie"),
      getContentList("top_rated", "movie"),
      getContentList("popular", "tv"),
      getContentList("top_rated", "tv"),
    ]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* The Navbar is now in layout.tsx, so the header is removed from here */}
      <section className="text-center py-16 md:py-24 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Your Streaming Guide
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Search for movies & TV shows and find where to watch them.
          </p>
          <form action="/search" method="GET" className="max-w-xl mx-auto">
            <input
              name="q"
              type="search"
              placeholder="Search for a movie or TV show..."
              className="w-full p-4 text-lg rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentRow title="Popular Movies" items={popularMovies} type="movie" />
        <ContentRow
          title="Top Rated Movies"
          items={topRatedMovies}
          type="movie"
        />
        <ContentRow title="Popular TV Shows" items={popularTv} type="tv" />
        <ContentRow title="Top Rated TV Shows" items={topRatedTv} type="tv" />
      </div>

      <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Built for personal use. Data provided by TMDB.
        </p>
      </footer>
    </div>
  );
}
