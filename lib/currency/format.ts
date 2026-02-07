import type { Currency } from "@/types/currency";

const DEFAULT_FORMAT_LOCALE = "en-US";

export function formatPrice(amount: number, currency: Currency, locale: string): string {
  const normalizedLocale =
    typeof locale === "string" && locale.trim().length > 0
      ? locale.trim()
      : DEFAULT_FORMAT_LOCALE;

  try {
    return new Intl.NumberFormat(normalizedLocale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat(DEFAULT_FORMAT_LOCALE, {
      style: "currency",
      currency,
    }).format(amount);
  }
}
