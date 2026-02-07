import { NextRequest, NextResponse } from "next/server";
import { getUserCouponByCode } from "@/lib/userCoupons/firebase";
import { validateUserCoupon } from "@/lib/userCoupons/validate";
import { getUserPreferences } from "@/lib/firebase/userPreferences";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const APPLY_COUPON_MESSAGES: Record<
  Locale,
  {
    missingFields: string;
    failedApply: string;
    invalidOrExpired: string;
    couponExpired: string;
    couponLimitReached: string;
    minOrderTemplate: string;
    shippingPreferenceOnly: string;
    invalidCouponType: string;
  }
> = {
  en: {
    missingFields: "Missing userId, code, or cartSubtotal",
    failedApply: "Failed to apply coupon",
    invalidOrExpired: "Invalid or expired coupon.",
    couponExpired: "Coupon has expired.",
    couponLimitReached: "Coupon limit reached.",
    minOrderTemplate: "Minimum order of ${amount} required.",
    shippingPreferenceOnly: "This coupon is for your selected shipping preference.",
    invalidCouponType: "Invalid coupon type.",
  },
  es: {
    missingFields: "Faltan userId, code o cartSubtotal",
    failedApply: "No se pudo aplicar el cupon",
    invalidOrExpired: "Cupon invalido o vencido.",
    couponExpired: "El cupon ha vencido.",
    couponLimitReached: "Se alcanzo el limite del cupon.",
    minOrderTemplate: "Se requiere un pedido minimo de ${amount}.",
    shippingPreferenceOnly: "Este cupon es para tu preferencia de envio seleccionada.",
    invalidCouponType: "Tipo de cupon invalido.",
  },
  fr: {
    missingFields: "userId, code ou cartSubtotal manquants",
    failedApply: "Echec de l'application du coupon",
    invalidOrExpired: "Coupon invalide ou expire.",
    couponExpired: "Le coupon a expire.",
    couponLimitReached: "Limite du coupon atteinte.",
    minOrderTemplate: "Commande minimale de ${amount} requise.",
    shippingPreferenceOnly: "Ce coupon est reserve a votre preference de livraison selectionnee.",
    invalidCouponType: "Type de coupon invalide.",
  },
  de: {
    missingFields: "userId, code oder cartSubtotal fehlen",
    failedApply: "Coupon konnte nicht angewendet werden",
    invalidOrExpired: "Ungueltiger oder abgelaufener Coupon.",
    couponExpired: "Coupon ist abgelaufen.",
    couponLimitReached: "Coupon-Limit erreicht.",
    minOrderTemplate: "Mindestbestellwert von ${amount} erforderlich.",
    shippingPreferenceOnly: "Dieser Coupon gilt fuer die ausgewaehlte Versandpraeferenz.",
    invalidCouponType: "Ungueltiger Coupon-Typ.",
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

function localizeCouponMessage(message: string, locale: Locale): string {
  const m = APPLY_COUPON_MESSAGES[locale] ?? APPLY_COUPON_MESSAGES.en;
  if (message === "Invalid or expired coupon.") return m.invalidOrExpired;
  if (message === "Coupon has expired.") return m.couponExpired;
  if (message === "Coupon limit reached.") return m.couponLimitReached;
  if (message === "This coupon is for your selected shipping preference.") {
    return m.shippingPreferenceOnly;
  }
  if (message === "Invalid coupon type.") return m.invalidCouponType;
  const minOrderMatch = message.match(/^Minimum order of \$(\d+(?:\.\d+)?) required\.$/);
  if (minOrderMatch) {
    return m.minOrderTemplate.replace("{amount}", minOrderMatch[1]);
  }
  return message;
}

export async function POST(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const messages = APPLY_COUPON_MESSAGES[locale] ?? APPLY_COUPON_MESSAGES.en;
    const { userId, code, cartSubtotal } = body as { userId: string; code: string; cartSubtotal: number };
    if (!userId || !code || cartSubtotal == null) {
      return NextResponse.json({ error: messages.missingFields }, { status: 400 });
    }
    const coupon = await getUserCouponByCode(userId, code);
    const prefs = await getUserPreferences(userId);
    const shippingHabit = prefs?.shippingHabit;
    const result = validateUserCoupon(coupon, cartSubtotal, shippingHabit);
    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          message: result.message ? localizeCouponMessage(result.message, locale) : messages.invalidOrExpired,
        },
        { status: 200 }
      );
    }
    return NextResponse.json({
      valid: true,
      discountAmount: result.discountAmount,
      discountPercent: result.discountPercent,
      freeShipping: result.freeShipping,
    });
  } catch (err) {
    console.error("Apply coupon error:", err);
    const messages = APPLY_COUPON_MESSAGES[locale] ?? APPLY_COUPON_MESSAGES.en;
    return NextResponse.json({ error: messages.failedApply }, { status: 500 });
  }
}
