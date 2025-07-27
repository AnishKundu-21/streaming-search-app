"use client";

import { useSession } from "next-auth/react";
import { useWatchlist } from "@/hooks/useWatchlist";
import Image from "next/image";
import Link from "next/link";

export default function WatchlistPage() {
  const { data: session } = useSession();
  const { watchlist, isLoading, isError } = useWatchlist();

  /* ── If user is not signed in ── */
  if (!session) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">
            Sign in to view your watchlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Keep track of movies and TV shows you want to watch.
          </p>
          <Link
            href="/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg mb-2" />
                <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-1" />
                <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Unable to load watchlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            There was an error loading your watchlist. Please try again.
          </p>
        </div>
      </div>
    );
  }

  /* ── Empty watchlist ── */
  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Your watchlist is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start adding movies and TV shows to keep track of what you want to
            watch.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Content
          </Link>
        </div>
      </div>
    );
  }

  /* ── Watchlist with items ── */
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">
          My Watchlist ({watchlist.length} item
          {watchlist.length !== 1 ? "s" : ""})
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="group">
              <Link href={`/${item.mediaType}/${item.contentId}`}>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-gray-800">
                  {item.posterPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Media type indicator */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.mediaType === "movie" ? "Movie" : "TV"}
                  </div>
                </div>
              </Link>

              <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <Link href={`/${item.mediaType}/${item.contentId}`}>
                  {item.title}
                </Link>
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
