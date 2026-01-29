import type { Product } from "./index";

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
}

export interface SearchResult {
  products: Product[];
  total?: number;
  query: string;
  didYouMean?: string;
}

export interface SearchSuggestion {
  text: string;
  type: "query" | "product" | "category";
  href?: string;
  productId?: string;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  sort: string;
  page: number;
}
