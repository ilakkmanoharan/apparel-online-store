import { NextRequest, NextResponse } from "next/server";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const SPEND_ROUTE_MESSAGES: Record<
  Locale,
  { missingUserId: string; failedSpend: string }
> = {
  en: { missingUserId: "Missing userId", failedSpend: "Failed to get spend" },
  es: { missingUserId: "Falta userId", failedSpend: "No se pudo obtener el gasto" },
  fr: { missingUserId: "userId manquant", failedSpend: "Echec de recuperation des depenses" },
  de: { missingUserId: "userId fehlt", failedSpend: "Ausgaben konnten nicht geladen werden" },
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
  const messages = SPEND_ROUTE_MESSAGES[locale] ?? SPEND_ROUTE_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: messages.missingUserId }, { status: 400 });
    const userSpend = await getUserSpend(userId);
    return NextResponse.json(userSpend ?? { userId, lifetimeSpend: 0, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Loyalty spend error:", err);
    return NextResponse.json({ error: messages.failedSpend }, { status: 500 });
  }
}
