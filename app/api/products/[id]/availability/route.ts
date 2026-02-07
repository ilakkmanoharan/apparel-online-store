import { NextRequest, NextResponse } from "next/server";
import { getProductAvailability } from "@/lib/inventory/availability";
import { isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const AVAILABILITY_ERROR_MESSAGES: Record<
  Locale,
  {
    missingProductId: string;
    productNotFound: string;
    failedToGetAvailability: string;
  }
> = {
  en: {
    missingProductId: "Missing product id",
    productNotFound: "Product not found",
    failedToGetAvailability: "Failed to get availability",
  },
  es: {
    missingProductId: "Falta el id del producto",
    productNotFound: "Producto no encontrado",
    failedToGetAvailability: "No se pudo obtener la disponibilidad",
  },
  fr: {
    missingProductId: "Identifiant du produit manquant",
    productNotFound: "Produit introuvable",
    failedToGetAvailability: "Echec de recuperation de la disponibilite",
  },
  de: {
    missingProductId: "Produkt-ID fehlt",
    productNotFound: "Produkt nicht gefunden",
    failedToGetAvailability: "Verfugbarkeit konnte nicht geladen werden",
  },
};

function resolveLocale(request: NextRequest): Locale {
  const localeParam = request.nextUrl.searchParams.get("locale");
  if (localeParam && isLocale(localeParam)) {
    return localeParam;
  }

  return getLocaleFromRequest(request);
}

/**
 * GET /api/products/[id]/availability – product availability by size.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const locale = resolveLocale(request);
  const messages = AVAILABILITY_ERROR_MESSAGES[locale] ?? AVAILABILITY_ERROR_MESSAGES.en;
  try {
    const { id: productId } = await params;
    if (!productId) {
      return NextResponse.json(
        { error: messages.missingProductId },
        { status: 400 }
      );
    }
    const availability = await getProductAvailability(productId);
    if (!availability) {
      return NextResponse.json(
        { error: messages.productNotFound },
        { status: 404 }
      );
    }
    return NextResponse.json(availability);
  } catch (err) {
    console.error("[products availability GET]", err);
    return NextResponse.json(
      { error: messages.failedToGetAvailability },
      { status: 500 }
    );
  }
}
