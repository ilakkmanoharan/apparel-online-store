"use client";

import Select from "@/components/common/Select";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";

export type ReviewSortOption = "recent" | "rating-desc" | "rating-asc" | "helpful";

interface ReviewSortProps {
  value: ReviewSortOption;
  onChange: (value: ReviewSortOption) => void;
  className?: string;
}

export default function ReviewSort({ value, onChange, className }: ReviewSortProps) {
  const t = useTranslations();

  const options = [
    { value: "recent", label: t("reviews.sort.mostRecent") },
    { value: "rating-desc", label: t("reviews.sort.highest") },
    { value: "rating-asc", label: t("reviews.sort.lowest") },
    { value: "helpful", label: t("reviews.sort.helpful") },
  ];

  return (
    <Select
      label={t("reviews.sortReviews")}
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value as ReviewSortOption)}
      className={cn("max-w-[180px]", className)}
    />
  );
}
