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
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60
        ${
          inWatchlist
            ? "border border-accent/40 bg-accent/15 text-accent hover:bg-accent/25"
            : "bg-accent text-white hover:bg-accent-soft"
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
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
