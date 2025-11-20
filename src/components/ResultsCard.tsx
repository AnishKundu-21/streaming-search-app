import Image from "next/image";

interface ProviderEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface AvailabilityDetails {
  note?: string;
  link?: string;
  flatrate?: ProviderEntry[];
  buy?: ProviderEntry[];
  rent?: ProviderEntry[];
}

interface ResultsCardProps {
  title: string;
  country: string;
  availability: AvailabilityDetails;
  posterPath?: string;
  overview?: string;
}

export default function ResultsCard({
  title,
  country,
  availability,
  posterPath,
  overview,
}: ResultsCardProps) {
  return (
    <div className="group relative overflow-hidden bg-black border border-white/10 transition-all duration-500 hover:border-accent hover:shadow-[0_0_30px_rgba(255,0,85,0.3)] hover:-translate-y-2">
      {posterPath ? (
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={`${title} poster`}
            fill
            className="object-cover transition duration-700 group-hover:scale-110 group-hover:contrast-125"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60" />


          <span className="absolute right-0 top-4 bg-accent px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
            {country}
          </span>
        </div>
      ) : (
        <div className="flex h-80 items-center justify-center bg-white/5 text-sm font-bold uppercase tracking-widest text-white/40">
          No Visuals
        </div>
      )}

      <div className="relative z-10 -mt-12 p-6 pt-0">
        <h2 className="font-display text-3xl font-bold uppercase leading-none text-white drop-shadow-lg transition-colors group-hover:text-accent">
          {title}
        </h2>

        <div className="mt-4 space-y-4">
          {overview && (
            <p className="line-clamp-3 text-sm font-medium leading-relaxed text-white/70 group-hover:text-white/90">
              {overview}
            </p>
          )}

          <div className="space-y-3">
            {availability.note ? (
              <p className="inline-block border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                {availability.note}
              </p>
            ) : availability.flatrate ? (
              <div className="flex flex-wrap gap-2">
                {availability.flatrate.map((p) => (
                  <div
                    key={p.provider_id}
                    className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
                  >
                    {p.logo_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                        alt={p.provider_name}
                        width={20}
                        height={20}
                        className="rounded-sm"
                      />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      {p.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            ) : availability.buy ? (
              <div className="text-xs font-bold uppercase tracking-wider text-white/60">
                Buy on: <span className="text-white">{availability.buy.map((p) => p.provider_name).join(", ")}</span>
              </div>
            ) : availability.rent ? (
              <div className="text-xs font-bold uppercase tracking-wider text-white/60">
                Rent on: <span className="text-white">{availability.rent.map((p) => p.provider_name).join(", ")}</span>
              </div>
            ) : (
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                Unavailable
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
