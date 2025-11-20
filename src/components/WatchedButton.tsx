"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWatched } from "@/hooks/useWatched";
import { useAuth } from "@/components/AuthProvider";

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
  const { session } = useAuth();
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
      className={`group inline-flex h-12 items-center justify-center gap-2 border px-6 text-sm font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-60
        ${watched
          ? "border-accent bg-accent text-black hover:bg-accent/90"
          : "border-white/20 bg-black/50 text-white backdrop-blur-sm hover:border-accent hover:bg-accent hover:text-black"
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {watched ? "Removing..." : "Marking..."}
        </>
      ) : watched ? (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
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
            className="h-4 w-4"
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
          Mark Watched
        </>
      )}
    </button>
  );
}
