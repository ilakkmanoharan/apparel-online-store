import type { Product } from "./index";
import type { SortOption } from "@/lib/config/filters";

export interface PLPState {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  sort: SortOption;
  filters: PLPFilters;
  loading: boolean;
}

export interface PLPFilters {
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
}

export interface PLPQueryParams {
  slug: string;
  page?: number;
  pageSize?: number;
  sort?: SortOption;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}
