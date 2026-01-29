"use client";

import type { ProductReview } from "@/types/review";
import StarRatingDisplay from "./StarRatingDisplay";

interface ReviewListProps {
  reviews: ProductReview[];
  emptyMessage?: string;
}

export default function ReviewList({ reviews, emptyMessage = "No reviews yet." }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-gray-600 py-4">{emptyMessage}</p>;
  }
  return (
    <ul className="space-y-6">
      {reviews.map((r) => (
        <li key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
          <div className="flex items-center gap-2 mb-1">
            <StarRatingDisplay rating={r.rating} size="sm" />
            <span className="font-medium text-sm">{r.userDisplayName ?? "Anonymous"}</span>
            {r.verifiedPurchase && (
              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Verified</span>
            )}
          </div>
          {r.title && <h3 className="font-medium text-gray-900">{r.title}</h3>}
          {r.body && <p className="text-sm text-gray-600 mt-1">{r.body}</p>}
          <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
