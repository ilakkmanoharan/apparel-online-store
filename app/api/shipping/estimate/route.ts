import { NextRequest, NextResponse } from "next/server";
import { getDeliveryEstimate } from "@/lib/shipping/options";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const SHIPPING_ESTIMATE_MESSAGES: Record<Locale, { failedEstimate: string }> = {
  en: { failedEstimate: "Failed to get estimate" },
  es: { failedEstimate: "No se pudo obtener la estimacion" },
  fr: { failedEstimate: "Echec de recuperation de l'estimation" },
  de: { failedEstimate: "Schaetzung konnte nicht geladen werden" },
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

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const messages = SHIPPING_ESTIMATE_MESSAGES[locale] ?? SHIPPING_ESTIMATE_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const minDays = Number(searchParams.get("minDays")) || 5;
    const maxDays = Number(searchParams.get("maxDays")) || 7;
    const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date();
    const estimate = getDeliveryEstimate({ minDays, maxDays }, from);
    return NextResponse.json(estimate);
  } catch (err) {
    console.error("Delivery estimate error:", err);
    return NextResponse.json({ error: messages.failedEstimate }, { status: 500 });
  }
}
