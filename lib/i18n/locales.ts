import type { Locale } from "@/types/i18n";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
  de: "Deutsch",
};

const LOCALE_DIRECTIONS: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  fr: "ltr",
  de: "ltr",
};

export function getLocaleDisplayName(locale: Locale): string {
  return LOCALE_LABELS[locale];
}

export function getLocaleDir(locale: Locale): "ltr" | "rtl" {
  return LOCALE_DIRECTIONS[locale];
}
