"use client";

import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  inStock: boolean;
  stockCount?: number;
  className?: string;
}

export default function AvailabilityBadge({
  inStock,
  stockCount,
  className,
}: AvailabilityBadgeProps) {
  if (inStock) {
    const lowStock = stockCount != null && stockCount <= 5;
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          lowStock ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800",
          className
        )}
      >
        {lowStock && stockCount != null
          ? `Only ${stockCount} left`
          : "In stock"}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700",
        className
      )}
    >
      Out of stock
    </span>
  );
}
