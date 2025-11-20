"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection({
    initialQuery = "",
    tagline = "All of streaming, one destination.",
}: {
    initialQuery?: string;
    tagline?: string;
}) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-center pb-16 sm:pb-24 md:pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-hero-gradient z-10" />
                {/* Simulated cinematic background - in a real app this would be a video or high-res image */}
                <div className="absolute inset-0 animate-slow-pan bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
            </div>

            <div className="relative z-20 flex w-full max-w-5xl flex-col items-center px-4 sm:px-6">
                <p className="animate-fade-in text-sm font-bold uppercase tracking-[0.5em] text-accent drop-shadow-lg">
                    Your Streaming Guide
                </p>

                <h1 className="mt-4 animate-fade-up font-display text-5xl font-bold uppercase leading-none tracking-tighter text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                    Stream<span className="text-transparent bg-clip-text bg-gradient-to-b from-accent to-accent-strong">Finder</span>
                </h1>

                <p className="mt-6 max-w-2xl animate-fade-up text-lg font-medium tracking-wide text-white/80 mix-blend-plus-lighter sm:text-xl animation-delay-200">
                    {tagline}
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mt-12 w-full max-w-2xl animate-fade-up animation-delay-300"
                >
                    <div className="group relative flex items-center overflow-hidden rounded-none border-2 border-white/20 bg-black/40 backdrop-blur-md transition-all duration-300 focus-within:border-accent hover:border-white/40">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SEARCH TITLES, PEOPLE, GENRES..."
                            className="h-14 sm:h-16 w-full bg-transparent px-4 sm:px-6 font-sans text-sm sm:text-lg font-bold uppercase tracking-wider text-white placeholder:text-white/30 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 h-full bg-white px-4 sm:px-8 font-display text-lg sm:text-xl font-bold uppercase italic tracking-widest text-black transition-transform duration-300 hover:bg-accent hover:text-white"
                        >
                            GO
                        </button>
                    </div>
                </form>

                {/* Decorative Elements */}
                <div className="absolute -bottom-32 left-0 right-0 flex justify-center gap-12 animate-fade-in animation-delay-300">
                    <div className="flex flex-col items-center gap-2">
                        <span className="h-12 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Scroll</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
