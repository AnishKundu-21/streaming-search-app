"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Genre {
  id: number;
  name: string;
}

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
}

export default function RecommendationsPage() {
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [results, setResults] = useState<TMDBItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenresLoading, setIsGenresLoading] = useState(true);

  // Fetch genres when the media type changes
  useEffect(() => {
    const fetchGenres = async () => {
      setIsGenresLoading(true);
      const res = await fetch(`/api/genres?mediaType=${mediaType}`);
      if (res.ok) {
        const data = await res.json();
        setGenres(data);
      }
      setIsGenresLoading(false);
    };
    fetchGenres();
    // Reset selections when media type changes
    setSelectedGenre(null);
    setResults([]);
  }, [mediaType]);

  // Fetch content when a genre is selected
  const handleGenreClick = async (genre: Genre) => {
    setSelectedGenre(genre);
    setIsLoading(true);
    setResults([]); // Clear previous results immediately
    const res = await fetch(
      `/api/discover?mediaType=${mediaType}&genreId=${genre.id}`
    );
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Discover New Titles
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Select a media type and genre to get recommendations.
        </p>

        {/* Media Type Toggle */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setMediaType("movie")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              mediaType === "movie"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType("tv")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              mediaType === "tv"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            TV Shows
          </button>
        </div>

        {/* Genre List */}
        <div className="flex flex-wrap gap-2 mb-8">
          {isGenresLoading
            ? // Genre loading skeleton
              [...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"
                />
              ))
            : genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedGenre?.id === genre.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
        </div>

        {/* Results Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {results.map((item) => (
                <Link
                  href={`/${mediaType}/${item.id}`}
                  key={item.id}
                  className="block group"
                >
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title || item.name || "Poster"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400">
                    {item.title || item.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : selectedGenre ? (
            <p className="text-center mt-8 text-gray-500">
              No results found for {selectedGenre.name}.
            </p>
          ) : (
            <p className="text-center mt-8 text-gray-500">
              Please select a genre to begin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
