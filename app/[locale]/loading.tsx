"use client";

import { useTranslations } from "@/hooks/useTranslations";

export default function LocaleLoading() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      <p className="mt-4 text-gray-600">{t("common.loading")}</p>
    </div>
  );
}
