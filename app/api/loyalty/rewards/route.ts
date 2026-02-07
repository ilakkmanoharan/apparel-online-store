import { NextRequest, NextResponse } from "next/server";
import { getEligibleRewards } from "@/lib/loyalty/rewards";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

/**
 * GET /api/loyalty/rewards?userId=...
 * Returns rewards the user can redeem with current points.
 */

const REWARD_NAME_TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    "10off": "$10 off",
    "25off": "$25 off",
    freeship: "Free shipping",
  },
  es: {
    "10off": "$10 de descuento",
    "25off": "$25 de descuento",
    freeship: "Envio gratis",
  },
  fr: {
    "10off": "10$ de reduction",
    "25off": "25$ de reduction",
    freeship: "Livraison gratuite",
  },
  de: {
    "10off": "10$ Rabatt",
    "25off": "25$ Rabatt",
    freeship: "Kostenloser Versand",
  },
};

const REWARDS_ROUTE_MESSAGES: Record<
  Locale,
  { missingUserId: string; failedLoad: string }
> = {
  en: { missingUserId: "userId is required", failedLoad: "Failed to load rewards" },
  es: { missingUserId: "userId es obligatorio", failedLoad: "No se pudieron cargar recompensas" },
  fr: { missingUserId: "userId est requis", failedLoad: "Echec du chargement des recompenses" },
  de: { missingUserId: "userId ist erforderlich", failedLoad: "Belohnungen konnten nicht geladen werden" },
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
  const messages = REWARDS_ROUTE_MESSAGES[locale] ?? REWARDS_ROUTE_MESSAGES.en;
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: messages.missingUserId },
        { status: 400 }
      );
    }

    const rewards = await getEligibleRewards(userId);
    const names = REWARD_NAME_TRANSLATIONS[locale] ?? REWARD_NAME_TRANSLATIONS.en;
    return NextResponse.json(
      rewards.map((reward) => ({
        ...reward,
        name: names[reward.id] ?? reward.name,
      }))
    );
  } catch (err) {
    console.error("[api/loyalty/rewards GET]", err);
    return NextResponse.json(
      { error: messages.failedLoad },
      { status: 500 }
    );
  }
}
