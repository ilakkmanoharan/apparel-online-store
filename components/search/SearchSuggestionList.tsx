"use client";

import SearchSuggestionItem from "./SearchSuggestionItem";

interface Props {
  query: string;
}

const SUGGESTIONS = [
  { label: "Women dresses", href: "/search?q=women%20dresses" },
  { label: "Men shirts", href: "/search?q=men%20shirts" },
  { label: "Kids shoes", href: "/search?q=kids%20shoes" },
];

export default function SearchSuggestionList({ query }: Props) {
  if (!query) return null;

  const lower = query.toLowerCase();
  const filtered = SUGGESTIONS.filter((s) =>
    s.label.toLowerCase().includes(lower)
  );

  if (filtered.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
      {filtered.map((s) => (
        <SearchSuggestionItem key={s.href} label={s.label} href={s.href} />
      ))}
    </div>
  );
}

