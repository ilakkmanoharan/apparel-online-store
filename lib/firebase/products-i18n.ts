import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import type { Product } from "@/types";
import type { Locale } from "@/types/i18n";

type LocalizedRecord = Record<string, unknown>;

function readNonEmptyString(source: LocalizedRecord, key: string): string | undefined {
  const value = source[key];
  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim().length > 0 ? value : undefined;
}

export function normalizeLocale(localeValue?: string): Locale {
  if (localeValue && isLocale(localeValue)) {
    return localeValue;
  }

  return DEFAULT_LOCALE;
}

export function resolveLocalizedField(
  source: LocalizedRecord,
  baseField: string,
  localeValue?: string
): string | undefined {
  const locale = normalizeLocale(localeValue);

  const candidates =
    locale === DEFAULT_LOCALE
      ? [`${baseField}_${DEFAULT_LOCALE}`, baseField]
      : [`${baseField}_${locale}`, `${baseField}_${DEFAULT_LOCALE}`, baseField];

  for (const candidate of candidates) {
    const localized = readNonEmptyString(source, candidate);
    if (localized) {
      return localized;
    }
  }

  return undefined;
}

export function localizeProduct(
  product: Product | (LocalizedRecord & Partial<Product>),
  localeValue?: string
): Product {
  const locale = normalizeLocale(localeValue);
  const localizedName = resolveLocalizedField(product, "name", locale);
  const localizedDescription = resolveLocalizedField(product, "description", locale);

  return {
    ...(product as Product),
    name: localizedName ?? String(product.name ?? ""),
    description: localizedDescription ?? String(product.description ?? ""),
  };
}

export function getProductNameSearchFields(localeValue?: string): string[] {
  const locale = normalizeLocale(localeValue);

  if (locale === DEFAULT_LOCALE) {
    return ["name", `name_${DEFAULT_LOCALE}`];
  }

  return [`name_${locale}`, "name", `name_${DEFAULT_LOCALE}`];
}
