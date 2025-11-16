"use client";

import { useState } from "react";
import Image from "next/image";

// Define the shape of the provider data we expect from the API
interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface ProviderCountry {
  link?: string; // Make link optional to match the API response
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

interface WatchProviders {
  [countryCode: string]: ProviderCountry;
}

// Define the props for our component
interface ProviderSectionProps {
  providers: WatchProviders;
  title: string;
  mediaType: "movie" | "tv";
  tmdbId: number;
}

interface ProviderLinkContext {
  title: string;
  mediaType: "movie" | "tv";
  countryCode: string;
  fallbackLink: string | null;
}

interface BundledProvider {
  name: string;
  logo: string | null;
  types: Set<string>;
  url: string | null;
}

type ProviderLinkBuilder = (ctx: ProviderLinkContext) => string;

const DEFAULT_COUNTRY = "IN";

const normalizeProviderName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const encodeTitle = (title: string) => encodeURIComponent(title.trim());

const providerLinkBuilders: Record<string, ProviderLinkBuilder> = {
  netflix: ({ title }) =>
    `https://www.netflix.com/search?q=${encodeTitle(title)}`,
  netflixbasicwithads: ({ title }) =>
    `https://www.netflix.com/search?q=${encodeTitle(title)}`,
  primevideo: ({ title }) =>
    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeTitle(
      title
    )}`,
  amazonprimevideo: ({ title }) =>
    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeTitle(
      title
    )}`,
  amazonvideo: ({ title }) =>
    `https://www.amazon.com/s?k=${encodeTitle(title)}&i=instant-video`,
  disneyplus: ({ title }) =>
    `https://www.disneyplus.com/search/${encodeTitle(title)}`,
  disneyplushotstar: ({ title }) =>
    `https://www.hotstar.com/in/search?q=${encodeTitle(title)}`,
  hotstar: ({ title }) =>
    `https://www.hotstar.com/in/search?q=${encodeTitle(title)}`,
  jiocinema: ({ title }) =>
    `https://www.jiocinema.com/search/${encodeTitle(title)}`,
  hulu: ({ title }) => `https://www.hulu.com/search?q=${encodeTitle(title)}`,
  max: ({ title }) => `https://play.max.com/search?q=${encodeTitle(title)}`,
  hbomax: ({ title }) => `https://play.max.com/search?q=${encodeTitle(title)}`,
  appltv: ({ title }) =>
    `https://tv.apple.com/search?term=${encodeTitle(title)}`,
  appletv: ({ title }) =>
    `https://tv.apple.com/search?term=${encodeTitle(title)}`,
  appletvplus: ({ title }) =>
    `https://tv.apple.com/search?term=${encodeTitle(title)}`,
  appleitunes: ({ title }) =>
    `https://tv.apple.com/search?term=${encodeTitle(title)}`,
  googleplaymovies: ({ title, mediaType }) =>
    `https://play.google.com/store/search?q=${encodeTitle(title)}&c=${
      mediaType === "movie" ? "movies" : "tv"
    }`,
  youtube: ({ title }) =>
    `https://www.youtube.com/results?search_query=${encodeTitle(title)}`,
  youtubepremium: ({ title }) =>
    `https://www.youtube.com/results?search_query=${encodeTitle(title)}`,
  youtubemovies: ({ title }) =>
    `https://www.youtube.com/results?search_query=${encodeTitle(title)}`,
  paramountplus: ({ title }) =>
    `https://www.paramountplus.com/search/?q=${encodeTitle(title)}`,
  peacock: ({ title }) =>
    `https://www.peacocktv.com/search?q=${encodeTitle(title)}`,
  peacockpremium: ({ title }) =>
    `https://www.peacocktv.com/search?q=${encodeTitle(title)}`,
  starz: ({ title }) =>
    `https://www.starz.com/us/en/search?searchTerm=${encodeTitle(title)}`,
  starzplay: ({ title }) =>
    `https://www.starz.com/us/en/search?searchTerm=${encodeTitle(title)}`,
  sonyliv: ({ title }) =>
    `https://www.sonyliv.com/search?q=${encodeTitle(title)}`,
  zee5: ({ title }) => `https://www.zee5.com/search?q=${encodeTitle(title)}`,
  altbalaji: ({ title }) =>
    `https://www.altbalaji.com/search?searchText=${encodeTitle(title)}`,
  crunchyroll: ({ title }) =>
    `https://www.crunchyroll.com/search?from=web&q=${encodeTitle(title)}`,
  vudu: ({ title }) =>
    `https://www.vudu.com/content/movies/search?kw=${encodeTitle(title)}`,
  rakutentv: ({ title }) =>
    `https://www.rakuten.tv/uk/search?query=${encodeTitle(title)}`,
  now: ({ title }) => `https://www.nowtv.com/search?q=${encodeTitle(title)}`,
  nowtv: ({ title }) => `https://www.nowtv.com/search?q=${encodeTitle(title)}`,
  bbciplayer: ({ title }) =>
    `https://www.bbc.co.uk/iplayer/search?q=${encodeTitle(title)}`,
  all4: ({ title }) =>
    `https://www.channel4.com/programmes/search?q=${encodeTitle(title)}`,
  itvx: ({ title }) =>
    `https://www.itv.com/watch/search?q=${encodeTitle(title)}`,
  plex: ({ title }) => `https://watch.plex.tv/search?q=${encodeTitle(title)}`,
  tubitv: ({ title }) => `https://tubitv.com/search/${encodeTitle(title)}`,
  plutotv: ({ title }) => `https://pluto.tv/en/search?q=${encodeTitle(title)}`,
  slingtv: ({ title }) =>
    `https://www.sling.com/search?q=${encodeTitle(title)}`,
  fubotv: ({ title }) => `https://www.fubo.tv/app/search/${encodeTitle(title)}`,
  crave: ({ title }) => `https://www.crave.ca/search?q=${encodeTitle(title)}`,
  showtime: ({ title }) => `https://www.sho.com/search?q=${encodeTitle(title)}`,
  amcplus: ({ title }) =>
    `https://www.amcplus.com/search?q=${encodeTitle(title)}`,
  kanopy: ({ title }) =>
    `https://www.kanopy.com/en/search/product?q=${encodeTitle(title)}`,
  criterionchannel: ({ title }) =>
    `https://www.criterionchannel.com/search?q=${encodeTitle(title)}`,
};

