import { NextRequest, NextResponse } from "next/server";
import { getUserPreferences, setShippingPreference } from "@/lib/firebase/userPreferences";
import type { ShippingHabit } from "@/types/userPreferences";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const SHIPPING_PREF_MESSAGES: Record<
  Locale,
  {
    missingUserId: string;
    failedGetPreference: string;
    missingUserIdOrShippingHabit: string;
    failedUpdatePreference: string;
  }
> = {
  en: {
    missingUserId: "Missing userId",
    failedGetPreference: "Failed to get preference",
    missingUserIdOrShippingHabit: "Missing userId or shippingHabit",
    failedUpdatePreference: "Failed to update",
  },
  es: {
    missingUserId: "Falta userId",
    failedGetPreference: "No se pudo obtener la preferencia",
    missingUserIdOrShippingHabit: "Faltan userId o shippingHabit",
    failedUpdatePreference: "No se pudo actualizar",
  },
  fr: {
    missingUserId: "userId manquant",
    failedGetPreference: "Echec de recuperation de la preference",
    missingUserIdOrShippingHabit: "userId ou shippingHabit manquants",
    failedUpdatePreference: "Echec de mise a jour",
  },
  de: {
    missingUserId: "userId fehlt",
    failedGetPreference: "Praeferenz konnte nicht geladen werden",
    missingUserIdOrShippingHabit: "userId oder shippingHabit fehlen",
    failedUpdatePreference: "Aktualisierung fehlgeschlagen",
  },
};

function getBodyLocale(body: unknown): Locale | null {
  if (!body || typeof body !== "object") return null;
  const localeValue = (body as { locale?: unknown }).locale;
  if (typeof localeValue !== "string") return null;
  return isLocale(localeValue) ? localeValue : null;
}

function resolveLocale(request: NextRequest, body?: unknown): Locale {
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

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const messages = SHIPPING_PREF_MESSAGES[locale] ?? SHIPPING_PREF_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: messages.missingUserId }, { status: 400 });
    const prefs = await getUserPreferences(userId);
    return NextResponse.json(prefs ?? { userId, shippingHabit: "none", marketingEmails: false, orderUpdates: true });
  } catch (err) {
    console.error("Shipping preference get error:", err);
    return NextResponse.json({ error: messages.failedGetPreference }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const messages = SHIPPING_PREF_MESSAGES[locale] ?? SHIPPING_PREF_MESSAGES.en;
    const { userId, shippingHabit } = body as { userId: string; shippingHabit: ShippingHabit };
    if (!userId || !shippingHabit) {
      return NextResponse.json({ error: messages.missingUserIdOrShippingHabit }, { status: 400 });
    }
    await setShippingPreference(userId, shippingHabit);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Shipping preference update error:", err);
    const messages = SHIPPING_PREF_MESSAGES[locale] ?? SHIPPING_PREF_MESSAGES.en;
    return NextResponse.json({ error: messages.failedUpdatePreference }, { status: 500 });
  }
}
