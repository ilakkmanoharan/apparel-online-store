import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const DELETE_ACCOUNT_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    serverNotConfigured: string;
    confirmationRequired: string;
    failedDeleteAccount: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    serverNotConfigured: "Server not configured",
    confirmationRequired: "Confirmation phrase required",
    failedDeleteAccount: "Failed to delete account",
  },
  es: {
    unauthorized: "No autorizado",
    serverNotConfigured: "Servidor no configurado",
    confirmationRequired: "Se requiere la frase de confirmacion",
    failedDeleteAccount: "No se pudo eliminar la cuenta",
  },
  fr: {
    unauthorized: "Non autorise",
    serverNotConfigured: "Serveur non configure",
    confirmationRequired: "Phrase de confirmation requise",
    failedDeleteAccount: "Echec de suppression du compte",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverNotConfigured: "Server nicht konfiguriert",
    confirmationRequired: "Bestaetigungsphrase erforderlich",
    failedDeleteAccount: "Konto konnte nicht geloescht werden",
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

export async function POST(req: NextRequest) {
  let locale: Locale = getLocaleFromRequest(req);
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const body = await req.json().catch(() => ({}));
    locale = resolveLocale(req, body);
    const messages = DELETE_ACCOUNT_MESSAGES[locale] ?? DELETE_ACCOUNT_MESSAGES.en;

    if (!token) return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: messages.serverNotConfigured }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const confirm = body.confirm as string;
    if (confirm !== "DELETE MY ACCOUNT") {
      return NextResponse.json({ error: messages.confirmationRequired }, { status: 400 });
    }

    await firebaseAdmin.auth.deleteUser(userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[user/delete-account]", err);
    const messages = DELETE_ACCOUNT_MESSAGES[locale] ?? DELETE_ACCOUNT_MESSAGES.en;
    return NextResponse.json({ error: messages.failedDeleteAccount }, { status: 500 });
  }
}
