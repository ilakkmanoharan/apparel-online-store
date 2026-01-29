"use client";

import { cn } from "@/lib/utils";
import ViewToggle, { type ViewMode } from "./ViewToggle";
import SortDropdown from "./SortDropdown";
import type { SortOption } from "@/lib/config/filters";

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
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {totalCount} {totalCount === 1 ? "product" : "products"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ViewToggle value={viewMode} onChange={onViewModeChange} />
        <SortDropdown value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
