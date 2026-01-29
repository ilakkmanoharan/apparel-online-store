"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PLPEmptyProps {
  message?: string;
  showClearFilters?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export default function PLPEmpty({
  message = "No products match your filters.",
  showClearFilters,
  onClearFilters,
  className,
}: PLPEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {showClearFilters && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Clear filters
          </button>
        )}
        <Link
          href="/"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
