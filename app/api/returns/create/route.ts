import { NextRequest, NextResponse } from "next/server";
import { createReturn } from "@/lib/returns/firebase";
import { validateReturnItems } from "@/lib/returns/validation";
import type { ReturnItem } from "@/types/returns";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const CREATE_RETURN_MESSAGES: Record<
  Locale,
  {
    missingFields: string;
    failedCreate: string;
    created: string;
    noItems: string;
    invalidReasonPrefix: string;
    quantityMin: string;
  }
> = {
  en: {
    missingFields: "Missing userId, orderId, or items",
    failedCreate: "Failed to create return",
    created: "Return created successfully",
    noItems: "No items selected.",
    invalidReasonPrefix: "Invalid reason for item:",
    quantityMin: "Quantity must be at least 1.",
  },
  es: {
    missingFields: "Faltan userId, orderId o items",
    failedCreate: "No se pudo crear la devolucion",
    created: "Devolucion creada correctamente",
    noItems: "No hay articulos seleccionados.",
    invalidReasonPrefix: "Motivo invalido para el articulo:",
    quantityMin: "La cantidad debe ser al menos 1.",
  },
  fr: {
    missingFields: "userId, orderId ou items manquants",
    failedCreate: "Echec de creation du retour",
    created: "Retour cree avec succes",
    noItems: "Aucun article selectionne.",
    invalidReasonPrefix: "Raison invalide pour l'article :",
    quantityMin: "La quantite doit etre au moins de 1.",
  },
  de: {
    missingFields: "userId, orderId oder items fehlen",
    failedCreate: "Rueckgabe konnte nicht erstellt werden",
    created: "Rueckgabe erfolgreich erstellt",
    noItems: "Keine Artikel ausgewaehlt.",
    invalidReasonPrefix: "Ungueltiger Grund fuer Artikel:",
    quantityMin: "Menge muss mindestens 1 sein.",
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

function localizeValidationMessage(message: string, locale: Locale): string {
  const m = CREATE_RETURN_MESSAGES[locale] ?? CREATE_RETURN_MESSAGES.en;
  if (message === "No items selected.") {
    return m.noItems;
  }
  if (message === "Quantity must be at least 1.") {
    return m.quantityMin;
  }
  if (message.startsWith("Invalid reason for item:")) {
    const item = message.slice("Invalid reason for item:".length).trim();
    return `${m.invalidReasonPrefix} ${item}`.trim();
  }
  return message;
}

export async function POST(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const messages = CREATE_RETURN_MESSAGES[locale] ?? CREATE_RETURN_MESSAGES.en;
    const { userId, orderId, items } = body as { userId: string; orderId: string; items: ReturnItem[] };
    if (!userId || !orderId || !items?.length) {
      return NextResponse.json({ error: messages.missingFields }, { status: 400 });
    }
    const validation = validateReturnItems(items);
    if (!validation.valid) {
      return NextResponse.json(
        { error: localizeValidationMessage(validation.message ?? messages.failedCreate, locale) },
        { status: 400 }
      );
    }
    const returnId = await createReturn(userId, orderId, items);
    return NextResponse.json({ returnId, message: messages.created });
  } catch (err) {
    console.error("Create return error:", err);
    const messages = CREATE_RETURN_MESSAGES[locale] ?? CREATE_RETURN_MESSAGES.en;
    return NextResponse.json({ error: messages.failedCreate }, { status: 500 });
  }
}
