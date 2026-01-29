"use client";

interface StarRatingDisplayProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarRatingDisplay({ rating, max = 5, size = "md" }: StarRatingDisplayProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: full }, (_, i) => (
        <span key={`f-${i}`} className={`${sizeClass} text-amber-500`} aria-hidden>★</span>
      ))}
      {half > 0 && <span className={`${sizeClass} text-amber-500 opacity-80`} aria-hidden>★</span>}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e-${i}`} className={`${sizeClass} text-gray-300`} aria-hidden>★</span>
      ))}
    </div>
  );
}
