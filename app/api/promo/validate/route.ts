import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo/validatePromo";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

const PROMO_MESSAGES: Record<
  Locale,
  {
    codeRequired: string;
    failed: string;
    enterCode: string;
    invalidOrExpired: string;
    minOrderTemplate: string;
  }
> = {
  en: {
    codeRequired: "Promo code is required.",
    failed: "Failed to validate promo",
    enterCode: "Please enter a promo code.",
    invalidOrExpired: "Invalid or expired code.",
    minOrderTemplate: "Minimum order of ${amount} required for this code.",
  },
  es: {
    codeRequired: "El codigo promocional es obligatorio.",
    failed: "No se pudo validar el codigo",
    enterCode: "Por favor ingresa un codigo promocional.",
    invalidOrExpired: "Codigo invalido o vencido.",
    minOrderTemplate: "Se requiere un pedido minimo de ${amount} para este codigo.",
  },
  fr: {
    codeRequired: "Le code promo est requis.",
    failed: "Echec de validation du code promo",
    enterCode: "Veuillez saisir un code promo.",
    invalidOrExpired: "Code invalide ou expire.",
    minOrderTemplate: "Une commande minimale de ${amount} est requise pour ce code.",
  },
  de: {
    codeRequired: "Promo-Code ist erforderlich.",
    failed: "Promo-Code konnte nicht gepruft werden",
    enterCode: "Bitte einen Promo-Code eingeben.",
    invalidOrExpired: "Code ungultig oder abgelaufen.",
    minOrderTemplate: "Mindestbestellwert von ${amount} fur diesen Code erforderlich.",
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

function localizePromoMessage(message: string, locale: Locale): string {
  const m = PROMO_MESSAGES[locale] ?? PROMO_MESSAGES.en;
  if (message === "Please enter a promo code.") {
    return m.enterCode;
  }
  if (message === "Invalid or expired code.") {
    return m.invalidOrExpired;
  }

  const minOrderMatch = message.match(/^Minimum order of \$(\d+(?:\.\d+)?) required for this code\.$/);
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
    const messages = PROMO_MESSAGES[locale] ?? PROMO_MESSAGES.en;
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: messages.codeRequired },
        { status: 400 }
      );
    }

    const result = validatePromoCode(code, subtotal);
    if (!result.valid && result.message) {
      return NextResponse.json({
        ...result,
        message: localizePromoMessage(result.message, locale),
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/promo/validate POST]", err);
    const messages = PROMO_MESSAGES[locale] ?? PROMO_MESSAGES.en;
    return NextResponse.json(
      { error: messages.failed },
      { status: 500 }
    );
  }
}
