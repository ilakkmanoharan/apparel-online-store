"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
      <span className="text-gray-500">Filter by:</span>
      <select
        value={category}
        onChange={(e) => update("category", e.target.value)}
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
      >
        <option value="">All categories</option>
        <option value="women">Women</option>
        <option value="men">Men</option>
        <option value="kids">Kids</option>
      </select>
      <span className="text-gray-400 text-xs sm:text-sm">
        Showing results for &quot;{q}&quot;
      </span>
    </div>
  );
}

