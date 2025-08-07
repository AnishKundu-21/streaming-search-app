import Image from "next/image";

interface ResultsCardProps {
  title: string;
  country: string;
  availability: any;
  posterPath?: string;
  overview?: string; // For excerpt display
}

export default function ResultsCard({
  title,
  country,
  availability,
  posterPath,
  overview,
}: ResultsCardProps) {
  return (
    <div className="bg-card rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-border">
      {posterPath && (
        <div className="relative h-64">
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={`${title} poster`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-foreground">
          {title} in {country}
        </h2>
        {overview && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{overview}</p>
        )}
        <div className="text-sm text-foreground">
          {availability.note ||
            (availability.flatrate ? (
              <div className="flex flex-wrap gap-2">
                {availability.flatrate.map((p: any) => (
                  <div key={p.provider_id} className="flex items-center">
                    {p.logo_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                        alt={p.provider_name}
                        width={24}
                        height={24}
                        className="mr-1 rounded group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                    <span>{p.provider_name}</span>
                  </div>
                ))}
              </div>
            ) : availability.buy ? (
              `Buy on: ${availability.buy
                .map((p: any) => p.provider_name)
                .join(", ")}`
            ) : availability.rent ? (
              `Rent on: ${availability.rent
                .map((p: any) => p.provider_name)
                .join(", ")}`
            ) : (
              "No availability found"
            ))}
        </div>
      </div>
    </div>
  );
}
