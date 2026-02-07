import type { Locale } from "@/types/i18n";

export const LOCALES = ["en", "es", "fr", "de"] as const;

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_PREFIX = "always" as const;

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const LOCALE_HEADER_NAME = "x-app-locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
