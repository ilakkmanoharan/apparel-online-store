import type { SortOption } from "@/lib/config/filters";

export interface SortOptionConfig {
  value: SortOption;
  label: string;
  field: string;
  direction: "asc" | "desc";
}

export const sortOptionsConfig: SortOptionConfig[] = [
  { value: "newest", label: "Newest", field: "createdAt", direction: "desc" },
  { value: "price-asc", label: "Price: Low to High", field: "price", direction: "asc" },
  { value: "price-desc", label: "Price: High to Low", field: "price", direction: "desc" },
  { value: "rating", label: "Top Rated", field: "rating", direction: "desc" },
];

export function getSortOptionConfig(value: SortOption): SortOptionConfig | undefined {
  return sortOptionsConfig.find((o) => o.value === value);
}
