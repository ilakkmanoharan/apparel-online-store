import {
  SUPPORTED_CURRENCIES as SUPPORTED_CURRENCY_CODES,
  type Currency,
} from "@/types/currency";

export const SUPPORTED_CURRENCIES = [...SUPPORTED_CURRENCY_CODES] as const;

export const DEFAULT_CURRENCY: Currency = "USD";

function normalizeLocale(locale: string): { language: string; region: string } {
  const normalized = locale.trim().replace(/_/g, "-").toLowerCase();
  const [language = "", region = ""] = normalized.split("-");
  return { language, region };
}

export function getCurrencyForLocale(locale: string): Currency {
  if (!locale) {
    return DEFAULT_CURRENCY;
  }

  const { language, region } = normalizeLocale(locale);

  if (language === "en" && region === "gb") {
    return "GBP";
  }

  if (language === "es" || language === "fr" || language === "de") {
    return "EUR";
  }

  if (language === "en") {
    return "USD";
  }

  return DEFAULT_CURRENCY;
}
