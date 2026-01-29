export interface ParsedQuery {
  term: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page: number;
}

export function parseSearchQuery(query: string, searchParams?: Record<string, string | string[]>): ParsedQuery {
  const term = (typeof query === "string" ? query : "").trim();
  const params = searchParams ?? {};
  const pageStr = typeof params.page === "string" ? params.page : params.page?.[0];
  const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : 1;
  return {
    term,
    category: typeof params.category === "string" ? params.category : params.category?.[0],
    minPrice: typeof params.minPrice === "string" ? parseFloat(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === "string" ? parseFloat(params.maxPrice) : undefined,
    sort: typeof params.sort === "string" ? params.sort : params.sort?.[0],
    page,
  };
}

export function buildSearchQuery(params: ParsedQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (params.term) sp.set("q", params.term);
  if (params.category) sp.set("category", params.category);
  if (params.minPrice != null) sp.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) sp.set("maxPrice", String(params.maxPrice));
  if (params.sort) sp.set("sort", params.sort);
  if (params.page > 1) sp.set("page", String(params.page));
  return sp;
}
