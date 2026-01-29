"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import FilterChip from "./FilterChip";
import type { PLPFilters } from "@/types/plp";

interface FilterSummaryProps {
  filters: PLPFilters;
  onRemoveSize?: (size: string) => void;
  onRemoveColor?: (color: string) => void;
  onClearPrice?: () => void;
  onClearInStock?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export default function FilterSummary({
  filters,
  onRemoveSize,
  onRemoveColor,
  onClearPrice,
  onClearInStock,
  onClearAll,
  className = "",
}: FilterSummaryProps) {
  const hasPrice = filters.minPrice != null || filters.maxPrice != null;
  const chips: { id: string; label: string; onRemove?: () => void }[] = [];

  filters.sizes.forEach((s) => chips.push({ id: `size-${s}`, label: `Size: ${s}`, onRemove: onRemoveSize ? () => onRemoveSize(s) : undefined }));
  filters.colors.forEach((c) => chips.push({ id: `color-${c}`, label: `Color: ${c}`, onRemove: onRemoveColor ? () => onRemoveColor(c) : undefined }));
  if (hasPrice && onClearPrice) {
    const label = [filters.minPrice, filters.maxPrice].filter(Boolean).join(" – ");
    chips.push({ id: "price", label: `Price: ${label}`, onRemove: onClearPrice });
  }
  if (filters.inStockOnly && onClearInStock) {
    chips.push({ id: "inStock", label: "In stock only", onRemove: onClearInStock });
  }

  if (chips.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">Active filters:</span>
        {chips.map((chip) => (
          <FilterChip
            key={chip.id}
            label={chip.label}
            onRemove={chip.onRemove}
          />
        ))}
        {onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <XMarkIcon className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
