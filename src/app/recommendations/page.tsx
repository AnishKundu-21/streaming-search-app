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
    <div className="flex flex-col gap-10">
      <section className="rounded-3xl border border-white/10 bg-card p-8 shadow-soft sm:p-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-white sm:text-4xl">
              Discover new titles
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a media type and genre to explore curated picks, refreshed
              every visit.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {["movie", "tv"].map((type) => (
            <button
              key={type}
              onClick={() => setMediaType(type as "movie" | "tv")}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                mediaType === type
                  ? "border-transparent bg-accent text-white shadow-[0_18px_36px_rgba(181,98,255,0.45)]"
                  : "border-white/20 bg-white/5 text-white/70 hover:text-white"
              }`}
            >
              {type === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {isGenresLoading
            ? [...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-28 animate-pulse rounded-full border border-white/20 bg-white/5"
                />
              ))
            : genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
                    selectedGenre?.id === genre.id
                      ? "border-transparent bg-accent text-white shadow-[0_18px_36px_rgba(181,98,255,0.45)]"
                      : "border-white/20 bg-white/5 text-white/70 hover:text-white"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
        </div>

        <div className="mt-10 min-h-[200px]">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[...Array(12)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-[2/3] animate-pulse rounded-2xl border border-white/20 bg-white/5"
                />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results.map((item, index) => (
                <Link
                  href={`/${mediaType}/${item.id}`}
                  key={item.id}
                  className="group/item relative flex flex-col animate-fade-up"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-soft transition-transform duration-500 group-hover/item:-translate-y-1 group-hover/item:shadow-lg">
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title || item.name || "Poster"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        No Artwork
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 transition duration-500 group-hover/item:opacity-100" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
                      {mediaType === "movie" ? "Film" : "Series"}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover/item:text-accent-soft">
                    {item.title || item.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : selectedGenre ? (
            <div className="rounded-2xl border border-white/20 bg-white/5 p-10 text-center backdrop-blur">
              <p className="text-sm text-muted-foreground">
                No results found for {selectedGenre.name}. Try another genre or
                switch media type.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/20 bg-white/5 p-10 text-center backdrop-blur">
              <p className="text-sm text-muted-foreground">
                Select a genre to generate curated recommendations.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
