import type { SearchSuggestion } from "@/types/search";

const MAX_SUGGESTIONS = 8;

export interface SuggestionSource {
  type: "query" | "product" | "category";
  text: string;
  href?: string;
  productId?: string;
}

export function buildSuggestions(
  term: string,
  sources: SuggestionSource[],
  limit = MAX_SUGGESTIONS
): SearchSuggestion[] {
  const trimmed = term.trim().toLowerCase();
  if (!trimmed) return sources.slice(0, limit).map(toSuggestion);

  const scored = sources
    .map((s) => ({ source: s, score: scoreSuggestion(s.text, trimmed) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => toSuggestion(x.source));
}

function scoreSuggestion(text: string, query: string): number {
  const t = text.toLowerCase();
  if (t === query) return 100;
  if (t.startsWith(query)) return 80;
  if (t.includes(query)) return 50;
  return 0;
}

function toSuggestion(s: SuggestionSource): SearchSuggestion {
  return {
    text: s.text,
    type: s.type,
    href: s.href,
    productId: s.productId,
  };
}

export const POPULAR_QUERIES = [
  "dresses",
  "jeans",
  "jackets",
  "shoes",
  "sale",
  "new arrivals",
];
