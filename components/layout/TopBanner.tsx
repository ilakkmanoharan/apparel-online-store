"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";

export default function TopBanner() {
  const t = useTranslations();

  return (
    <div className="bg-gray-900 text-white text-xs sm:text-sm py-2">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-medium">{t("banner.freeShipping")}</p>
        <LocaleLink href="/sale" className="underline underline-offset-4">
          {t("banner.shopDeals")}
        </LocaleLink>
      </div>
    </div>
  );
}
