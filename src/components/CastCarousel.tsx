"use client";

import Image from "next/image";
import { useRef } from "react";

interface CastMember {
  credit_id: string;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastCarouselProps {
  cast: CastMember[];
  title?: string;
  description?: string;
}

export default function CastCarousel({
  cast,
  title = "Cast",
  description = "Meet the lead performers for this title.",
}: CastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!cast || cast.length === 0) {
    return null;
  }

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="mt-12 animate-fade-up animation-delay-400">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase italic tracking-wider text-white sm:text-3xl">
            {title}
          </h2>
          <p className="text-sm font-bold uppercase tracking-widest text-white/60">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            aria-label="Scroll cast left"
            className="group border border-white/20 bg-black/50 p-3 text-white transition-all hover:border-accent hover:bg-accent hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M12.78 4.22a.75.75 0 010 1.06L8.56 9.5l4.22 4.22a.75.75 0 11-1.06 1.06l-4.75-4.75a.75.75 0 010-1.06l4.75-4.75a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            aria-label="Scroll cast right"
            className="group border border-white/20 bg-black/50 p-3 text-white transition-all hover:border-accent hover:bg-accent hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M7.22 4.22a.75.75 0 000 1.06l4.22 4.22-4.22 4.22a.75.75 0 101.06 1.06l4.75-4.75a.75.75 0 000-1.06l-4.75-4.75a.75.75 0 00-1.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="mt-8 flex gap-6 overflow-x-auto pb-8 scrollbar-hide"
        ref={scrollRef}
      >
        {cast.map((person) => (
          <div
            key={person.credit_id}
            className="group flex-shrink-0 w-40 text-center"
          >
            <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_20px_rgba(255,0,128,0.3)]">
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-bold uppercase text-white/40">
                  No Image
                </div>
              )}
            </div>
            <p className="truncate text-sm font-bold uppercase tracking-wider text-white group-hover:text-accent">
              {person.name}
            </p>
            <p className="truncate text-xs font-bold uppercase tracking-widest text-white/60">
              {person.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
