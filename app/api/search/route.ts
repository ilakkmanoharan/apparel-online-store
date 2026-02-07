import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/search/index";
import { isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const SEARCH_ERROR_MESSAGES: Record<Locale, string> = {
  en: "Search failed",
  es: "La busqueda fallo",
  fr: "La recherche a echoue",
  de: "Die Suche ist fehlgeschlagen",
};

export async function GET(req: NextRequest) {
  let locale: Locale = getLocaleFromRequest(req);
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const localeParam = searchParams.get("locale");
    locale = localeParam && isLocale(localeParam) ? localeParam : getLocaleFromRequest(req);
    const filters = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    const result = await searchProducts(q, filters, locale);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[search]", err);
    return NextResponse.json(
      { error: SEARCH_ERROR_MESSAGES[locale] ?? SEARCH_ERROR_MESSAGES.en, products: [] },
      { status: 500 }
    );
  }
}
