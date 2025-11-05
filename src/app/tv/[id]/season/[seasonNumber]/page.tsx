import Image from "next/image";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import TrailerButton from "@/components/TrailerButton";
import SeasonEpisodesList from "@/components/SeasonEpisodesList";
import SeasonTracker from "@/components/SeasonTracker";
import ProviderSection from "@/components/ProviderSection";
import { getSeasonDetails, getTVDetails } from "@/lib/tmdb";

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
      <div className="flex min-h-screen items-center justify-center bg-main text-foreground">
        <p className="text-sm text-muted-foreground">Invalid season request.</p>
      </div>
    );
  }

  const [showData, seasonData] = await Promise.all([
    getTVDetails(tvId),
    getSeasonDetails(tvId, seasonIndex),
  ]);

  if (!showData || !seasonData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-main text-foreground">
        <p className="text-sm text-muted-foreground">
          We couldn't load that season right now. Please try again later.
        </p>
      </div>
    );
  }

  const { details: showDetails, providers, credits } = showData;
  const heroBackdrop =
    seasonData.poster_path ||
    showDetails.backdrop_path ||
    showDetails.poster_path;
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
    <div className="min-h-screen bg-main text-foreground">
      {heroBackdrop && (
        <div className="relative h-72 w-full md:h-[420px]">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroBackdrop}`}
            alt={`${showDetails.name} season art`}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
        </div>
      )}

      <div className="relative -mt-24 md:-mt-36">
        <div className="mx-auto max-w-screen-xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-soft backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Link
                  href={`/tv/${tvId}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground transition hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13.78 4.22a.75.75 0 010 1.06L9.31 9.75l4.47 4.47a.75.75 0 11-1.06 1.06l-5-5a.75.75 0 010-1.06l5-5a.75.75 0 011.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back to {showDetails.name}
                </Link>
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                  <span>Season {seasonData.season_number} Overview</span>
                  {premiereDate && <span>Premiered {premiereDate}</span>}
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-[220px,1fr]">
                <div className="relative mx-auto w-48 overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-soft md:mx-0">
                  {seasonData.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${seasonData.poster_path}`}
                      alt={`${seasonData.name} poster`}
                      width={500}
                      height={750}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      No Poster
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.34em] text-accent">
                      {showDetails.name}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                      {seasonData.name || `Season ${seasonData.season_number}`}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {premiereDate && <span>Premieres {premiereDate}</span>}
                    {totalEpisodes > 0 && (
                      <span>
                        {totalEpisodes} Episode{totalEpisodes === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground sm:text-base">
                    {synopsis}
                  </p>

                  <div className="flex flex-wrap gap-3">
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
          </div>

          <SeasonTracker
            tvId={tvId}
            tvTitle={showDetails.name ?? "TV Show"}
            seasons={showDetails.seasons}
          />

          <section className="mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Episodes</h2>
                <p className="text-sm text-muted-foreground">
                  Dive into individual episode synopses for{" "}
                  {seasonData.name || `Season ${seasonData.season_number}`}.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <SeasonEpisodesList episodes={seasonData.episodes ?? []} />
            </div>
          </section>

          <ProviderSection providers={providers} />

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Cast</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {credits.cast.slice(0, 15).map((person: any) => (
                <div
                  key={person.credit_id}
                  className="text-center flex-shrink-0 w-32"
                >
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-card h-full flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
