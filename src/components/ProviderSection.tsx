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
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <p>No streaming availability information found for this title.</p>
        </div>
      </section>
    );
  }

  const currentCountryData = providers[selectedCountry];
  const bundled = currentCountryData ? bundleProviders(currentCountryData) : [];

  return (
    <section className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-semibold mb-2 sm:mb-0">Where to Watch</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="country-select" className="text-sm font-medium">
            Country:
          </label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {countryList.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        {bundled.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {bundled.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center text-center"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w92${p.logo}`}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="rounded-lg mb-2"
                />
                <p className="font-semibold text-sm mb-1">{p.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {Array.from(p.types).join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">
            Not currently available in the selected country.
          </p>
        )}
      </div>
    </section>
  );
}
