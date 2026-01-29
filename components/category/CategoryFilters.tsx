"use client";

import { FilterState } from "@/lib/config/filters";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

interface CategoryFiltersProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  availableSizes?: string[];
  availableColors?: string[];
}

export default function CategoryFilters({
  filters,
  onFiltersChange,
  availableSizes = [],
  availableColors = [],
}: CategoryFiltersProps) {
  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: next });
  };

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: next });
  };

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      sizes: [],
      colors: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
    });
  };

  return (
    <aside className="w-full md:w-56 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      {availableSizes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Size</h4>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Checkbox
                key={size}
                label={size}
                checked={filters.sizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
            ))}
          </div>
        </div>
      )}

      {availableColors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Color</h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <Checkbox
                key={color}
                label={color}
                checked={filters.colors.includes(color)}
                onChange={() => toggleColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Price</h4>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <span className="text-gray-400">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <Checkbox
        label="In stock only"
        checked={filters.inStockOnly}
        onChange={(e) =>
          onFiltersChange({ ...filters, inStockOnly: e.target.checked })
        }
      />
    </aside>
  );
}
