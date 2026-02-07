"use client";

import { useTranslations } from "@/hooks/useTranslations";

interface Props {
  query: string;
  count: number;
}

export default function SearchResultSummary({ query, count }: Props) {
  const t = useTranslations();

  if (!query) {
    return null;
  }

  return (
    <div className="mb-2 text-sm text-gray-600">
      {t("search.resultSummary", { count, query })}
    </div>
  );
}
