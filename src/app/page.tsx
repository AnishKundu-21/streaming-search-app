import RecommendedSection from "@/components/RecommendedSection";
import ScrollableSection from "@/components/ScrollableSection";
import {
  getDiscover,
  getTopRated,
  getTrending,
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
type ContentSection = {
  title: string;
  items: any[];
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
  let searchResults: any[] = [];

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
      trendingAll,
      trendingMovies,
      trendingSeries,
      topRatedMovies,
      topRatedSeries,
      actionThrillers,
      prestigeDrama,
      comedySeries,
      familyFavorites,
      animeSpotlight,
    ] = await Promise.all([
      getTrending("all", "week"),
      getTrending("movie", "week"),
      getTrending("tv", "week"),
      getTopRated("movie"),
      getTopRated("tv"),
      getDiscover("movie", ACTION_GENRES, undefined, ADULT_KEYWORD_IDS),
      getDiscover("tv", DRAMA_GENRES, undefined, ADULT_KEYWORD_IDS),
      getDiscover("tv", COMEDY_GENRES, undefined, ADULT_KEYWORD_IDS),
      getDiscover("movie", FAMILY_GENRES, undefined, ADULT_KEYWORD_IDS),
      getDiscover("tv", ANIME_GENRES, "JP", ADULT_KEYWORD_IDS),
    ]);

    sections = [
      { title: "Now Streaming Highlights", items: take(trendingAll) },
      {
        title: "Cinematic Premieres",
        items: take(trendingMovies),
        defaultMediaType: "movie",
      },
      {
        title: "Binge-Worthy Series",
        items: take(trendingSeries),
        defaultMediaType: "tv",
      },
      {
        title: "Top Rated Films",
        items: take(topRatedMovies),
        defaultMediaType: "movie",
      },
      {
        title: "Top Rated Series",
        items: take(topRatedSeries),
        defaultMediaType: "tv",
      },
      {
        title: "Thrills & Suspense",
        items: take(actionThrillers),
        defaultMediaType: "movie",
      },
      {
        title: "Award-Worthy Drama",
        items: take(prestigeDrama),
        defaultMediaType: "tv",
      },
      {
        title: "Comedy Comfort",
        items: take(comedySeries),
        defaultMediaType: "tv",
      },
      {
        title: "Family Movie Night",
        items: take(familyFavorites),
        defaultMediaType: "movie",
      },
      {
        title: "Anime Spotlight",
        items: take(animeSpotlight),
        defaultMediaType: "tv",
      },
    ];
  }

  const heroTagline = isSearching
    ? `Search results tailored to "${normalizedQuery}".`
    : "Discover the standouts in film and television from every major service.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-soft sm:px-10 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-muted-foreground">
            StreamFinder
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            All of streaming, one destination.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
            {heroTagline}
          </p>

          <form
            className="mx-auto mt-10 max-w-3xl"
            action="/"
            method="GET"
            role="search"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="text"
                name="q"
                defaultValue={normalizedQuery}
                placeholder="Search for series, films, people, or collections"
                className="h-[3.75rem] w-full flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-base text-white placeholder:text-white/60 shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-2 focus:ring-offset-black sm:px-6"
              />
              <button
                type="submit"
                className="h-[3.75rem] w-full rounded-full bg-accent px-8 text-base font-semibold text-white transition hover:bg-accent-soft focus:outline-none focus:ring-2 focus:ring-accent/60 focus:ring-offset-2 focus:ring-offset-black sm:w-auto sm:px-10"
              >
                Search
              </button>
            </div>
          </form>

          {!isSearching && (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              <span>Series</span>
              <span className="h-4 w-px bg-white/20" />
              <span>Movies</span>
              <span className="h-4 w-px bg-white/20" />
              <span>Originals</span>
              <span className="h-4 w-px bg-white/20" />
              <span>Just Added</span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-4 pb-24 sm:px-6 lg:px-8">
        {!isSearching && <RecommendedSection />}

        {isSearching && sections.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-card p-12 text-center text-lg text-muted-foreground shadow-soft">
            No matches for "{normalizedQuery}". Try another title, person, or
            keyword.
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
