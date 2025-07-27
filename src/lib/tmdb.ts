/**
 * Tiny wrapper around the TMDB REST API
 * – Includes one-hour response caching via Next.js fetch
 * – Exposes helpers used across the app (search, details, trending, etc.)
 */

const API_KEY = process.env.TMDB_API_KEY!;
const BASE = "https://api.themoviedb.org/3";

/* ----------------------------------------------------------
   Shared fetch helper
   ---------------------------------------------------------- */
const defaultFetchOpts = { next: { revalidate: 60 * 60 } }; // 1-hour ISR cache

function tmdb<T = any>(
  path: string,
  qs: Record<string, string | number> = {}
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
   Generic search (movies + TV)
   ---------------------------------------------------------- */
export async function searchMoviesAndTV(query: string) {
  const data = await tmdb<{ results: any[] }>("/search/multi", {
    query,
    page: 1,
  });
  return data.results.filter(
    (i) => i.media_type === "movie" || i.media_type === "tv"
  );
}

/* ----------------------------------------------------------
   Individual details helpers
   ---------------------------------------------------------- */
export async function getMovieDetails(id: number) {
  try {
    const [details, providers, credits] = await Promise.all([
      tmdb(`/movie/${id}`),
      tmdb(`/movie/${id}/watch/providers`),
      tmdb(`/movie/${id}/credits`),
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
      tmdb(`/tv/${id}`),
      tmdb(`/tv/${id}/watch/providers`),
      tmdb(`/tv/${id}/credits`),
    ]);

    return { details, providers: providers.results ?? {}, credits };
  } catch (err) {
    console.error("getTVDetails error:", err);
    return null;
  }
}

/* ----------------------------------------------------------
   Browsing helpers used on the Home page
   ---------------------------------------------------------- */
export async function getTrending(
  media: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
) {
  const data = await tmdb<{ results: any[] }>(
    `/trending/${media}/${timeWindow}`
  );
  return data.results;
}

export async function getTopRated(media: "movie" | "tv") {
  const data = await tmdb<{ results: any[] }>(`/${media}/top_rated`);
  return data.results;
}

export async function getUpcoming() {
  const data = await tmdb<{ results: any[] }>("/movie/upcoming");
  return data.results;
}

export async function getNowPlaying() {
  const data = await tmdb<{ results: any[] }>("/movie/now_playing");
  return data.results;
}
