"use client";

import DateRangePicker from "./DateRangePicker";
import CategoryTreeSelect from "./CategoryTreeSelect";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface ReportFiltersProps {
  startDate: string;
  endDate: string;
  categoryId: string;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onApply: () => void;
  loading?: boolean;
  className?: string;
}

export default function ReportFilters({
  startDate,
  endDate,
  categoryId,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onApply,
  loading = false,
  className,
}: ReportFiltersProps) {
  return (
    <div className={cn("flex flex-wrap items-end gap-4", className)}>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
      <CategoryTreeSelect
        value={categoryId}
        onChange={onCategoryChange}
        placeholder="All categories"
      />
      <Button size="sm" onClick={onApply} disabled={loading}>
        {loading ? "Applying…" : "Apply"}
      </Button>
    </div>
  );
}
