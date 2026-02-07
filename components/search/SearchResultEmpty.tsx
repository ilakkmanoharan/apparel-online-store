"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";

interface Props {
  query: string;
}

export default function SearchResultEmpty({ query }: Props) {
  const t = useTranslations();

  return (
    <div className="py-16 text-center">
      <h2 className="text-xl font-semibold mb-2">{t("search.noResultsShort")}</h2>
      <p className="text-gray-600 mb-4">{t("search.noResultsFor", { query })}</p>
      <p className="text-sm text-gray-500 mb-6">{t("search.tryDifferent")}</p>
      <LocaleLink href="/" className="inline-block bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors">
        {t("common.backToHome")}
      </LocaleLink>
    </div>
  );
}
