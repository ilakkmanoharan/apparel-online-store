import { NextRequest, NextResponse } from "next/server";
import { getReviews } from "@/lib/reviews/firebase";
import { isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const REVIEW_ERROR_MESSAGES: Record<
  Locale,
  {
    missingProductId: string;
    failedToGetReviews: string;
  }
> = {
  en: {
    missingProductId: "Missing product id",
    failedToGetReviews: "Failed to get reviews",
  },
  es: {
    missingProductId: "Falta el id del producto",
    failedToGetReviews: "No se pudieron obtener las resenas",
  },
  fr: {
    missingProductId: "Identifiant du produit manquant",
    failedToGetReviews: "Echec de la recuperation des avis",
  },
  de: {
    missingProductId: "Produkt-ID fehlt",
    failedToGetReviews: "Bewertungen konnten nicht geladen werden",
  },
};

function resolveLocale(req: NextRequest): Locale {
  const localeParam = req.nextUrl.searchParams.get("locale");
  if (localeParam && isLocale(localeParam)) {
    return localeParam;
  }

  return getLocaleFromRequest(req);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const locale = resolveLocale(req);
  const messages = REVIEW_ERROR_MESSAGES[locale] ?? REVIEW_ERROR_MESSAGES.en;
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: messages.missingProductId }, { status: 400 });
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const orderBy = (searchParams.get("orderBy") as "createdAt" | "rating") || "createdAt";
    const reviews = await getReviews(id, { limit, orderBy });
    return NextResponse.json(reviews);
  } catch (err) {
    console.error("[products reviews GET]", err);
    return NextResponse.json({ error: messages.failedToGetReviews }, { status: 500 });
  }
}
