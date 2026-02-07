import { NextRequest, NextResponse } from "next/server";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend, isFreeShippingEligible } from "@/lib/loyalty/spend";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";
import type { SpendTierId } from "@/types/loyalty";

const FREE_SHIPPING_MESSAGES: Record<
  Locale,
  {
    missingUserId: string;
    failedCheck: string;
    eligible: string;
    ineligible: string;
  }
> = {
  en: {
    missingUserId: "Missing userId",
    failedCheck: "Failed to check",
    eligible: "You are eligible for free shipping.",
    ineligible: "You are not eligible for free shipping yet.",
  },
  es: {
    missingUserId: "Falta userId",
    failedCheck: "No se pudo verificar",
    eligible: "Eres elegible para envio gratis.",
    ineligible: "Aun no eres elegible para envio gratis.",
  },
  fr: {
    missingUserId: "userId manquant",
    failedCheck: "Echec de verification",
    eligible: "Vous etes eligible a la livraison gratuite.",
    ineligible: "Vous n'etes pas encore eligible a la livraison gratuite.",
  },
  de: {
    missingUserId: "userId fehlt",
    failedCheck: "Pruefung fehlgeschlagen",
    eligible: "Sie haben Anspruch auf kostenlosen Versand.",
    ineligible: "Sie haben noch keinen Anspruch auf kostenlosen Versand.",
  },
};

const TIER_NAMES: Record<Locale, Record<SpendTierId, string>> = {
  en: { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" },
  es: { bronze: "Bronce", silver: "Plata", gold: "Oro", platinum: "Platino" },
  fr: { bronze: "Bronze", silver: "Argent", gold: "Or", platinum: "Platine" },
  de: { bronze: "Bronze", silver: "Silber", gold: "Gold", platinum: "Platin" },
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
  const messages = FREE_SHIPPING_MESSAGES[locale] ?? FREE_SHIPPING_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: messages.missingUserId }, { status: 400 });
    const userSpend = await getUserSpend(userId);
    const spend = userSpend?.lifetimeSpend ?? 0;
    const tier = getTierBySpend(spend);
    const eligible = isFreeShippingEligible(tier.id);
    const tierName = TIER_NAMES[locale]?.[tier.id] ?? tier.name;
    return NextResponse.json({
      eligible,
      tierId: tier.id,
      tierName,
      lifetimeSpend: spend,
      message: eligible ? messages.eligible : messages.ineligible,
    });
  } catch (err) {
    console.error("Free shipping check error:", err);
    return NextResponse.json({ error: messages.failedCheck }, { status: 500 });
  }
}
