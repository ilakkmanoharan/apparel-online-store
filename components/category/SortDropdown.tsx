"use client";

import Select from "@/components/common/Select";
import { useTranslations } from "@/hooks/useTranslations";
import { sortOptions, type SortOption } from "@/lib/config/filters";
import { cn } from "@/lib/utils";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export default function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const t = useTranslations();

  return (
    <Select
      label={t("category.sortBy")}
      options={sortOptions.map((option) => ({ value: option.value, label: t(`category.sort.${option.value}`) }))}
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className={cn("max-w-[200px]", className)}
    />
  );
}
