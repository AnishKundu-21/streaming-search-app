"use client";

import { useState } from "react";
import VideoPlayerModal from "./VideoPlayerModal";

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TrailerButtonProps {
  videos: { results: Video[] };
}

export default function TrailerButton({ videos }: TrailerButtonProps) {
  const [showModal, setShowModal] = useState(false);

  // Find the first official "Trailer" from the list of videos
  const trailer = videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  if (!trailer) {
    return null; // Don't render the button if no trailer is found
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group inline-flex h-12 items-center justify-center gap-2 border border-white/20 bg-white text-black px-6 text-sm font-bold uppercase tracking-widest transition-all hover:bg-accent hover:border-accent hover:text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 transition-transform group-hover:scale-110"
        >
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        Play Trailer
      </button>

      {showModal && (
        <VideoPlayerModal
          videoKey={trailer.key}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
