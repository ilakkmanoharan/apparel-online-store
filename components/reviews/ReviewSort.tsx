"use client";

import Select from "@/components/common/Select";
import { cn } from "@/lib/utils";

export type ReviewSortOption = "recent" | "rating-desc" | "rating-asc" | "helpful";

const OPTIONS: { value: ReviewSortOption; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "rating-desc", label: "Highest rating" },
  { value: "rating-asc", label: "Lowest rating" },
  { value: "helpful", label: "Most helpful" },
];

interface ReviewSortProps {
  value: ReviewSortOption;
  onChange: (value: ReviewSortOption) => void;
  className?: string;
}

export default function ReviewSort({ value, onChange, className }: ReviewSortProps) {
  return (
    <Select
      label="Sort reviews"
      options={OPTIONS}
      value={value}
      onChange={(e) => onChange(e.target.value as ReviewSortOption)}
      className={cn("max-w-[180px]", className)}
    />
  );
}
