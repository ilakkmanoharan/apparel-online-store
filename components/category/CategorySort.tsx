"use client";

import Select from "@/components/common/Select";
import { SortOption, sortOptions } from "@/lib/config/filters";

interface CategorySortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function CategorySort({ value, onChange }: CategorySortProps) {
  return (
    <Select
      label="Sort by"
      options={sortOptions}
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="max-w-[200px]"
    />
  );
}
