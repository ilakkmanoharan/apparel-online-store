import { NextRequest, NextResponse } from "next/server";
import { reservePickup } from "@/lib/bopis/reservations";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const BOPIS_RESERVE_MESSAGES: Record<
  Locale,
  {
    missingRequired: string;
    reserveFailed: string;
    reserveSuccess: string;
    storeNotFound: string;
    pickupUnavailable: string;
    itemUnavailable: string;
  }
> = {
  en: {
    missingRequired: "userId, storeId, and productId are required",
    reserveFailed: "Reserve failed",
    reserveSuccess: "Reservation created successfully",
    storeNotFound: "Store not found.",
    pickupUnavailable: "Store does not offer pickup.",
    itemUnavailable: "Item not available at this store.",
  },
  es: {
    missingRequired: "userId, storeId y productId son obligatorios",
    reserveFailed: "La reserva fallo",
    reserveSuccess: "Reserva creada correctamente",
    storeNotFound: "Tienda no encontrada.",
    pickupUnavailable: "La tienda no ofrece recogida.",
    itemUnavailable: "Articulo no disponible en esta tienda.",
  },
  fr: {
    missingRequired: "userId, storeId et productId sont requis",
    reserveFailed: "La reservation a echoue",
    reserveSuccess: "Reservation creee avec succes",
    storeNotFound: "Magasin introuvable.",
    pickupUnavailable: "Le magasin ne propose pas le retrait.",
    itemUnavailable: "Article indisponible dans ce magasin.",
  },
  de: {
    missingRequired: "userId, storeId und productId sind erforderlich",
    reserveFailed: "Reservierung fehlgeschlagen",
    reserveSuccess: "Reservierung erfolgreich erstellt",
    storeNotFound: "Store nicht gefunden.",
    pickupUnavailable: "Dieser Store bietet keine Abholung an.",
    itemUnavailable: "Artikel in diesem Store nicht verfuegbar.",
  },
};

function getBodyLocale(body: unknown): Locale | null {
  if (!body || typeof body !== "object") return null;
  const localeValue = (body as { locale?: unknown }).locale;
  if (typeof localeValue !== "string") return null;
  return isLocale(localeValue) ? localeValue : null;
}

function resolveLocale(request: NextRequest, body: unknown): Locale {
  const bodyLocale = getBodyLocale(body);
  if (bodyLocale) {
    return bodyLocale;
  }

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

function localizeReserveMessage(message: string, locale: Locale): string {
  const m = BOPIS_RESERVE_MESSAGES[locale] ?? BOPIS_RESERVE_MESSAGES.en;
  if (message === "Store not found.") return m.storeNotFound;
  if (message === "Store does not offer pickup.") return m.pickupUnavailable;
  if (message === "Item not available at this store.") return m.itemUnavailable;
  if (message === "Reserve failed") return m.reserveFailed;
  return message;
}

export async function POST(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const messages = BOPIS_RESERVE_MESSAGES[locale] ?? BOPIS_RESERVE_MESSAGES.en;
    const userId = body.userId as string;
    const storeId = body.storeId as string;
    const productId = body.productId as string;
    const variantKey = (body.variantKey as string) ?? "";
    const quantity = Math.max(1, parseInt(String(body.quantity ?? 1), 10));
    const expiresInHours = Math.min(72, Math.max(1, parseInt(String(body.expiresInHours ?? 24), 10)));
    if (!userId || !storeId || !productId) {
      return NextResponse.json(
        { error: messages.missingRequired },
        { status: 400 }
      );
    }
    const result = await reservePickup(userId, storeId, productId, variantKey, quantity, expiresInHours);
    return NextResponse.json({ ...result, message: messages.reserveSuccess });
  } catch (e) {
    const messages = BOPIS_RESERVE_MESSAGES[locale] ?? BOPIS_RESERVE_MESSAGES.en;
    const errorMessage =
      e instanceof Error
        ? localizeReserveMessage(e.message, locale)
        : messages.reserveFailed;
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
