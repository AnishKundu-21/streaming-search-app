import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";
import WatchlistButton from "@/components/WatchlistButton";
import WatchedButton from "@/components/WatchedButton";

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
      <div className="text-center p-8 min-h-screen bg-white dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Movie not found.
        </h1>
      </div>
    );
  }

  const { details, providers, credits } = data;
  const IN_providers = providers.IN ?? {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={`${details.title} backdrop`}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-900 dark:via-transparent" />
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="md:flex md:space-x-8">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            {details.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={`${details.title} poster`}
                width={500}
                height={750}
                className="rounded-lg shadow-xl"
              />
            )}
          </div>

          {/* Details */}
          <div className="mt-6 md:mt-0 text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold flex items-center justify-center md:justify-start flex-wrap gap-4">
              {details.title}
              {details.release_date && (
                <span className="font-light text-gray-500">
                  ({new Date(details.release_date).getFullYear()})
                </span>
              )}
            </h1>

            {/* Action buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {details.genres.map((g: any) => g.name).join(", ")} •{" "}
              {details.runtime && (
                <>
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </>
              )}
            </p>

            <p className="mt-6 text-lg">{details.overview}</p>
          </div>
        </div>

        {/* Streaming providers */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Where to Watch in India
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            {IN_providers.flatrate || IN_providers.buy || IN_providers.rent ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {IN_providers.flatrate?.map((p: any) => (
                  <div
                    key={p.provider_id}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      width={50}
                      height={50}
                      className="rounded-md mb-2"
                    />
                    <span className="text-sm">Stream</span>
                  </div>
                ))}
                {IN_providers.buy?.map((p: any) => (
                  <div
                    key={p.provider_id}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      width={50}
                      height={50}
                      className="rounded-md mb-2"
                    />
                    <span className="text-sm">Buy</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Not currently available for streaming in India.</p>
            )}
          </div>
        </section>

        {/* Cast */}
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
                    <div className="bg-gray-300 dark:bg-gray-700 h-full flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm">{person.name}</p>
                <p className="text-xs text-gray-500">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
