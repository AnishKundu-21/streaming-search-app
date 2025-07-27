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
}

export default function WatchedButton({
  contentId,
  mediaType,
  title,
  posterPath,
}: WatchedButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { isWatched, addItem, removeItem } = useWatched();
  const [isLoading, setIsLoading] = useState(false);

  const watched = isWatched(contentId, mediaType);

  const handleClick = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      if (watched) {
        await removeItem(contentId, mediaType);
      } else {
        await addItem({ contentId, mediaType, title, posterPath });
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
      className={`
        px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
        ${
          watched
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-600 hover:bg-gray-700 text-white"
        }
        ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
        flex items-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
