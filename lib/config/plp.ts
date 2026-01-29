import type { SortOption } from "@/lib/config/filters";

export const PLP_DEFAULT_PAGE_SIZE = 24;
export const PLP_MAX_PAGE_SIZE = 48;

export interface PLPDefaults {
  pageSize: number;
  sort: SortOption;
  inStockOnly: boolean;
}

export const plpDefaults: PLPDefaults = {
  pageSize: PLP_DEFAULT_PAGE_SIZE,
  sort: "newest",
  inStockOnly: false,
};

export function parsePLPPageFromSearchParams(searchParams: Record<string, string | string[] | undefined>): number {
  const p = searchParams.page;
  if (!p) return 1;
  const n = typeof p === "string" ? parseInt(p, 10) : parseInt(p[0], 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function parsePLPSortFromSearchParams(searchParams: Record<string, string | string[] | undefined>): SortOption {
  const s = searchParams.sort;
  const valid: SortOption[] = ["price-asc", "price-desc", "newest", "rating"];
  const v = typeof s === "string" ? s : s?.[0];
  return v && valid.includes(v as SortOption) ? (v as SortOption) : "newest";
}
