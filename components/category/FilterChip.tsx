"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
  className?: string;
}

export default function FilterChip({ label, active, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium",
        active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:opacity-80"
          aria-label={`Remove ${label}`}
        >
          &times;
        </button>
      )}
    </span>
  );
}
