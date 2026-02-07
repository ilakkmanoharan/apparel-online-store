import { NextRequest, NextResponse } from "next/server";
import { buildSuggestions, POPULAR_QUERIES } from "@/lib/search/suggestions";
import { getCategories } from "@/lib/firebase/categories";
import { searchProducts } from "@/lib/search";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const POPULAR_QUERY_TRANSLATIONS: Record<
  string,
  Record<Locale, string>
> = {
  dresses: { en: "dresses", es: "vestidos", fr: "robes", de: "kleider" },
  jeans: { en: "jeans", es: "jeans", fr: "jeans", de: "jeans" },
  jackets: { en: "jackets", es: "chaquetas", fr: "vestes", de: "jacken" },
  shoes: { en: "shoes", es: "zapatos", fr: "chaussures", de: "schuhe" },
  sale: { en: "sale", es: "ofertas", fr: "promotions", de: "sale" },
  "new arrivals": {
    en: "new arrivals",
    es: "novedades",
    fr: "nouveautes",
    de: "neu eingetroffen",
  },
};

function resolveLocale(req: NextRequest): Locale {
  const queryLocale = req.nextUrl.searchParams.get("locale");
  if (queryLocale && isLocale(queryLocale)) {
    return queryLocale;
  }

  const headerLocale = req.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(req);
}

function localizePopularQuery(query: string, locale: Locale): string {
  return POPULAR_QUERY_TRANSLATIONS[query]?.[locale] ?? query;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q") ?? "";
    const locale = resolveLocale(req);

    const popularSources = POPULAR_QUERIES.map((queryText) => {
      const text = localizePopularQuery(queryText, locale);
      return {
        type: "query" as const,
        text,
        href: `/${locale}/search?q=${encodeURIComponent(text)}`,
      };
    });

    const [{ products }, categories] = await Promise.all([
      searchProducts(q, {}, locale).catch(() => ({ products: [] })),
      getCategories(locale).catch(() => []),
    ]);

    const productSources = products.slice(0, 6).map((product) => ({
      type: "product" as const,
      text: product.name,
      href: `/${locale}/products/${encodeURIComponent(product.id)}`,
      productId: product.id,
    }));

    const categorySources = categories.map((category) => ({
      type: "category" as const,
      text: category.name,
      href: `/${locale}/category/${encodeURIComponent(category.slug)}`,
    }));

    const sources = [...popularSources, ...categorySources, ...productSources];
    const suggestions = buildSuggestions(q, sources, 8);
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("[search suggestions]", err);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
