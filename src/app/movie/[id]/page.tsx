import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";
import ProviderSection from "@/components/ProviderSection";
import TrailerButton from "@/components/TrailerButton";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // await params per Next.js 15
  const movieId = Number(id);
  const data = await getMovieDetails(movieId);

  if (!data) {
    return (
      <div className="text-center p-8 min-h-screen bg-main text-foreground">
        <h1 className="text-2xl font-bold">Movie not found.</h1>
      </div>
    );
  }

  const { details, providers, credits } = data;
  const releaseDate = details.release_date
    ? new Date(details.release_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const runtimeHours = details.runtime ? Math.floor(details.runtime / 60) : 0;
  const runtimeMinutes = details.runtime ? details.runtime % 60 : 0;

  return (
    <div className="min-h-screen bg-main text-foreground">
      {details.backdrop_path && (
        <div className="relative h-72 w-full md:h-[420px]">
          <Image
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={`${details.title} backdrop`}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
        </div>
      )}

      <div className="relative -mt-24 md:-mt-36">
        <div className="mx-auto max-w-screen-xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-soft backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                <span>Film Overview</span>
                {releaseDate && <span>Premiered {releaseDate}</span>}
              </div>

              <div className="grid gap-8 md:grid-cols-[220px,1fr]">
                <div className="relative mx-auto w-48 overflow-hidden rounded-3xl border border-border bg-surface-elevated shadow-soft md:mx-0">
                  {details.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                      alt={`${details.title} poster`}
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
                      {details.title}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                      {details.title}
                      {details.release_date && (
                        <span className="ml-2 text-2xl font-light text-muted-foreground">
                          ({new Date(details.release_date).getFullYear()})
                        </span>
                      )}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>
                      {details.genres.map((g: any) => g.name).join(", ")}
                    </span>
                    {details.runtime ? (
                      <>
                        <span className="h-3 w-[1px] bg-border" />
                        <span>
                          {runtimeHours > 0 ? `${runtimeHours}h ` : ""}
                          {runtimeMinutes}m
                        </span>
                      </>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 text-base text-foreground">
                      <span className="font-semibold text-accent">TMDB</span>
                      <span>{details.vote_average.toFixed(1)} / 10</span>
                    </div>
                    {details.external_ids?.imdb_id && (
                      <Link
                        href={`https://www.imdb.com/title/${details.external_ids.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                      >
                        IMDb
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" />
                          <path d="M8.603 14.53a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.665l-3 3z" />
                        </svg>
                      </Link>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground sm:text-base">
                    {details.overview || "Synopsis not provided."}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <TrailerButton videos={details.videos} />
                    <WatchlistButton
                      contentId={movieId}
                      mediaType="movie"
                      title={details.title ?? ""}
                      posterPath={details.poster_path}
                    />
                    <WatchedButton
                      contentId={movieId}
                      mediaType="movie"
                      title={details.title ?? ""}
                      posterPath={details.poster_path}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
