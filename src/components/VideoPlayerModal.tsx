"use client";

interface VideoPlayerModalProps {
  videoKey: string;
  onClose: () => void;
}

export default function VideoPlayerModal({
  videoKey,
  onClose,
}: VideoPlayerModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-black p-4 rounded-lg shadow-xl w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-black rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold z-10"
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
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href={`https://www.youtube.com/watch?v={videoKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Open in YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
