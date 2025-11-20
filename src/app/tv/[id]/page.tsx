import { getTVDetails } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import ProviderSection from "@/components/ProviderSection";
import SeasonTracker from "@/components/SeasonTracker";
import TrailerButton from "@/components/TrailerButton";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import CastCarousel from "@/components/CastCarousel";
import ExpandableText from "@/components/ExpandableText";

export default async function TVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tvId = Number(id);
  const data = await getTVDetails(tvId);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="font-display text-2xl font-bold uppercase tracking-widest">
          TV show not found
        </h1>
      </div>
    );
  }

  const { details, providers, credits } = data;
  const firstAirYear = details.first_air_date
    ? new Date(details.first_air_date).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full Screen Backdrop */}
      <div className="relative flex min-h-screen sm:min-h-[85vh] w-full flex-col overflow-hidden">
        {details.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={`${details.name} backdrop`}
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


        {/* Spacer to push content down but keep it anchored from top */}
        <div className="h-[15vh] sm:h-[30vh] md:h-[35vh] w-full flex-shrink-0" />

        {/* Content Overlay */}
        <div className="relative z-10 w-full p-4 pb-8 sm:p-8 md:p-12 lg:p-16 lg:w-2/3">
          <div className="animate-fade-up space-y-4 sm:space-y-6">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest text-accent/80">
              {firstAirYear && <span>{firstAirYear}</span>}
              <span className="text-white/20">•</span>
              <span>
                {details.number_of_seasons} Season
                {details.number_of_seasons !== 1 ? "s" : ""}
              </span>
              <span className="text-white/20">•</span>
              <span>{details.number_of_episodes} Episodes</span>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-2">
                <span className="text-white">TMDB</span>
                <span className="text-accent">{details.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              {details.name}
            </h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-3">
              {details.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="border border-white/20 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <ExpandableText
              text={details.overview || "Synopsis not provided."}
              className="max-w-2xl text-lg font-medium leading-relaxed text-white/80 md:text-xl"
            />

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <TrailerButton videos={details.videos} />
              <WatchlistButton
                contentId={tvId}
                mediaType="tv"
                title={details.name ?? ""}
                posterPath={details.poster_path}
              />
              <WatchedButton
                contentId={tvId}
                mediaType="tv"
                title={details.name ?? ""}
                posterPath={details.poster_path}
              />
              {details.external_ids?.imdb_id && (
                <Link
                  href={`https://www.imdb.com/title/${details.external_ids.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 items-center justify-center border border-white/20 bg-black/50 px-6 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-accent hover:bg-accent hover:text-black"
                >
                  IMDb
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 mx-auto max-w-screen-2xl space-y-10 sm:space-y-12 md:space-y-16 px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        {/* Seasons */}
        <SeasonTracker
          tvId={tvId}
          tvTitle={details.name ?? "TV Show"}
          seasons={details.seasons}
        />

        {/* Providers */}
        <ProviderSection
          providers={providers}
          title={details.name ?? "This series"}
          mediaType="tv"
          tmdbId={tvId}
        />

        {/* Cast */}
        <CastCarousel
          cast={credits.cast.slice(0, 15)}
          description="Starring"
        />
      </div>
    </div>
  );
}
