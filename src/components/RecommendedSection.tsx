"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import RecommendedRow from "./RecommendedRow"; // The component we just renamed
import { useAuth } from "@/components/AuthProvider";

export default function RecommendedSection() {
  const { session } = useAuth();
  const { recommendations, isLoading, isError } = useRecommendations();

  // Don't show recommendations if user is not signed in
  if (!session) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 sm:py-10 md:py-12">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl md:text-6xl">
              Recommended for You
            </h2>
            <div className="mt-2 h-1 w-24 bg-accent animate-pulse" />
          </div>
          <span className="hidden sm:inline-block border border-accent bg-accent/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent animate-pulse">
            Loading...
          </span>
        </div>
        <div className="mt-10 flex gap-6 overflow-x-auto pb-8 pl-2 pr-4 scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] sm:w-[240px] animate-pulse"
            >
              <div className="aspect-[2/3] bg-white/5 border border-white/10" />
              <div className="mt-4 h-6 w-3/4 bg-white/10" />
              <div className="mt-2 h-3 w-1/2 bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-8 sm:py-10 md:py-12">
        <div className="px-2">
          <h2 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl md:text-6xl">
            Recommended for You
          </h2>
          <div className="mt-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              Unable to load your personalized recommendations right now.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // No recommendations available
  if (!recommendations || recommendations.length === 0) {
    return (
      <section className="py-8 sm:py-10 md:py-12">
        <div className="px-2">
          <h2 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl md:text-6xl">
            Recommended for You
          </h2>
          <div className="mt-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-white/40">
              No recommendations found
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (

    <section className="py-8 sm:py-10 md:py-12">
      <div className="px-2">
        <RecommendedRow title="Recommended for You" items={recommendations} />
      </div>
    </section>
  );
}
