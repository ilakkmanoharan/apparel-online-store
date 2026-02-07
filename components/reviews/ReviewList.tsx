"use client";

import { useTranslations } from "@/hooks/useTranslations";
import type { ProductReview } from "@/types/review";
import StarRatingDisplay from "./StarRatingDisplay";

interface ReviewListProps {
  reviews: ProductReview[];
  emptyMessage?: string;
}

export default function ReviewList({ reviews, emptyMessage }: ReviewListProps) {
  const t = useTranslations();

  if (reviews.length === 0) {
    return <p className="text-gray-600 py-4">{emptyMessage ?? t("reviews.noReviews")}</p>;
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
          <div className="flex items-center gap-2 mb-1">
            <StarRatingDisplay rating={review.rating} size="sm" />
            <span className="font-medium text-sm">{review.userDisplayName ?? t("reviews.anonymous")}</span>
            {review.verifiedPurchase && <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{t("reviews.verified")}</span>}
          </div>
          {review.title && <h3 className="font-medium text-gray-900">{review.title}</h3>}
          {review.body && <p className="text-sm text-gray-600 mt-1">{review.body}</p>}
          <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
