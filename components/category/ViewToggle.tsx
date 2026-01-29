"use client";

import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}

export default function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex rounded-lg border border-gray-200 p-0.5", className)} role="group" aria-label="View mode">
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={value === "grid"}
        className={cn(
          "p-2 rounded-md transition-colors",
          value === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
        )}
        aria-label="Grid view"
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={value === "list"}
        className={cn(
          "p-2 rounded-md transition-colors",
          value === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
        )}
        aria-label="List view"
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
