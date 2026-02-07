"use client";

import { useCallback } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import type { TranslationValues } from "@/types/i18n";

export function useTranslations(namespace?: string) {
  const { t } = useI18n();

  return useCallback(
    (key: string, values?: TranslationValues) => {
      const messageKey = namespace ? `${namespace}.${key}` : key;
      return t(messageKey, values);
    },
    [namespace, t]
  );
}
