"use client";

import { useState, useEffect, useCallback } from "react";
import { buildSuggestions, POPULAR_QUERIES } from "@/lib/search/suggestions";
import type { SearchSuggestion } from "@/types/search";
import type { SuggestionSource } from "@/lib/search/suggestions";

export function useSearchSuggestions(term: string, enabled: boolean) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const updateSuggestions = useCallback(() => {
    if (!enabled) {
      setSuggestions([]);
      return;
    }
    const trimmed = term.trim();
    if (trimmed.length < 2) {
      const sources: SuggestionSource[] = POPULAR_QUERIES.map((q) => ({
        type: "query",
        text: q,
        href: `/search?q=${encodeURIComponent(q)}`,
      }));
      setSuggestions(buildSuggestions("", sources, 6));
      return;
    }
    setLoading(true);
    const sources: SuggestionSource[] = [
      ...POPULAR_QUERIES.filter((q) => q.includes(trimmed) || trimmed.includes(q)).map((q) => ({
        type: "query" as const,
        text: q,
        href: `/search?q=${encodeURIComponent(q)}`,
      })),
    ];
    setSuggestions(buildSuggestions(trimmed, sources));
    setLoading(false);
  }, [term, enabled]);

  useEffect(() => {
    updateSuggestions();
  }, [updateSuggestions]);

  return { suggestions, loading };
}
