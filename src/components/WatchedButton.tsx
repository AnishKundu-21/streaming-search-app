"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWatched } from "@/hooks/useWatched";

interface WatchedButtonProps {
  contentId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string | null;
  seasonNumber?: number; // Add seasonNumber prop
}

export default function WatchedButton({
  contentId,
  mediaType,
  title,
  posterPath,
  seasonNumber,
}: WatchedButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isWatched, addItem, removeItem } = useWatched();
  const [isLoading, setIsLoading] = useState(false);

  const watched = isWatched(contentId, mediaType, seasonNumber);

  const handleClick = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      if (watched) {
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
    } catch (err) {
      console.error("Watched action failed:", err);
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
          watched
            ? "border border-accent/40 bg-accent/15 text-accent hover:bg-accent/25"
            : "bg-accent text-white hover:bg-accent-soft"
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
          {watched ? "Removing..." : "Marking..."}
        </>
      ) : watched ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              clipRule="evenodd"
            />
          </svg>
          Watched
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Mark as Watched
        </>
      )}
    </button>
  );
}
