"use client";

import Select from "@/components/common/Select";
import type { SortOption } from "@/lib/config/filters";
import { sortOptions } from "@/lib/config/filters";
import { cn } from "@/lib/utils";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export default function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  return (
    <Select
      label="Sort by"
      options={sortOptions}
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className={cn("max-w-[200px]", className)}
    />
  );
}
