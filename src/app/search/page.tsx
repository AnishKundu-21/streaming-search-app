import { searchContent } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";

  if (!query) {
    return (
      <div className="text-center p-8 min-h-screen bg-main text-foreground">
        <h1 className="text-2xl font-bold">Please enter a search term.</h1>
      </div>
    );
  }

  const allResults = await searchContent(query);

  return (
    <div className="min-h-screen bg-main text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Search results for: <span className="text-accent">{query}</span>
        </h1>
        {allResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {allResults.map((item) => (
              <Link
                href={`/${item.media_type}/${item.id}`}
                key={`${item.media_type}-${item.id}`}
                className="block group"
              >
                <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name || "Poster"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="bg-card h-full flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        No Image
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-medium text-center text-muted-foreground truncate group-hover:text-accent">
                  {item.title || item.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-lg text-center mt-12 text-muted-foreground">
            No results found for "{query}".
          </p>
        )}
      </div>
    </div>
  );
}
