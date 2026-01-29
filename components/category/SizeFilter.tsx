"use client";

import Checkbox from "@/components/common/Checkbox";
import { cn } from "@/lib/utils";

interface SizeFilterProps {
  sizes: { value: string; count?: number }[];
  selected: string[];
  onToggle: (size: string, checked: boolean) => void;
  className?: string;
}

export default function SizeFilter({
  sizes,
  selected,
  onToggle,
  className,
}: SizeFilterProps) {
  if (sizes.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-gray-700">Size</p>
      <ul className="space-y-1.5">
        {sizes.map(({ value, count }) => (
          <li key={value}>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selected.includes(value)}
                onChange={(e) => onToggle(value, e.target.checked)}
              />
              <span className="text-sm text-gray-700">{value}</span>
              {count != null && (
                <span className="text-xs text-gray-500">({count})</span>
              )}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
