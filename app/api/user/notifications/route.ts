import { NextRequest, NextResponse } from "next/server";
import { getUserPreferences, updateUserPreferences } from "@/lib/firebase/userPreferences";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const NOTIFICATION_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    serverNotConfigured: string;
    failedGet: string;
    failedUpdate: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    serverNotConfigured: "Server not configured",
    failedGet: "Failed to get notifications",
    failedUpdate: "Failed to update notifications",
  },
  es: {
    unauthorized: "No autorizado",
    serverNotConfigured: "Servidor no configurado",
    failedGet: "No se pudieron obtener notificaciones",
    failedUpdate: "No se pudieron actualizar notificaciones",
  },
  fr: {
    unauthorized: "Non autorise",
    serverNotConfigured: "Serveur non configure",
    failedGet: "Echec de recuperation des notifications",
    failedUpdate: "Echec de mise a jour des notifications",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverNotConfigured: "Server nicht konfiguriert",
    failedGet: "Benachrichtigungen konnten nicht geladen werden",
    failedUpdate: "Benachrichtigungen konnten nicht aktualisiert werden",
  },
};

function resolveLocale(req: NextRequest): Locale {
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

export async function GET(req: NextRequest) {
  const locale = resolveLocale(req);
  const messages = NOTIFICATION_MESSAGES[locale] ?? NOTIFICATION_MESSAGES.en;
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: messages.serverNotConfigured }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;
    const prefs = await getUserPreferences(userId);
    return NextResponse.json({
      orderUpdates: prefs?.orderUpdates ?? true,
      promos: prefs?.promos ?? false,
      newArrivals: prefs?.newArrivals ?? true,
    });
  } catch (err) {
    console.error("[user/notifications GET]", err);
    return NextResponse.json({ error: messages.failedGet }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const locale = resolveLocale(req);
  const messages = NOTIFICATION_MESSAGES[locale] ?? NOTIFICATION_MESSAGES.en;
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: messages.serverNotConfigured }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;
    const body = await req.json();
    const { orderUpdates, promos, newArrivals } = body as { orderUpdates?: boolean; promos?: boolean; newArrivals?: boolean };
    await updateUserPreferences(userId, { orderUpdates, promos, newArrivals });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[user/notifications PUT]", err);
    return NextResponse.json({ error: messages.failedUpdate }, { status: 500 });
  }
}
