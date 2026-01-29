"use client";

import type { ProductAvailability, SizeAvailability as SizeAvailabilityType } from "@/types/inventory";
import { cn } from "@/lib/utils";

interface SizeAvailabilityProps {
  availability: ProductAvailability | null;
  loading?: boolean;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
  className?: string;
}

export default function SizeAvailability({
  availability,
  loading = false,
  selectedSize,
  onSelectSize,
  className,
}: SizeAvailabilityProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-12 animate-pulse rounded border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!availability?.bySize?.length) {
    return (
      <p className={cn("text-sm text-gray-500", className)}>
        Size availability not available.
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-gray-700">Size</p>
      <div className="flex flex-wrap gap-2">
        {availability.bySize.map((s: SizeAvailabilityType) => {
          const disabled = !s.inStock || s.quantity <= 0;
          const isSelected = selectedSize === s.size;
          return (
            <button
              key={s.size}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSize?.(s.size)}
              className={cn(
                "min-w-[2.5rem] rounded border px-3 py-2 text-sm font-medium transition-colors",
                disabled &&
                  "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400",
                !disabled &&
                  (isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400")
              )}
            >
              {s.size}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        {availability.inStock
          ? `${availability.totalQuantity} in stock`
          : "Out of stock"}
      </p>
    </div>
  );
}
