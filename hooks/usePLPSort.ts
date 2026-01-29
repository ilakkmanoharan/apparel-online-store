"use client";

import { useState, useCallback } from "react";
import type { SortOption } from "@/lib/config/filters";
import { plpDefaults } from "@/lib/config/plp";

export function usePLPSort(initial?: SortOption) {
  const [sort, setSort] = useState<SortOption>(initial ?? plpDefaults.sort);

  const setSortOption = useCallback((value: SortOption) => {
    setSort(value);
  }, []);

  return { sort, setSort, setSortOption };
}
