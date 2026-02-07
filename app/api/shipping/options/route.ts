import { NextRequest, NextResponse } from "next/server";
import { getShippingOptions } from "@/lib/shipping/options";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const SHIPPING_OPTIONS_MESSAGES: Record<Locale, { failedOptions: string }> = {
  en: { failedOptions: "Failed to get shipping options" },
  es: { failedOptions: "No se pudieron obtener opciones de envio" },
  fr: { failedOptions: "Echec de recuperation des options de livraison" },
  de: { failedOptions: "Versandoptionen konnten nicht geladen werden" },
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
  const messages = SHIPPING_OPTIONS_MESSAGES[locale] ?? SHIPPING_OPTIONS_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const subtotal = Number(searchParams.get("subtotal")) || 0;
    const options = getShippingOptions(subtotal);
    return NextResponse.json(options);
  } catch (err) {
    console.error("Shipping options error:", err);
    return NextResponse.json({ error: messages.failedOptions }, { status: 500 });
  }
}
