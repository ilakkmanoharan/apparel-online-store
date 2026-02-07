"use client";

import { createContext, useContext, useMemo } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale, Messages, TranslationValues } from "@/types/i18n";

type I18nContextValue = {
  locale: Locale;
  t: (key: string, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
  fallbackMessages: Messages;
};

export default function I18nProvider({
  children,
  locale,
  messages,
  fallbackMessages,
}: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: createTranslator(messages, fallbackMessages),
    }),
    [locale, messages, fallbackMessages]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    const translator = createTranslator({});

    return {
      locale: DEFAULT_LOCALE,
      t: translator,
    } satisfies I18nContextValue;
  }

  return context;
}
