"use client";

import { useState } from "react";

interface ExpandableTextProps {
    text: string;
    className?: string;
}

export default function ExpandableText({ text, className = "" }: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    // A rough estimate: 4 lines at typical width/font-size is around 250-300 characters.
    // We'll use a threshold to decide if we even need the button logic.
    const shouldTruncate = text.length > 300;

    if (!shouldTruncate) {
        return <p className={className}>{text}</p>;
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <p className={`${className} ${!isExpanded ? "line-clamp-4" : ""}`}>
                {text}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:text-white"
            >
                {isExpanded ? "Read Less" : "Read More"}
            </button>
        </div>
    );
}
