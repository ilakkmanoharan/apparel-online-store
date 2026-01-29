"use client";

import { cn } from "@/lib/utils";

export interface LegendItem {
  id: string;
  label: string;
  color: string;
}

interface ChartsLegendProps {
  items: LegendItem[];
  className?: string;
}

export default function ChartsLegend({ items, className }: ChartsLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-sm", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span className="text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
