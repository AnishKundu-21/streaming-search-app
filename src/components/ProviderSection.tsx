"use client";

import { useState } from "react";
import Image from "next/image";

// Define the shape of the provider data we expect from the API
interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
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
}

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
const bundleProviders = (countryData: ProviderCountry) => {
  const bundled = new Map<
    number,
    { name: string; logo: string; types: Set<string> }
  >();

  const process = (providers: WatchProvider[] = [], type: string) => {
    for (const p of providers) {
      if (!bundled.has(p.provider_id)) {
        bundled.set(p.provider_id, {
          name: p.provider_name,
          logo: p.logo_path,
          types: new Set(),
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

export default function ProviderSection({ providers }: ProviderSectionProps) {
  const countryList = getCountryNames(providers);
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");

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
  const bundled = currentCountryData ? bundleProviders(currentCountryData) : [];

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
            {bundled.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center rounded-2xl border border-white/5 bg-surface-elevated/40 p-4 text-center backdrop-blur"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w92${p.logo}`}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="mb-2 rounded-xl"
                />
                <p className="mb-1 text-sm font-semibold text-foreground">
                  {p.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Array.from(p.types).join(", ")}
                </p>
              </div>
            ))}
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
