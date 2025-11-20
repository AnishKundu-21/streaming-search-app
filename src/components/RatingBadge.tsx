"use client";

import { useEffect, useState } from "react";

interface RatingBadgeProps {
    tmdbId: number;
    mediaType: "movie" | "tv";
    className?: string;
}

export default function RatingBadge({ tmdbId, mediaType, className = "" }: RatingBadgeProps) {
    const [rating, setRating] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchRating() {
            try {
                const res = await fetch(`/api/rating?tmdbId=${tmdbId}&mediaType=${mediaType}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) {
                        setRating(data.rating);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch rating", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchRating();

        return () => {
            isMounted = false;
        };
    }, [tmdbId, mediaType]);

    if (loading || !rating) return null;

    return (
        <div className={`absolute top-2 left-2 z-10 flex items-center justify-center rounded bg-black/80 px-2 py-1 backdrop-blur-sm ${className}`}>
            <span className="text-xs font-bold text-yellow-400">IMDb</span>
            <span className="ml-1 text-xs font-bold text-white">{rating}</span>
        </div>
    );
}
