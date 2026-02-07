import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { getOrCreateStripeCustomerId } from "@/lib/stripe/customers";
import { getSavedPaymentMethods } from "@/lib/stripe/saved-methods";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const PAYMENT_METHOD_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    authNotConfigured: string;
    listFailed: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    authNotConfigured: "Auth not configured",
    listFailed: "List failed",
  },
  es: {
    unauthorized: "No autorizado",
    authNotConfigured: "Autenticacion no configurada",
    listFailed: "No se pudo listar",
  },
  fr: {
    unauthorized: "Non autorise",
    authNotConfigured: "Authentification non configuree",
    listFailed: "Echec du chargement de la liste",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    authNotConfigured: "Authentifizierung nicht konfiguriert",
    listFailed: "Liste konnte nicht geladen werden",
  },
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
  const messages = PAYMENT_METHOD_MESSAGES[locale] ?? PAYMENT_METHOD_MESSAGES.en;
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    const admin = await getFirebaseAdmin();
    if (!admin?.auth) {
      return NextResponse.json({ error: messages.authNotConfigured }, { status: 500 });
    }
    const decoded = await admin.auth.verifyIdToken(token);
    const customerId = await getOrCreateStripeCustomerId(decoded.uid, decoded.email);
    const methods = await getSavedPaymentMethods(customerId);
    return NextResponse.json({ methods });
  } catch (error) {
    console.error("[payment-methods/list]", error);
    return NextResponse.json(
      { error: messages.listFailed },
      { status: 500 }
    );
  }
}
