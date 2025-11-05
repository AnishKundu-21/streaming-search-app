import Image from "next/image";

interface ResultsCardProps {
  title: string;
  country: string;
  availability: any;
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
    <div className="group overflow-hidden rounded-3xl border border-white/20 bg-white/5 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_68px_rgba(4,0,24,0.6)]">
      {posterPath ? (
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={`${title} poster`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/60" />
          <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white backdrop-blur">
            {country}
          </span>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center bg-white/5 text-sm font-semibold uppercase tracking-wide text-white/60">
          No artwork available
        </div>
      )}
      <div className="space-y-4 p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">
            {title}
          </h2>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.45em] text-white/50">
            Availability in {country}
          </p>
        </div>
        {overview && (
          <p className="text-sm leading-relaxed text-white/75 line-clamp-3">
            {overview}
          </p>
        )}
        <div className="space-y-3 text-sm text-white">
          {availability.note ? (
            <p className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">
              {availability.note}
            </p>
          ) : availability.flatrate ? (
            <div className="flex flex-wrap gap-3">
              {availability.flatrate.map((p: any) => (
                <div
                  key={p.provider_id}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5"
                >
                  {p.logo_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                    {p.provider_name}
                  </span>
                </div>
              ))}
            </div>
          ) : availability.buy ? (
            <p className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">
              Buy on:{" "}
              {availability.buy.map((p: any) => p.provider_name).join(", ")}
            </p>
          ) : availability.rent ? (
            <p className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">
              Rent on:{" "}
              {availability.rent.map((p: any) => p.provider_name).join(", ")}
            </p>
          ) : (
            <p className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/60">
              No availability found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
