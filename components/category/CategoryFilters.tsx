"use client";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { useTranslations } from "@/hooks/useTranslations";
import { FilterState } from "@/lib/config/filters";

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
  const t = useTranslations();

  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size) ? filters.sizes.filter((entry) => entry !== size) : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: next });
  };

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color) ? filters.colors.filter((entry) => entry !== color) : [...filters.colors, color];
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
        <h3 className="font-semibold text-gray-900">{t("category.filters")}</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>{t("common.clear")}</Button>
      </div>

      {availableSizes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t("product.size")}</h4>
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">{t("product.color")}</h4>
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
        <h4 className="text-sm font-medium text-gray-700 mb-2">{t("category.price")}</h4>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder={t("category.min")}
            value={filters.minPrice ?? ""}
            onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder={t("category.max")}
            value={filters.maxPrice ?? ""}
            onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      <Checkbox
        label={t("category.inStockOnly")}
        checked={filters.inStockOnly}
        onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
      />
    </aside>
  );
}
