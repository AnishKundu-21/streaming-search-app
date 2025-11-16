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
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            aria-label="Scroll cast left"
            className="rounded-full border border-border bg-surface-elevated/70 p-2 text-muted-foreground transition hover:border-accent hover:text-accent"
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
            className="rounded-full border border-border bg-surface-elevated/70 p-2 text-muted-foreground transition hover:border-accent hover:text-accent"
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
        className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        ref={scrollRef}
      >
        {cast.map((person) => (
          <div
            key={person.credit_id}
            className="flex-shrink-0 w-32 text-center"
          >
            <div className="relative mx-auto mb-2 h-24 w-24 overflow-hidden rounded-full border border-border bg-surface-elevated">
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {person.name}
            </p>
            <p className="text-xs text-muted-foreground">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
