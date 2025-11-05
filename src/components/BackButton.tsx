"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function BackButton({ className, style }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center justify-center rounded-full border border-transparent bg-surface-muted p-2 text-foreground transition hover:border-accent/50 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 ${
        className || ""
      }`}
      style={style}
      aria-label="Go back"
    >
      {/* Back arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </button>
  );
}
