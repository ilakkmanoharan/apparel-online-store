"use client";

import { useTranslations } from "@/hooks/useTranslations";
import SearchSuggestionItem from "./SearchSuggestionItem";

interface Props {
  query: string;
}

export default function SearchSuggestionList({ query }: Props) {
  const t = useTranslations();

  const suggestions = [
    { label: t("search.suggestions.womenDresses"), href: "/search?q=women%20dresses" },
    { label: t("search.suggestions.menShirts"), href: "/search?q=men%20shirts" },
    { label: t("search.suggestions.kidsShoes"), href: "/search?q=kids%20shoes" },
  ];

  if (!query) {
    return null;
  }

  const lower = query.toLowerCase();
  const filtered = suggestions.filter((entry) => entry.label.toLowerCase().includes(lower));

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
      {filtered.map((entry) => (
        <SearchSuggestionItem key={entry.href} label={entry.label} href={entry.href} />
      ))}
    </div>
  );
}
