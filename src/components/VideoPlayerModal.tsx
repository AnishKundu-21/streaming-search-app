"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface VideoPlayerModalProps {
  videoKey: string;
  onClose: () => void;
}

export default function VideoPlayerModal({
  videoKey,
  onClose,
}: VideoPlayerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-black p-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-black shadow-lg"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          ></iframe>
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href={`https://www.youtube.com/watch?v=${videoKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Open in YouTube
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
