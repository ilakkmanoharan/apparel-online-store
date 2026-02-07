import { NextRequest, NextResponse } from "next/server";
import { getSimilarProducts } from "@/lib/recommendations/similarProducts";
import { isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const SIMILAR_ERROR_MESSAGES: Record<
  Locale,
  {
    productIdRequired: string;
    failedToFetch: string;
  }
> = {
  en: {
    productIdRequired: "Product ID required",
    failedToFetch: "Failed to fetch similar products",
  },
  es: {
    productIdRequired: "Se requiere el id del producto",
    failedToFetch: "No se pudieron cargar productos similares",
  },
  fr: {
    productIdRequired: "Identifiant du produit requis",
    failedToFetch: "Echec du chargement des produits similaires",
  },
  de: {
    productIdRequired: "Produkt-ID erforderlich",
    failedToFetch: "Ahnliche Produkte konnten nicht geladen werden",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : getLocaleFromRequest(request);
  const messages = SIMILAR_ERROR_MESSAGES[locale] ?? SIMILAR_ERROR_MESSAGES.en;
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: messages.productIdRequired }, { status: 400 });
  }

  try {
    const recommendations = await getSimilarProducts(id, locale);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("[similar] Error fetching similar products:", error);
    return NextResponse.json(
      { error: messages.failedToFetch },
      { status: 500 }
    );
  }
}