const resolveProviderUrl = (
  providerName: string,
  context: ProviderLinkContext
) => {
  const normalized = normalizeProviderName(providerName);
  const builder = providerLinkBuilders[normalized];
  if (builder) {
    return builder(context);
  }
  return context.fallbackLink;
};

const buildFallbackLink = (
  mediaType: "movie" | "tv",
  tmdbId: number,
  countryCode: string,
  providerLink?: string
) => {
  if (providerLink) return providerLink;
  const params = new URLSearchParams();
  if (countryCode) {
    params.set("watch_region", countryCode);
    params.set("locale", countryCode);
  }
  const query = params.toString();
  return `https://www.themoviedb.org/${mediaType}/${tmdbId}/watch${
    query ? `?${query}` : ""
  }`;
};

// Helper to get a sorted list of country names for the dropdown
const getCountryNames = (providers: WatchProviders) => {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return Object.keys(providers)
    .map((code) => ({
      code,
      name: names.of(code) || code, // Fallback to code if name isn't found
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Helper to bundle providers by their name (e.g., Netflix can have stream, buy, rent)
const bundleProviders = (
  countryData: ProviderCountry | undefined,
  context: ProviderLinkContext
) => {
  if (!countryData) return [];

  const bundled = new Map<number, BundledProvider>();

  const process = (providers: WatchProvider[] | undefined, type: string) => {
    if (!providers) return;
    for (const p of providers) {
      if (!bundled.has(p.provider_id)) {
        bundled.set(p.provider_id, {
          name: p.provider_name,
          logo: p.logo_path,
          types: new Set(),
          url: resolveProviderUrl(p.provider_name, context),
        });
      }
      bundled.get(p.provider_id)!.types.add(type);
    }
  };

  process(countryData.flatrate, "Stream");
  process(countryData.rent, "Rent");
  process(countryData.buy, "Buy");

  return Array.from(bundled.values());
};

export default function ProviderSection({
  providers,
  title,
  mediaType,
  tmdbId,
}: ProviderSectionProps) {
  const countryList = getCountryNames(providers);
  const defaultCountryCode =
    countryList.find((c) => c.code === DEFAULT_COUNTRY)?.code ??
    countryList[0]?.code ??
    DEFAULT_COUNTRY;
  const [selectedCountry, setSelectedCountry] =
    useState<string>(defaultCountryCode);

  // Handle cases where there's no data or the default country isn't available
  if (countryList.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Where to Watch</h2>
        <div className="rounded-3xl border border-border bg-card p-6 text-center text-muted-foreground shadow-soft">
          No streaming availability information found for this title.
        </div>
      </section>
    );
  }
  const currentCountryData = providers[selectedCountry];
  const fallbackLink = buildFallbackLink(
    mediaType,
    tmdbId,
    selectedCountry,
    currentCountryData?.link
  );

  const bundled = bundleProviders(currentCountryData, {
    title,
    mediaType,
    countryCode: selectedCountry,
    fallbackLink,
  });

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold mb-2 sm:mb-0">Where to Watch</h2>
        <div className="flex items-center gap-3">
          <label
            htmlFor="country-select"
            className="text-sm font-medium text-muted-foreground"
          >
            Country:
          </label>
          <div className="relative">
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none rounded-full border border-border bg-black/70 py-2 pl-4 pr-10 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {countryList.map(({ code, name }) => (
                <option key={code} value={code} className="bg-black text-white">
                  {name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.708a.75.75 0 111.06 1.062l-4.24 4.237a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        {bundled.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {bundled.map((p) => {
              const cardContent = (
                <>
                  {p.logo ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${p.logo}`}
                      alt={p.name}
                      width={64}
                      height={64}
                      className="mb-2 rounded-xl"
                    />
                  ) : (
                    <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 text-xs font-semibold uppercase text-muted-foreground">
                      {p.name.slice(0, 2)}
                    </div>
                  )}
                  <p className="mb-1 text-sm font-semibold text-foreground">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Array.from(p.types).join(", ")}
                  </p>
                </>
              );

              const baseClasses =
                "flex flex-col items-center rounded-2xl border border-white/5 bg-surface-elevated/40 p-4 text-center backdrop-blur transition";

              if (p.url) {
                return (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${title} on ${p.name}`}
                    aria-label={`Open ${title} on ${p.name} (opens in new tab)`}
                    className={`${baseClasses} cursor-pointer hover:border-accent/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <div
                  key={p.name}
                  className={`${baseClasses} cursor-default opacity-70`}
                  aria-disabled={true}
                >
                  {cardContent}
                  <span className="mt-2 text-[11px] font-medium text-muted-foreground">
                    Link unavailable
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Not currently available in the selected country.
          </p>
        )}
      </div>
    </section>
  );
}
