import Image from "next/image";
import Link from "next/link";

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  type: "movie" | "tv";
}

export default function ContentRow({ title, items, type }: ContentRowProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        {title}
      </h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item) => (
            <Link
              href={`/${type}/${item.id}`}
              key={item.id}
              className="block flex-shrink-0 w-40 group"
            >
              <div className="relative h-60 rounded-md overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name || "Poster"}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
                    <span className="text-sm text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <h3 className="mt-2 text-sm text-center text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400">
                {item.title || item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
