"use client";

import { useTranslations } from "@/hooks/useTranslations";
import type { SortOption } from "@/lib/config/filters";
import { cn } from "@/lib/utils";
import SortDropdown from "./SortDropdown";
import ViewToggle, { type ViewMode } from "./ViewToggle";

interface PLPHeaderProps {
  title: string;
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

export default function PLPHeader({
  title,
  totalCount,
  viewMode,
  onViewModeChange,
  sort,
  onSortChange,
  className,
}: PLPHeaderProps) {
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("category.productCount", { count: totalCount })}</p>
      </div>
      <div className="flex items-center gap-4">
        <ViewToggle value={viewMode} onChange={onViewModeChange} />
        <SortDropdown value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
