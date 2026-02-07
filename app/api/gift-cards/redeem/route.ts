import { NextRequest, NextResponse } from "next/server";
import { getGiftCardByCode, updateGiftCardBalance } from "@/lib/giftcard/firebase";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { validateGiftCardCode } from "@/lib/giftcard/validation";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const REDEEM_MESSAGES: Record<
  Locale,
  {
    codeRequired: string;
    invalidCode: string;
    notFound: string;
    noBalance: string;
    failed: string;
  }
> = {
  en: {
    codeRequired: "Code required",
    invalidCode: "Invalid code",
    notFound: "Gift card not found",
    noBalance: "No balance",
    failed: "Redeem failed",
  },
  es: {
    codeRequired: "Codigo requerido",
    invalidCode: "Codigo invalido",
    notFound: "Tarjeta de regalo no encontrada",
    noBalance: "Sin saldo",
    failed: "Fallo el canje",
  },
  fr: {
    codeRequired: "Code requis",
    invalidCode: "Code invalide",
    notFound: "Carte cadeau introuvable",
    noBalance: "Solde indisponible",
    failed: "Echec du rachat",
  },
  de: {
    codeRequired: "Code erforderlich",
    invalidCode: "Ungultiger Code",
    notFound: "Geschenkkarte nicht gefunden",
    noBalance: "Kein Guthaben",
    failed: "Einlosen fehlgeschlagen",
  },
};

function getBodyLocale(body: unknown): Locale | null {
  if (!body || typeof body !== "object") return null;
  const localeValue = (body as { locale?: unknown }).locale;
  if (typeof localeValue !== "string") return null;
  return isLocale(localeValue) ? localeValue : null;
}

function resolveLocale(req: NextRequest, body: unknown): Locale {
  const bodyLocale = getBodyLocale(body);
  if (bodyLocale) {
    return bodyLocale;
  }

  const queryLocale = req.nextUrl.searchParams.get("locale");
  if (queryLocale && isLocale(queryLocale)) {
    return queryLocale;
  }

  const headerLocale = req.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(req);
}

export async function POST(req: NextRequest) {
  let locale: Locale = getLocaleFromRequest(req);
  try {
    const body = await req.json();
    locale = resolveLocale(req, body);
    const messages = REDEEM_MESSAGES[locale] ?? REDEEM_MESSAGES.en;
    const code = String(body?.code ?? "").trim().replace(/\s/g, "").toUpperCase();
    if (!code) return NextResponse.json({ error: messages.codeRequired }, { status: 400 });
    if (!validateGiftCardCode(code).valid) return NextResponse.json({ error: messages.invalidCode }, { status: 400 });
    const giftCard = await getGiftCardByCode(code);
    if (!giftCard) return NextResponse.json({ error: messages.notFound }, { status: 404 });
    if (giftCard.balance <= 0) return NextResponse.json({ error: messages.noBalance }, { status: 400 });
    let userId: string | undefined;
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (token) {
      const admin = await getFirebaseAdmin();
      if (admin?.auth) userId = (await admin.auth.verifyIdToken(token)).uid;
    }
    if (userId) await updateGiftCardBalance(giftCard.id, giftCard.balance, userId);
    return NextResponse.json({ balance: giftCard.balance, id: giftCard.id });
  } catch (err) {
    console.error("[gift-cards redeem]", err);
    const messages = REDEEM_MESSAGES[locale] ?? REDEEM_MESSAGES.en;
    return NextResponse.json({ error: messages.failed }, { status: 500 });
  }
}
