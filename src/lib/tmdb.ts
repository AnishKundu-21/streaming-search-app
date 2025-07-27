import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
}

interface ContentResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  overview?: string;
}

export async function getContentList(
  listType: "popular" | "top_rated" | "upcoming" | "now_playing",
  contentType: "movie" | "tv"
): Promise<ContentResult[]> {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/${contentType}/${listType}?api_key=${API_KEY}&language=en-US&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error(`TMDB fetch ${listType} ${contentType} error:`, error);
    throw new Error(`Failed to fetch ${listType} content`);
  }
}

export async function searchContent(
  query: string,
  type: "movie" | "tv" = "movie",
  genre?: string,
  minRating?: string
): Promise<ContentResult[]> {
  try {
    let url = `${TMDB_BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`;
    if (genre) {
      url += `&with_genres=${genre}`;
    }
    if (minRating) {
      url += `&vote_average.gte=${minRating}`;
    }
    const response = await axios.get(url);
    const results = response.data.results;
    if (!results || results.length === 0) {
      return [];
    }
    return results;
  } catch (error) {
    console.error("TMDB search error:", error);
    throw new Error("Failed to search content");
  }
}

export async function getWatchProviders(
  id: number,
  type: "movie" | "tv" = "movie"
) {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error("TMDB providers error:", error);
    throw new Error("Failed to fetch watch providers");
  }
}

export async function getMovieDetails(id: number) {
  try {
    const [detailsResponse, providersResponse, creditsResponse] =
      await Promise.all([
        axios.get(
          `${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`
        ),
        axios.get(
          `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        ),
      ]);

    return {
      details: detailsResponse.data,
      providers: providersResponse.data.results,
      credits: creditsResponse.data,
    };
  } catch (error) {
    console.error(`TMDB fetch movie details for ID ${id} error:`, error);
    return null;
  }
}

// NEW: Function to get all details for a specific TV show
export async function getTvShowDetails(id: number) {
  try {
    const [detailsResponse, providersResponse, creditsResponse] =
      await Promise.all([
        axios.get(
          `${TMDB_BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `${TMDB_BASE_URL}/tv/${id}/watch/providers?api_key=${API_KEY}`
        ),
        axios.get(
          `${TMDB_BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=en-US`
        ),
      ]);

    return {
      details: detailsResponse.data,
      providers: providersResponse.data.results,
      credits: creditsResponse.data,
    };
  } catch (error) {
    console.error(`TMDB fetch TV show details for ID ${id} error:`, error);
    return null;
  }
}
