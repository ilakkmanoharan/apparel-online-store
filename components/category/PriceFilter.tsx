"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import { cn } from "@/lib/utils";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onRangeChange: (min?: number, max?: number) => void;
  className?: string;
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 500;

export default function PriceFilter({
  minPrice,
  maxPrice,
  onRangeChange,
  className,
}: PriceFilterProps) {
  const [localMin, setLocalMin] = useState<string>(minPrice != null ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState<string>(maxPrice != null ? String(maxPrice) : "");

  const apply = () => {
    const min = localMin === "" ? undefined : parseFloat(localMin);
    const max = localMax === "" ? undefined : parseFloat(localMax);
    if (min != null && !Number.isFinite(min)) return;
    if (max != null && !Number.isFinite(max)) return;
    onRangeChange(min, max);
  };

  const clear = () => {
    setLocalMin("");
    setLocalMax("");
    onRangeChange(undefined, undefined);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium text-gray-700">Price</p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={DEFAULT_MIN}
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-24"
        />
        <span className="text-gray-400">–</span>
        <Input
          type="number"
          min={DEFAULT_MIN}
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-24"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={apply}
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-gray-500 hover:underline"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
