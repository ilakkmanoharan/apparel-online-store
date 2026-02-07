import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendations/recommendations";
import { isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";
// Uses lib/recommendations/frequentlyBoughtTogether via getRecommendations

const RECOMMENDATION_ERROR_MESSAGES: Record<
  Locale,
  {
    productIdRequired: string;
    failedToFetch: string;
  }
> = {
  en: {
    productIdRequired: "Product ID required",
    failedToFetch: "Failed to fetch recommendations",
  },
  es: {
    productIdRequired: "Se requiere el id del producto",
    failedToFetch: "No se pudieron cargar las recomendaciones",
  },
  fr: {
    productIdRequired: "Identifiant du produit requis",
    failedToFetch: "Echec du chargement des recommandations",
  },
  de: {
    productIdRequired: "Produkt-ID erforderlich",
    failedToFetch: "Empfehlungen konnten nicht geladen werden",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : getLocaleFromRequest(request);
  const messages = RECOMMENDATION_ERROR_MESSAGES[locale] ?? RECOMMENDATION_ERROR_MESSAGES.en;
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: messages.productIdRequired },
      { status: 400 }
    );
  }

  try {
    const recommendations = await getRecommendations(id, locale);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("[recommendations] Error:", error);
    return NextResponse.json(
      { error: messages.failedToFetch },
      { status: 500 }
    );
  }
}
