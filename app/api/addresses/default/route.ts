import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { Address } from "@/types";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

const DEFAULT_ADDRESS_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    serverNotConfigured: string;
    failedGetDefaultAddress: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    serverNotConfigured: "Server not configured",
    failedGetDefaultAddress: "Failed to get default address",
  },
  es: {
    unauthorized: "No autorizado",
    serverNotConfigured: "Servidor no configurado",
    failedGetDefaultAddress: "No se pudo obtener la direccion predeterminada",
  },
  fr: {
    unauthorized: "Non autorise",
    serverNotConfigured: "Serveur non configure",
    failedGetDefaultAddress: "Echec de recuperation de l'adresse par defaut",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverNotConfigured: "Server nicht konfiguriert",
    failedGetDefaultAddress: "Standardadresse konnte nicht geladen werden",
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
  const messages = DEFAULT_ADDRESS_MESSAGES[locale] ?? DEFAULT_ADDRESS_MESSAGES.en;
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: messages.unauthorized }, { status: 401 });

    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.db) {
      return NextResponse.json({ error: messages.serverNotConfigured }, { status: 503 });
    }

    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const snapshot = await firebaseAdmin.db
      .collection("users")
      .doc(userId)
      .collection("addresses")
      .where("isDefault", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      const allSnap = await firebaseAdmin.db
        .collection("users")
        .doc(userId)
        .collection("addresses")
        .limit(1)
        .get();
      if (allSnap.empty) return NextResponse.json({ address: null });
      const doc = allSnap.docs[0];
      const data = doc.data();
      const address: Address = {
        id: doc.id,
        fullName: data.fullName ?? "",
        street: data.street ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        zipCode: data.zipCode ?? "",
        country: data.country ?? "",
        isDefault: !!data.isDefault,
      };
      return NextResponse.json({ address });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const address: Address = {
      id: doc.id,
      fullName: data.fullName ?? "",
      street: data.street ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      zipCode: data.zipCode ?? "",
      country: data.country ?? "",
      isDefault: !!data.isDefault,
    };
    return NextResponse.json({ address });
  } catch (err) {
    console.error("[api/addresses/default GET]", err);
    return NextResponse.json({ error: messages.failedGetDefaultAddress }, { status: 500 });
  }
}
