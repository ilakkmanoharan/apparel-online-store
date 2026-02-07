import { NextRequest, NextResponse } from "next/server";
import { checkStoreAvailability } from "@/lib/bopis/availability";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const BOPIS_AVAILABILITY_MESSAGES: Record<
  Locale,
  {
    missingRequired: string;
    failedCheck: string;
    storeNotFound: string;
    pickupUnavailable: string;
    itemUnavailable: string;
  }
> = {
  en: {
    missingRequired: "storeId and productId are required",
    failedCheck: "Availability check failed",
    storeNotFound: "Store not found.",
    pickupUnavailable: "Store does not offer pickup.",
    itemUnavailable: "Item not available at this store.",
  },
  es: {
    missingRequired: "storeId y productId son obligatorios",
    failedCheck: "La consulta de disponibilidad fallo",
    storeNotFound: "Tienda no encontrada.",
    pickupUnavailable: "La tienda no ofrece recogida.",
    itemUnavailable: "Articulo no disponible en esta tienda.",
  },
  fr: {
    missingRequired: "storeId et productId sont requis",
    failedCheck: "La verification de disponibilite a echoue",
    storeNotFound: "Magasin introuvable.",
    pickupUnavailable: "Le magasin ne propose pas le retrait.",
    itemUnavailable: "Article indisponible dans ce magasin.",
  },
  de: {
    missingRequired: "storeId und productId sind erforderlich",
    failedCheck: "Verfuegbarkeitspruefung fehlgeschlagen",
    storeNotFound: "Store nicht gefunden.",
    pickupUnavailable: "Dieser Store bietet keine Abholung an.",
    itemUnavailable: "Artikel in diesem Store nicht verfuegbar.",
  },
};

function resolveLocale(request: NextRequest): Locale {
  const queryLocale = request.nextUrl.searchParams.get("locale");
  if (queryLocale && isLocale(queryLocale)) {
    return queryLocale;
  }

  const headerLocale = request.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(request);
}

function localizeAvailabilityMessage(message: string, locale: Locale): string {
  const m = BOPIS_AVAILABILITY_MESSAGES[locale] ?? BOPIS_AVAILABILITY_MESSAGES.en;
  if (message === "Store not found.") return m.storeNotFound;
  if (message === "Store does not offer pickup.") return m.pickupUnavailable;
  if (message === "Item not available at this store.") return m.itemUnavailable;
  if (message === "Availability check failed") return m.failedCheck;
  return message;
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const messages = BOPIS_AVAILABILITY_MESSAGES[locale] ?? BOPIS_AVAILABILITY_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    const productId = searchParams.get("productId");
    const variantKey = searchParams.get("variantKey") ?? "";
    const quantity = Math.max(1, parseInt(searchParams.get("quantity") ?? "1", 10));
    if (!storeId || !productId) {
      return NextResponse.json(
        { error: messages.missingRequired },
        { status: 400 }
      );
    }
    const result = await checkStoreAvailability(storeId, productId, variantKey, quantity);
    if (result.message) {
      return NextResponse.json({
        ...result,
        message: localizeAvailabilityMessage(result.message, locale),
      });
    }
    return NextResponse.json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error
        ? localizeAvailabilityMessage(e.message, locale)
        : messages.failedCheck;
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
