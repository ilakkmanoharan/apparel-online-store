"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";

interface NoResultsMessageProps {
  query?: string;
  className?: string;
}

export default function NoResultsMessage({ query, className = "" }: NoResultsMessageProps) {
  const t = useTranslations();

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900">{t("search.noResults")}</h2>
      {query && <p className="mt-2 text-gray-600">{t("search.noResultsFor", { query })}</p>}
      <p className="mt-4 text-sm text-gray-600">{t("search.tryDifferent")}</p>
      <LocaleLink href="/category/women" className="mt-4 inline-block text-blue-600 font-medium hover:underline">
        {t("search.browseWomen")}
      </LocaleLink>
      <span className="mx-2 text-gray-400">|</span>
      <LocaleLink href="/category/men" className="text-blue-600 font-medium hover:underline">
        {t("search.browseMen")}
      </LocaleLink>
    </div>
  );
}
