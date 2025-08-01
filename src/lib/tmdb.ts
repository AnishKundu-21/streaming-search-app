const API_KEY = process.env.TMDB_API_KEY!;
const BASE = "https://api.themoviedb.org/3";

/* ----------------------------------------------------------
   Shared fetch helper with proper typing
   ---------------------------------------------------------- */
const defaultFetchOpts = { next: { revalidate: 60 * 60 } };

interface TMDBResponse<T> {
  results: T[];
  total_pages?: number;
  total_results?: number;
}

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  media_type?: "movie" | "tv";
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  popularity: number;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

interface ExternalIds {
  imdb_id?: string;
}

// New interface for individual season details
interface SeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

// New interface for video data
interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface MovieDetails extends TMDBItem {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  external_ids: ExternalIds;
  videos: { results: Video[] };
}

interface TVDetails extends TMDBItem {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  external_ids: ExternalIds;
  seasons: SeasonDetails[]; // Add seasons array
  videos: { results: Video[] };
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  credit_id: string;
}

interface Credits {
  cast: CastMember[];
}

interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface ProviderCountry {
  link?: string;
  flatrate?: WatchProvider[];
  buy?: WatchProvider[];
  rent?: WatchProvider[];
}

interface WatchProviders {
  [countryCode: string]: ProviderCountry;
}

function tmdb<T = any>(
  path: string,
  qs: Record<string, string | number | string[] | boolean> = {} // Allow boolean
): Promise<T> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    ...Object.fromEntries(Object.entries(qs).map(([k, v]) => [k, String(v)])),
  });

  return fetch(`${BASE}${path}?${params}`, defaultFetchOpts).then((res) => {
    if (!res.ok) throw new Error(`TMDB error for ${path}`);
    return res.json() as Promise<T>;
  });
}

/* ----------------------------------------------------------
   Search functions
   ---------------------------------------------------------- */
export async function searchMoviesAndTV(query: string): Promise<TMDBItem[]> {
  const data = await tmdb<TMDBResponse<TMDBItem>>("/search/multi", {
    query,
    page: 1,
    include_adult: false,
  });
  return data.results.filter(
    (i) => i.media_type === "movie" || i.media_type === "tv"
  );
}

// Add this missing export
export async function searchContent(query: string): Promise<TMDBItem[]> {
  return searchMoviesAndTV(query);
}

/* ----------------------------------------------------------
   Individual details helpers
   ---------------------------------------------------------- */
export async function getMovieDetails(id: number) {
  try {
    const [details, providers, credits] = await Promise.all([
      tmdb<MovieDetails>(`/movie/${id}`, {
        append_to_response: "external_ids,videos",
      }),
      tmdb<{ results: WatchProviders }>(`/movie/${id}/watch/providers`),
      tmdb<Credits>(`/movie/${id}/credits`),
    ]);

    return { details, providers: providers.results ?? {}, credits };
  } catch (err) {
    console.error("getMovieDetails error:", err);
    return null;
  }
}

export async function getTVDetails(id: number) {
  try {
    const [details, providers, credits] = await Promise.all([
      tmdb<TVDetails>(`/tv/${id}`, {
        append_to_response: "external_ids,videos",
      }),
      tmdb<{ results: WatchProviders }>(`/tv/${id}/watch/providers`),
      tmdb<Credits>(`/tv/${id}/credits`),
    ]);

    return { details, providers: providers.results ?? {}, credits };
  } catch (err) {
    console.error("getTVDetails error:", err);
    return null;
  }
}

// Add this missing export
export async function getWatchProviders(
  id: number,
  mediaType: "movie" | "tv"
): Promise<WatchProviders> {
  try {
    const data = await tmdb<{ results: WatchProviders }>(
      `/${mediaType}/${id}/watch/providers`
    );
    return data.results ?? {};
  } catch (err) {
    console.error("getWatchProviders error:", err);
    return {};
  }
}

/* ----------------------------------------------------------
   Browse helpers used on the Home page
   ---------------------------------------------------------- */
export async function getTrending(
  media: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
): Promise<TMDBItem[]> {
  const data = await tmdb<TMDBResponse<TMDBItem>>(
    `/trending/${media}/${timeWindow}`
  );
  return data.results;
}

export async function getTopRated(media: "movie" | "tv"): Promise<TMDBItem[]> {
  const data = await tmdb<TMDBResponse<TMDBItem>>(`/${media}/top_rated`);
  return data.results;
}

// New function to discover content by genre and country
export async function getDiscover(
  media: "movie" | "tv",
  genreIds: string[],
  countryCode?: string,
  excludeKeywordIds?: string[]
): Promise<TMDBItem[]> {
  const queryParams: Record<string, string | number | string[] | boolean> = {
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    include_adult: false,
  };
  if (countryCode) {
    queryParams.with_origin_country = countryCode;
  }
  if (excludeKeywordIds) {
    queryParams.without_keywords = excludeKeywordIds.join(",");
  }
  const data = await tmdb<TMDBResponse<TMDBItem>>(
    `/discover/${media}`,
    queryParams
  );
  return data.results;
}

// New function to get the list of genres
export async function getGenres(
  media: "movie" | "tv"
): Promise<{ genres: Genre[] }> {
  return tmdb<{ genres: Genre[] }>(`/genre/${media}/list`);
}
