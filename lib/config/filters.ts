export type SortOption = "price-asc" | "price-desc" | "newest" | "rating";

export interface FilterState {
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  sort: SortOption;
}

export const defaultFilterState: FilterState = {
  sizes: [],
  colors: [],
  inStockOnly: false,
  sort: "newest",
};

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];
