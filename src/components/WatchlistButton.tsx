"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWatchlist } from "@/hooks/useWatchlist";

interface WatchlistButtonProps {
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  seasonNumber?: number; // Add seasonNumber prop
}

export default function WatchlistButton({
  contentId,
  mediaType,
  title,
  posterPath,
  seasonNumber,
}: WatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isInWatchlist, addItem, removeItem } = useWatchlist();
  const [isLoading, setIsLoading] = useState(false);

  const inWatchlist = isInWatchlist(contentId, mediaType, seasonNumber);

  const handleClick = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      if (inWatchlist) {
        await removeItem(contentId, mediaType, seasonNumber);
      } else {
        await addItem({
          contentId,
          mediaType,
          title,
          posterPath,
          seasonNumber,
        });
      }
    } catch (error) {
      console.error("Watchlist action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
        ${
          inWatchlist
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
        flex items-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {inWatchlist ? "Removing..." : "Adding..."}
        </>
      ) : (
        <>
          {inWatchlist ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  clipRule="evenodd"
                />
              </svg>
              Remove from Watchlist
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add to Watchlist
            </>
          )}
        </>
      )}
    </button>
  );
}
