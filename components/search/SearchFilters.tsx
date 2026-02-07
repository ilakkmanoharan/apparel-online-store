"use client";

import { useSearchParams } from "next/navigation";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";

export default function SearchFilters() {
  const router = useLocaleRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const t = useTranslations();

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
      <span className="text-gray-500">{t("search.filterBy")}</span>
      <select
        value={category}
        onChange={(e) => update("category", e.target.value)}
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
      >
        <option value="">{t("search.allCategories")}</option>
        <option value="women">{t("nav.women")}</option>
        <option value="men">{t("nav.men")}</option>
        <option value="kids">{t("nav.kids")}</option>
      </select>
      <span className="text-gray-400 text-xs sm:text-sm">{t("search.showingResultsFor", { query: q })}</span>
    </div>
  );
}
