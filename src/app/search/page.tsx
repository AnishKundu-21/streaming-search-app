import { searchContent } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rawQuery = searchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery ?? "";
  const normalizedQuery = query.trim();
  const hasQuery = normalizedQuery.length > 0;

  const results = hasQuery ? await searchContent(normalizedQuery) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-soft sm:px-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-muted-foreground">
            StreamFinder
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Search the entire library.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground sm:text-xl">
            Find films, series, and creators across every streaming service.
          </p>

          <form
            className="mx-auto mt-10 max-w-3xl"
            action="/search"
            method="GET"
            role="search"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={normalizedQuery}
                placeholder="Search titles, genres, or people"
                className="h-14 flex-1 rounded-full border border-white/10 bg-black/70 px-6 text-base text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="h-14 rounded-full bg-accent px-10 text-base font-semibold text-white transition hover:bg-accent-soft"
              >
                Search
              </button>
            </div>
          </form>

          {!hasQuery && (
            <div className="mt-10 text-sm text-muted-foreground">
              Start typing to see instant results from movies and television.
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        {hasQuery ? (
          <div className="mx-auto max-w-screen-2xl rounded-3xl border border-white/10 bg-card p-8 shadow-soft sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-white">
                  Results for{" "}
                  <span className="text-accent-soft">{normalizedQuery}</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Showing {results.length} titles across movies and television.
                </p>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {results.map((item, index) => (
                  <Link
                    href={`/${item.media_type}/${item.id}`}
                    key={`${item.media_type}-${item.id}`}
                    className="group/item relative flex flex-col animate-fade-up"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-soft transition-transform duration-500 group-hover/item:-translate-y-1 group-hover/item:shadow-lg">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name || "Poster"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          No Artwork
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 transition duration-500 group-hover/item:opacity-100" />
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
                        {item.media_type === "movie" ? "Film" : "Series"}
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover/item:text-accent-soft">
                      {item.title || item.name}
                    </h3>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-white/20 bg-white/5 p-10 text-center backdrop-blur">
                <p className="text-sm text-muted-foreground">
                  No results matched "{normalizedQuery}". Try refining your
                  keywords or explore the curated rows on the homepage.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
