import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/firebase/userProfile";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const PROFILE_MESSAGES: Record<
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
    failedGet: "Failed to get profile",
    failedUpdate: "Failed to update profile",
  },
  es: {
    unauthorized: "No autorizado",
    serverNotConfigured: "Servidor no configurado",
    failedGet: "No se pudo obtener el perfil",
    failedUpdate: "No se pudo actualizar el perfil",
  },
  fr: {
    unauthorized: "Non autorise",
    serverNotConfigured: "Serveur non configure",
    failedGet: "Echec de recuperation du profil",
    failedUpdate: "Echec de mise a jour du profil",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverNotConfigured: "Server nicht konfiguriert",
    failedGet: "Profil konnte nicht geladen werden",
    failedUpdate: "Profil konnte nicht aktualisiert werden",
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
  const messages = PROFILE_MESSAGES[locale] ?? PROFILE_MESSAGES.en;
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
    const profile = await getProfile(userId);
    return NextResponse.json(profile ?? {});
  } catch (err) {
    console.error("[user/profile GET]", err);
    return NextResponse.json({ error: messages.failedGet }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const locale = resolveLocale(req);
  const messages = PROFILE_MESSAGES[locale] ?? PROFILE_MESSAGES.en;
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
    const { displayName, phone, avatarUrl } = body as { displayName?: string; phone?: string; avatarUrl?: string };
    const updated = await updateProfile(userId, { displayName, phone, avatarUrl });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[user/profile PUT]", err);
    return NextResponse.json({ error: messages.failedUpdate }, { status: 500 });
  }
}
