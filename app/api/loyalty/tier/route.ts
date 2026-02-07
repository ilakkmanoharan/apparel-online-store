import { NextRequest, NextResponse } from "next/server";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend } from "@/lib/loyalty/spend";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";
import type { SpendTierId } from "@/types/loyalty";

const TIER_NAMES: Record<Locale, Record<SpendTierId, string>> = {
  en: { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" },
  es: { bronze: "Bronce", silver: "Plata", gold: "Oro", platinum: "Platino" },
  fr: { bronze: "Bronze", silver: "Argent", gold: "Or", platinum: "Platine" },
  de: { bronze: "Bronze", silver: "Silber", gold: "Gold", platinum: "Platin" },
};

const TIER_BENEFITS: Record<Locale, Record<string, string>> = {
  en: {},
  es: {
    "1x points": "1x puntos",
    "1.25x points": "1.25x puntos",
    "Birthday reward": "Recompensa de cumpleanos",
    "1.5x points": "1.5x puntos",
    "Free shipping": "Envio gratis",
    "Early access": "Acceso anticipado",
    "2x points": "2x puntos",
    "Dedicated support": "Soporte dedicado",
  },
  fr: {
    "1x points": "1x points",
    "1.25x points": "1.25x points",
    "Birthday reward": "Recompense d'anniversaire",
    "1.5x points": "1.5x points",
    "Free shipping": "Livraison gratuite",
    "Early access": "Acces anticipe",
    "2x points": "2x points",
    "Dedicated support": "Support dedie",
  },
  de: {
    "1x points": "1x Punkte",
    "1.25x points": "1.25x Punkte",
    "Birthday reward": "Geburtstagsvorteil",
    "1.5x points": "1.5x Punkte",
    "Free shipping": "Kostenloser Versand",
    "Early access": "Frueher Zugang",
    "2x points": "2x Punkte",
    "Dedicated support": "Persoenlicher Support",
  },
};

const TIER_ROUTE_MESSAGES: Record<
  Locale,
  { missingUserId: string; failedTier: string }
> = {
  en: { missingUserId: "Missing userId", failedTier: "Failed to get tier" },
  es: { missingUserId: "Falta userId", failedTier: "No se pudo obtener el nivel" },
  fr: { missingUserId: "userId manquant", failedTier: "Echec de recuperation du niveau" },
  de: { missingUserId: "userId fehlt", failedTier: "Tier konnte nicht geladen werden" },
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
  const messages = TIER_ROUTE_MESSAGES[locale] ?? TIER_ROUTE_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: messages.missingUserId }, { status: 400 });
    const userSpend = await getUserSpend(userId);
    const spend = userSpend?.lifetimeSpend ?? 0;
    const tier = getTierBySpend(spend);
    const benefitMap = TIER_BENEFITS[locale] ?? TIER_BENEFITS.en;
    const tierName = TIER_NAMES[locale]?.[tier.id] ?? tier.name;
    return NextResponse.json({
      tier: {
        ...tier,
        name: tierName,
        benefits: (tier.benefits ?? []).map((benefit) => benefitMap[benefit] ?? benefit),
      },
      lifetimeSpend: spend,
    });
  } catch (err) {
    console.error("Loyalty tier error:", err);
    return NextResponse.json({ error: messages.failedTier }, { status: 500 });
  }
}
