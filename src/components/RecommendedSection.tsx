"use client";

import { useSession } from "next-auth/react";
import { useRecommendations } from "@/hooks/useRecommendations";
import RecommendedRow from "./RecommendedRow"; // The component we just renamed

export default function RecommendedSection() {
  const { data: session } = useSession();
  const { recommendedMovies, recommendedTvShows, isLoading, isError } =
    useRecommendations();

  // Don't show recommendations if user is not signed in
  if (!session) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[180px] animate-pulse"
            >
              <div className="bg-gray-300 dark:bg-gray-700 aspect-[2/3] rounded-lg mb-2" />
              <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded mb-1" />
              <div className="bg-gray-300 dark:bg-gray-700 h-3 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load recommendations. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // No recommendations available
  if (recommendedMovies.length === 0 && recommendedTvShows.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No recommendations yet!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mark some movies or TV shows as &quot;Already Watched&quot; to get
            personalized recommendations.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <RecommendedRow title="Recommended Movies" items={recommendedMovies} />
      <RecommendedRow title="Recommended TV Shows" items={recommendedTvShows} />
    </>
  );
}
