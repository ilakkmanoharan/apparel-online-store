import { NextRequest, NextResponse } from "next/server";
import { getUserCoupons } from "@/lib/userCoupons/firebase";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const COUPONS_MESSAGES: Record<
  Locale,
  { missingUserId: string; failedGetCoupons: string }
> = {
  en: { missingUserId: "Missing userId", failedGetCoupons: "Failed to get coupons" },
  es: { missingUserId: "Falta userId", failedGetCoupons: "No se pudieron obtener cupones" },
  fr: { missingUserId: "userId manquant", failedGetCoupons: "Echec de recuperation des coupons" },
  de: { missingUserId: "userId fehlt", failedGetCoupons: "Coupons konnten nicht geladen werden" },
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
  const messages = COUPONS_MESSAGES[locale] ?? COUPONS_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: messages.missingUserId }, { status: 400 });
    const coupons = await getUserCoupons(userId);
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("User coupons error:", err);
    return NextResponse.json({ error: messages.failedGetCoupons }, { status: 500 });
  }
}
