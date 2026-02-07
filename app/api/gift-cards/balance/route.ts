import { NextRequest, NextResponse } from "next/server";
import { getGiftCardBalanceByCode } from "@/lib/giftcard/balance";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const BALANCE_MESSAGES: Record<
  Locale,
  {
    codeRequired: string;
    notFound: string;
    failed: string;
  }
> = {
  en: {
    codeRequired: "code is required",
    notFound: "Gift card not found",
    failed: "Balance check failed",
  },
  es: {
    codeRequired: "se requiere el codigo",
    notFound: "Tarjeta de regalo no encontrada",
    failed: "Fallo la consulta de saldo",
  },
  fr: {
    codeRequired: "code requis",
    notFound: "Carte cadeau introuvable",
    failed: "Echec de la verification du solde",
  },
  de: {
    codeRequired: "Code ist erforderlich",
    notFound: "Geschenkkarte nicht gefunden",
    failed: "Saldoabfrage fehlgeschlagen",
  },
};

function resolveLocale(request: NextRequest): Locale {
  const localeParam = request.nextUrl.searchParams.get("locale");
  if (localeParam && isLocale(localeParam)) {
    return localeParam;
  }

  const headerLocale = request.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(request);
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const messages = BALANCE_MESSAGES[locale] ?? BALANCE_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim();
    if (!code) {
      return NextResponse.json({ error: messages.codeRequired }, { status: 400 });
    }
    const result = await getGiftCardBalanceByCode(code);
    if (!result) {
      return NextResponse.json({ error: messages.notFound }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : messages.failed },
      { status: 500 }
    );
  }
}
