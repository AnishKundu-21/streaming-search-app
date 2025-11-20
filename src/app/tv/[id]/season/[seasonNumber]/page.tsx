import Image from "next/image";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import TrailerButton from "@/components/TrailerButton";
import SeasonEpisodesList from "@/components/SeasonEpisodesList";
import SeasonTracker from "@/components/SeasonTracker";
import ProviderSection from "@/components/ProviderSection";
import { getSeasonDetails, getTVDetails } from "@/lib/tmdb";
import CastCarousel from "@/components/CastCarousel";
import ExpandableText from "@/components/ExpandableText";

export default async function SeasonDetailPage({
  params,
}: {
  params: Promise<{ id: string; seasonNumber: string }>;
}) {
  const { id, seasonNumber } = await params;
  const tvId = Number(id);
  const seasonIndex = Number(seasonNumber);

  if (!Number.isFinite(tvId) || !Number.isFinite(seasonIndex)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-white/60">Invalid season request.</p>
      </div>
    );
  }

  const [showData, seasonData] = await Promise.all([
    getTVDetails(tvId),
    getSeasonDetails(tvId, seasonIndex),
  ]);

  if (!showData || !seasonData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm font-bold uppercase tracking-widest text-white/60">
          We couldn&apos;t load that season right now. Please try again later.
        </p>
      </div>
    );
  }

  const { details: showDetails, providers, credits } = showData;
  const heroBackdrop =
    showDetails.backdrop_path ||
    showDetails.poster_path ||
    seasonData.poster_path;
  const premiereDate = seasonData.air_date
    ? new Date(seasonData.air_date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : null;
  const totalEpisodes = seasonData.episodes?.length ?? 0;
  const synopsis =
    seasonData.overview?.trim() || "Synopsis not provided for this season.";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-black">
      {/* Full Screen Backdrop */}
      <div className="relative flex min-h-[85vh] w-full flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBackdrop ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${heroBackdrop}`}
              alt={`${showDetails.name} season art`}
              fill
              className="object-cover object-top opacity-60"
              priority
            />
          ) : (
            <div className="h-full w-full bg-zinc-900" />
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Spacer to push content down but keep it anchored from top */}
        <div className="h-[15vh] w-full flex-shrink-0" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full p-6 sm:p-12 md:p-16 lg:w-2/3">
          {/* Breadcrumb / Back Link */}
          <Link
            href={`/tv/${tvId}`}
            className="group mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <path
                fillRule="evenodd"
                d="M13.78 4.22a.75.75 0 010 1.06L9.31 9.75l4.47 4.47a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to {showDetails.name}
          </Link>

          <div className="animate-fade-up space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent backdrop-blur-md">
                Season {seasonData.season_number}
              </span>
              {premiereDate && (
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {premiereDate}
                </span>
              )}
              {totalEpisodes > 0 && (
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {totalEpisodes} Episode{totalEpisodes === 1 ? "" : "s"}
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl font-black uppercase italic tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
              {seasonData.name || `Season ${seasonData.season_number}`}
            </h1>

            <p className="text-lg font-bold uppercase tracking-widest text-accent sm:text-xl">
              {showDetails.name}
            </p>

            <ExpandableText
              text={synopsis}
              className="max-w-2xl text-lg font-medium leading-relaxed text-white/80 md:text-xl"
            />

            <div className="flex flex-wrap gap-4 pt-4">
              <TrailerButton
                videos={seasonData.videos ?? { results: [] }}
              />
              <WatchlistButton
                contentId={tvId}
                mediaType="tv"
                title={`${showDetails.name} - ${seasonData.name}`}
                posterPath={
                  seasonData.poster_path ?? showDetails.poster_path
                }
                seasonNumber={seasonData.season_number}
              />
              <WatchedButton
                contentId={tvId}
                mediaType="tv"
                title={`${showDetails.name} - ${seasonData.name}`}
                posterPath={
                  seasonData.poster_path ?? showDetails.poster_path
                }
                seasonNumber={seasonData.season_number}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 mx-auto max-w-screen-2xl space-y-24 px-4 py-16 sm:px-6 lg:px-8">
        <section className="animate-fade-up animation-delay-200">
          <div className="mb-8 border-b border-white/10 pb-4">
            <h2 className="font-display text-3xl font-bold uppercase italic tracking-wider text-white">
              Episodes
            </h2>
          </div>
          <SeasonEpisodesList episodes={seasonData.episodes ?? []} />
        </section>

        <SeasonTracker
          tvId={tvId}
          tvTitle={showDetails.name ?? "TV Show"}
          seasons={showDetails.seasons}
        />

        <ProviderSection
          providers={providers}
          title={showDetails.name ?? "This series"}
          mediaType="tv"
          tmdbId={tvId}
        />

        <CastCarousel
          cast={credits.cast.slice(0, 15)}
          description="Series regulars appearing this season."
        />
      </div>
    </div>
  );
}
