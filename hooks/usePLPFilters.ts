"use client";

import { useState, useCallback } from "react";
import type { PLPFilters } from "@/types/plp";

const defaultFilters: PLPFilters = {
  sizes: [],
  colors: [],
  inStockOnly: false,
};

export function usePLPFilters(initial?: Partial<PLPFilters>) {
  const [filters, setFilters] = useState<PLPFilters>({ ...defaultFilters, ...initial });

  const setSize = useCallback((size: string, checked: boolean) => {
    setFilters((f) => ({
      ...f,
      sizes: checked ? [...f.sizes, size] : f.sizes.filter((s) => s !== size),
    }));
  }, []);

  const setColor = useCallback((color: string, checked: boolean) => {
    setFilters((f) => ({
      ...f,
      colors: checked ? [...f.colors, color] : f.colors.filter((c) => c !== color),
    }));
  }, []);

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max }));
  }, []);

  const setInStockOnly = useCallback((value: boolean) => {
    setFilters((f) => ({ ...f, inStockOnly: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultFilters });
  }, []);

  const hasActiveFilters = filters.sizes.length > 0 || filters.colors.length > 0 || filters.inStockOnly ||
    filters.minPrice != null || filters.maxPrice != null;

  return {
    filters,
    setFilters,
    setSize,
    setColor,
    setPriceRange,
    setInStockOnly,
    clearFilters,
    hasActiveFilters,
  };
}
