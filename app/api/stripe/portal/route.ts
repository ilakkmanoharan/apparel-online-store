import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe/portal";
import { getFirebaseAdmin, getAdminDb } from "@/lib/firebase/admin";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

const STRIPE_PORTAL_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    serverAuthNotConfigured: string;
    serverNotConfigured: string;
    noBillingCustomer: string;
    failedCreatePortal: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    serverAuthNotConfigured: "Server auth not configured",
    serverNotConfigured: "Server not configured",
    noBillingCustomer: "No billing customer found. Complete a purchase first.",
    failedCreatePortal: "Failed to create portal session",
  },
  es: {
    unauthorized: "No autorizado",
    serverAuthNotConfigured: "Autenticacion del servidor no configurada",
    serverNotConfigured: "Servidor no configurado",
    noBillingCustomer: "No se encontro cliente de facturacion. Completa una compra primero.",
    failedCreatePortal: "No se pudo crear la sesion del portal",
  },
  fr: {
    unauthorized: "Non autorise",
    serverAuthNotConfigured: "Authentification serveur non configuree",
    serverNotConfigured: "Serveur non configure",
    noBillingCustomer: "Aucun client de facturation trouve. Effectuez d'abord un achat.",
    failedCreatePortal: "Echec de creation de la session portail",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverAuthNotConfigured: "Server-Authentifizierung nicht konfiguriert",
    serverNotConfigured: "Server nicht konfiguriert",
    noBillingCustomer: "Kein Abrechnungskunde gefunden. Fuehren Sie zuerst einen Kauf durch.",
    failedCreatePortal: "Portalsitzung konnte nicht erstellt werden",
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

export async function POST(req: NextRequest) {
  let locale: Locale = getLocaleFromRequest(req);
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const body = await req.json().catch(() => ({}));
    locale = resolveLocale(req, body);
    const messages = STRIPE_PORTAL_MESSAGES[locale] ?? STRIPE_PORTAL_MESSAGES.en;

    if (!token) {
      return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    }
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: messages.serverAuthNotConfigured }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const returnUrl = (body.returnUrl as string) || `${getBaseUrl()}/account/security`;

    const adminDb = await getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: messages.serverNotConfigured }, { status: 500 });
    }
    const userSnap = await adminDb.collection("users").doc(userId).get();
    const stripeCustomerId = userSnap.exists ? (userSnap.data() as { stripeCustomerId?: string })?.stripeCustomerId : null;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: messages.noBillingCustomer },
        { status: 400 }
      );
    }

    const session = await createCustomerPortalSession(stripeCustomerId, returnUrl);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/portal]", error);
    const messages = STRIPE_PORTAL_MESSAGES[locale] ?? STRIPE_PORTAL_MESSAGES.en;
    return NextResponse.json(
      { error: messages.failedCreatePortal },
      { status: 500 }
    );
  }
}
