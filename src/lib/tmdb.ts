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
  genre_ids: any;
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

interface EpisodeDetails {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  runtime?: number | null;
  air_date?: string;
}

interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  air_date?: string;
  poster_path: string | null;
  season_number: number;
  episodes: EpisodeDetails[];
  videos?: { results: Video[] };
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
   Search functions with typo tolerance
   ---------------------------------------------------------- */

// Helper function to generate search variations for typo tolerance
function generateSearchVariations(query: string): string[] {
  const variations = [query.toLowerCase().trim()];

  // Remove extra spaces and normalize
  const normalized = query.replace(/\s+/g, " ").trim();
  if (normalized !== query.toLowerCase()) {
    variations.push(normalized);
  }

  // Generate typo-tolerant variations
  const words = normalized.split(" ");
  const enhancedVariations: string[] = [];

  words.forEach((word) => {
    if (word.length > 2) {
      // Add the word itself
      enhancedVariations.push(word);

      // Handle common typos for longer words
      if (word.length > 3) {
        // 1. Remove doubled letters more aggressively (suupermann -> superman)
        let dedoubled = word;
        // Keep applying until no more doubles found
        let previousLength = 0;
        while (dedoubled.length !== previousLength) {
          previousLength = dedoubled.length;
          dedoubled = dedoubled.replace(/(.)\1+/g, "$1");
        }
        if (dedoubled !== word && dedoubled.length >= 3) {
          enhancedVariations.push(dedoubled);
        }

        // 2. Try variants with different doubled letter combinations
        for (let i = 0; i < word.length - 1; i++) {
          if (word[i] === word[i + 1]) {
            // Remove one of the doubled letters
            const singleLetter = word.slice(0, i) + word.slice(i + 1);
            if (singleLetter.length >= 3) {
              enhancedVariations.push(singleLetter);
            }
          }
        }

        // 3. Handle specific patterns like 'uu' -> 'u', 'mm' -> 'm'
        const commonDoubles = [
          "aa",
          "bb",
          "cc",
          "dd",
          "ee",
          "ff",
          "gg",
          "hh",
          "ii",
          "jj",
          "kk",
          "ll",
          "mm",
          "nn",
          "oo",
          "pp",
          "qq",
          "rr",
          "ss",
          "tt",
          "uu",
          "vv",
          "ww",
          "xx",
          "yy",
          "zz",
        ];
        commonDoubles.forEach((double) => {
          if (word.includes(double)) {
            const single = word.replace(new RegExp(double, "g"), double[0]);
            if (single !== word && single.length >= 3) {
              enhancedVariations.push(single);
            }
          }
        });

        // 4. Try removing one character at different positions (extra letters)
        for (let i = 0; i < word.length; i++) {
          const variant = word.slice(0, i) + word.slice(i + 1);
          if (variant.length >= 3) {
            enhancedVariations.push(variant);
          }
        }

        // 5. Try swapping adjacent characters (common typo)
        for (let i = 0; i < word.length - 1; i++) {
          const chars = word.split("");
          [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
          const swapped = chars.join("");
          enhancedVariations.push(swapped);
        }

        // 6. Handle 'nn' -> 'n' specifically for words like "suupermann"
        if (word.includes("nn")) {
          const singleN = word.replace(/nn/g, "n");
          if (singleN !== word) {
            enhancedVariations.push(singleN);
          }
        }

        // 7. Try phonetic replacements
        const phoneticReplacements = [
          ["ph", "f"],
          ["ck", "k"],
          ["qu", "kw"],
          ["x", "ks"],
          ["c", "k"],
          ["z", "s"],
          ["j", "g"],
        ];
        phoneticReplacements.forEach(([from, to]) => {
          if (word.includes(from)) {
            const replaced = word.replace(new RegExp(from, "g"), to);
            enhancedVariations.push(replaced);
          }
        });
      }
    }
  });

  // Add word-based variations
  if (words.length > 1) {
    // Try each word individually
    enhancedVariations.push(...words.filter((w) => w.length > 2));

    // Try combinations of words
    for (let i = 0; i < words.length - 1; i++) {
      enhancedVariations.push(words.slice(i, i + 2).join(" "));
    }
  }

  // Add all enhanced variations
  variations.push(...enhancedVariations);

  // Remove duplicates and sort by length (prefer longer, more specific terms)
  const unique = [...new Set(variations)];
  return unique.sort((a, b) => b.length - a.length);
}

// Enhanced search function with typo tolerance
export async function searchMoviesAndTV(query: string): Promise<TMDBItem[]> {
  if (!query || query.length < 2) return [];

  // Temporary interface for internal use with relevance scoring
  interface SearchResult extends TMDBItem {
    searchRelevance?: number;
  }

  let allResults: SearchResult[] = [];
  const seenIds = new Set<string>();

  try {
    // First, try exact search
    const exactData = await tmdb<TMDBResponse<TMDBItem>>("/search/multi", {
      query,
      page: 1,
      include_adult: false,
    });

    const exactResults = exactData.results.filter(
      (i) => i.media_type === "movie" || i.media_type === "tv"
    );

    // Add exact results first
    exactResults.forEach((item) => {
      const id = `${item.media_type}-${item.id}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        allResults.push({ ...item, searchRelevance: 100 }); // Highest relevance for exact matches
      }
    });

    // Always try variations for better typo tolerance
    const searchVariations = generateSearchVariations(query);

    // Debug: log the variations being tried
    console.log(
      `Search variations for "${query}":`,
      searchVariations.slice(0, 10)
    );

    // Limit variations to prevent too many API calls but increase the limit for better results
    const limitedVariations = searchVariations.slice(0, 12);

    for (const variation of limitedVariations) {
      if (variation === query.toLowerCase()) continue; // Skip original query
      if (variation.length < 3) continue; // Skip very short variations

      try {
        const variationData = await tmdb<TMDBResponse<TMDBItem>>(
          "/search/multi",
          {
            query: variation,
            page: 1,
            include_adult: false,
          }
        );

        const variationResults = variationData.results.filter(
          (i) => i.media_type === "movie" || i.media_type === "tv"
        );

        // Add new results with lower relevance score
        const relevanceScore = variation.length === query.length ? 80 : 60; // Prefer same-length variations

        variationResults.forEach((item) => {
          const id = `${item.media_type}-${item.id}`;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            allResults.push({ ...item, searchRelevance: relevanceScore });
          }
        });

        // Continue even if we have results to get more comprehensive results
        if (allResults.length >= 30) break;
      } catch (err) {
        console.warn(`Search variation "${variation}" failed:`, err);
        continue;
      }
    }

    // Sort by relevance first, then by popularity
    allResults.sort((a, b) => {
      const relevanceDiff = (b.searchRelevance || 0) - (a.searchRelevance || 0);
      if (relevanceDiff !== 0) return relevanceDiff;
      return (b.popularity || 0) - (a.popularity || 0);
    });

    console.log(`Found ${allResults.length} total results for "${query}"`);

    // Remove the searchRelevance property before returning
    return allResults.map(({ searchRelevance, ...item }) => item as TMDBItem);
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
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

export async function getSeasonDetails(tvId: number, seasonNumber: number) {
  try {
    const season = await tmdb<SeasonDetail>(
      `/tv/${tvId}/season/${seasonNumber}`,
      {
        append_to_response: "videos",
      }
    );

    return season;
  } catch (err) {
    console.error("getSeasonDetails error:", err);
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
