"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";

interface DidYouMeanProps {
  original: string;
  suggested: string;
  searchBasePath?: string;
  className?: string;
}

export default function DidYouMean({ original, suggested, searchBasePath = "/search", className = "" }: DidYouMeanProps) {
  const href = `${searchBasePath}?q=${encodeURIComponent(suggested)}`;
  const t = useTranslations();

  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {t("search.didYouMean")}{" "}
      <LocaleLink href={href} className="font-medium text-blue-600 hover:underline">
        {suggested}
      </LocaleLink>
      ?
    </p>
  );
}
