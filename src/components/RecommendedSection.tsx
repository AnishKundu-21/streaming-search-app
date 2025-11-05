"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import RecommendedRow from "./RecommendedRow"; // The component we just renamed
import { useAuth } from "@/components/AuthProvider";

export default function RecommendedSection() {
  const { session } = useAuth();
  const { recommendedMovies, recommendedTvShows, isLoading, isError } =
    useRecommendations();

  // Don't show recommendations if user is not signed in
  if (!session) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-card p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white">
            Recommended for You
          </h2>
          <span className="pill">Loading tailored picks…</span>
        </div>
        <div className="mt-6 flex gap-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[140px] animate-pulse rounded-2xl border border-white/5 bg-surface-muted p-3"
            >
              <div className="aspect-[2/3] rounded-xl bg-white/10" />
              <div className="mt-3 h-3 rounded-full bg-white/10" />
              <div className="mt-2 h-3 w-2/3 rounded-full bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="rounded-3xl border border-white/10 bg-card p-10 text-center shadow-soft">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white">
          Recommended for You
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Unable to load your personalized recommendations right now. Please try
          again soon.
        </p>
      </section>
    );
  }

  // No recommendations available
  if (recommendedMovies.length === 0 && recommendedTvShows.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-card p-10 text-center shadow-soft">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white">
          Your queue is warming up
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Mark a few movies or series as already watched to unlock bespoke
          recommendations.
        </p>
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
