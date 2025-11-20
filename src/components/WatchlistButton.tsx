"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/components/AuthProvider";

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
  const { session } = useAuth();
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
      className={`group inline-flex h-12 items-center justify-center gap-2 border px-6 text-sm font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-60
        ${inWatchlist
          ? "border-accent bg-accent text-black hover:bg-accent/90"
          : "border-white/20 bg-black/50 text-white backdrop-blur-sm hover:border-accent hover:bg-accent hover:text-black"
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {inWatchlist ? "Removing..." : "Adding..."}
        </>
      ) : (
        <>
          {inWatchlist ? (
            <>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  clipRule="evenodd"
                />
              </svg>
              In Watchlist
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
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
