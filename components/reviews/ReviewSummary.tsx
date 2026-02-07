"use client";

import { useTranslations } from "@/hooks/useTranslations";
import type { ReviewSummary as ReviewSummaryType } from "@/types/review";
import { cn } from "@/lib/utils";
import StarRatingDisplay from "./StarRatingDisplay";

interface ReviewSummaryProps {
  summary: ReviewSummaryType | null;
  className?: string;
}

const STARS = [5, 4, 3, 2, 1] as const;

export default function ReviewSummary({ summary, className }: ReviewSummaryProps) {
  const t = useTranslations();

  if (!summary || summary.totalCount === 0) {
    return <div className={cn("text-sm text-gray-500", className)}>{t("reviews.noReviews")}</div>;
  }

  const maxCount = Math.max(...STARS.map((star) => summary.distribution[star] ?? 0), 1);

  return (
    <div className={cn("flex flex-col sm:flex-row gap-6", className)}>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-gray-900">{summary.averageRating.toFixed(1)}</div>
        <StarRatingDisplay rating={summary.averageRating} size="md" />
        <span className="text-sm text-gray-500">{t("reviews.totalReviews", { count: summary.totalCount })}</span>
      </div>
      <div className="flex-1 space-y-1">
        {STARS.map((star) => {
          const count = summary.distribution[star] ?? 0;
          const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8">{star}</span>
              <StarRatingDisplay rating={star} size="sm" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-300 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-8 text-gray-500">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
