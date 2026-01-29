"use client";

import { departments } from "@/lib/config/departments";
import { cn } from "@/lib/utils";

interface CategoryTreeSelectProps {
  value: string;
  onChange: (categoryId: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CategoryTreeSelect({
  value,
  onChange,
  placeholder = "All categories",
  className,
}: CategoryTreeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {departments.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>
  );
}
