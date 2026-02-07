"use client";

import Select from "@/components/common/Select";
import { useTranslations } from "@/hooks/useTranslations";
import { SortOption, sortOptions } from "@/lib/config/filters";

interface CategorySortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function CategorySort({ value, onChange }: CategorySortProps) {
  const t = useTranslations();

  return (
    <Select
      label={t("category.sortBy")}
      options={sortOptions.map((option) => ({ value: option.value, label: t(`category.sort.${option.value}`) }))}
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="max-w-[200px]"
    />
  );
}
