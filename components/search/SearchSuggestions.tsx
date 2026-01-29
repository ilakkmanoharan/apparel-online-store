"use client";

import Link from "next/link";
import type { SearchSuggestion } from "@/types/search";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect?: (s: SearchSuggestion) => void;
  className?: string;
}

export default function SearchSuggestions({ suggestions, onSelect, className = "" }: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;
  return (
    <ul className={"absolute top-full left-0 right-0 mt-1 border rounded-lg bg-white shadow-lg py-2 z-50 " + className} role="listbox">
      {suggestions.map((s, i) => (
        <li key={i} role="option">
          {s.href ? (
            <Link href={s.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => onSelect?.(s)}>
              {s.text}
            </Link>
          ) : (
            <button type="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => onSelect?.(s)}>
              {s.text}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
