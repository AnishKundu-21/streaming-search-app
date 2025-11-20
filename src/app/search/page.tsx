import { searchContent } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";


export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery ?? "";
  const normalizedQuery = query.trim();
  const hasQuery = normalizedQuery.length > 0;

  const results = hasQuery ? await searchContent(normalizedQuery) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-screen-2xl px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen-xl border border-white/10 bg-black p-8 text-center sm:p-16">
            <p className="text-sm font-bold uppercase tracking-[0.5em] text-accent animate-fade-in">
              StreamFinder
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-7xl md:text-8xl animate-fade-up">
              Search the <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Archive</span>
            </h1>
            <p className="mt-6 text-lg font-medium tracking-wide text-white/60 sm:text-xl animate-fade-up animation-delay-100">
              Find films, series, and creators across every streaming service.
            </p>

            <form
              className="mx-auto mt-12 max-w-3xl animate-fade-up animation-delay-200"
              action="/search"
              method="GET"
              role="search"
            >
              <div className="group relative flex items-center overflow-hidden border-2 border-white/20 bg-white/5 transition-all duration-300 focus-within:border-accent hover:border-white/40">
                <input
                  type="text"
                  name="q"
                  defaultValue={normalizedQuery}
                  placeholder="SEARCH TITLES, GENRES, OR PEOPLE..."
                  className="h-16 w-full bg-transparent px-6 pr-32 font-sans text-lg font-bold uppercase tracking-wider text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full bg-white px-8 font-display text-xl font-bold uppercase italic tracking-widest text-black transition-transform duration-300 hover:bg-accent hover:text-white"
                >
                  GO
                </button>
              </div>
            </form>

            {!hasQuery && (
              <div className="mt-12 text-xs font-bold uppercase tracking-widest text-white/40 animate-fade-in animation-delay-300">
                Start typing to see instant results from movies and television.
              </div>
            )}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          {hasQuery ? (
            <div className="mx-auto max-w-screen-2xl border-t border-white/10 pt-12">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
                <div>
                  <h2 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white">
                    Results for <span className="text-accent">{normalizedQuery}</span>
                  </h2>
                  <div className="mt-2 h-1 w-24 bg-accent" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/60">
                    Found {results.length} titles
                  </p>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {results.map((item, index) => (
                    <Link
                      href={`/${item.media_type}/${item.id}`}
                      key={`${item.media_type}-${item.id}`}
                      className="group/item relative flex flex-col animate-fade-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative aspect-[2/3] overflow-hidden border-2 border-transparent transition-all duration-300 group-hover/item:border-accent group-hover/item:shadow-[0_0_20px_rgba(255,0,85,0.4)]">
                        {item.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title || item.name || "Poster"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/item:scale-110 group-hover/item:contrast-125"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40">
                            No Artwork
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                        <span className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                          {item.media_type === "movie" ? "Film" : "Series"}
                        </span>
                      </div>
                      <h3 className="mt-4 truncate font-display text-xl font-bold uppercase text-white transition-colors group-hover/item:text-accent">
                        {item.title || item.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border border-white/10 bg-white/5 p-12 text-center">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/60">
                    No results matched &ldquo;{normalizedQuery}&rdquo;.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
