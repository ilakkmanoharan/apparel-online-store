"use client";

import Input from "@/components/common/Input";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  className?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label className="flex items-center gap-1 text-sm text-gray-600">
        <span>From</span>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-40"
        />
      </label>
      <label className="flex items-center gap-1 text-sm text-gray-600">
        <span>To</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-40"
        />
      </label>
    </div>
  );
}
