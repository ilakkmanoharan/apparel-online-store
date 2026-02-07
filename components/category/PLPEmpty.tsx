"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";

interface PLPEmptyProps {
  message?: string;
  showClearFilters?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export default function PLPEmpty({
  message,
  showClearFilters,
  onClearFilters,
  className,
}: PLPEmptyProps) {
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <p className="text-gray-600 mb-4">{message ?? t("category.emptyFilters")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {showClearFilters && onClearFilters && (
          <button type="button" onClick={onClearFilters} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            {t("common.clearFilters")}
          </button>
        )}
        <LocaleLink href="/" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
          {t("common.continueShopping")}
        </LocaleLink>
      </div>
    </div>
  );
}
