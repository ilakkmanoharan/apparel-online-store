import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

const AVATAR_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    serverNotConfigured: string;
    avatarRequired: string;
    failedUpdateAvatar: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    serverNotConfigured: "Server not configured",
    avatarRequired: "avatarUrl is required",
    failedUpdateAvatar: "Failed to update avatar",
  },
  es: {
    unauthorized: "No autorizado",
    serverNotConfigured: "Servidor no configurado",
    avatarRequired: "avatarUrl es obligatorio",
    failedUpdateAvatar: "No se pudo actualizar el avatar",
  },
  fr: {
    unauthorized: "Non autorise",
    serverNotConfigured: "Serveur non configure",
    avatarRequired: "avatarUrl est requis",
    failedUpdateAvatar: "Echec de mise a jour de l'avatar",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverNotConfigured: "Server nicht konfiguriert",
    avatarRequired: "avatarUrl ist erforderlich",
    failedUpdateAvatar: "Avatar konnte nicht aktualisiert werden",
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

export async function PUT(request: NextRequest) {
  const locale = resolveLocale(request);
  const messages = AVATAR_MESSAGES[locale] ?? AVATAR_MESSAGES.en;
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    }

    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin) {
      return NextResponse.json(
        { error: messages.serverNotConfigured },
        { status: 503 }
      );
    }

    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const body = await request.json();
    const avatarUrl = typeof body.avatarUrl === "string" ? body.avatarUrl : "";
    if (!avatarUrl) {
      return NextResponse.json(
        { error: messages.avatarRequired },
        { status: 400 }
      );
    }

    await firebaseAdmin.db
      .collection("users")
      .doc(userId)
      .set(
        {
          avatarUrl,
          updatedAt: new Date(),
        },
        { merge: true }
      );

    return NextResponse.json({ avatarUrl });
  } catch (err) {
    console.error("[api/user/avatar PUT]", err);
    return NextResponse.json(
      { error: messages.failedUpdateAvatar },
      { status: 500 }
    );
  }
}
