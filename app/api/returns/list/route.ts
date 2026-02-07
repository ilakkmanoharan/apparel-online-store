import { NextRequest, NextResponse } from "next/server";
import { getReturnsByUser } from "@/lib/returns/firebase";
import type { ReturnRequest, ReturnStatus } from "@/types/returns";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const LIST_RETURN_MESSAGES: Record<
  Locale,
  {
    missingUserId: string;
    failedList: string;
  }
> = {
  en: {
    missingUserId: "Missing userId",
    failedList: "Failed to list returns",
  },
  es: {
    missingUserId: "Falta userId",
    failedList: "No se pudo listar devoluciones",
  },
  fr: {
    missingUserId: "userId manquant",
    failedList: "Echec du chargement des retours",
  },
  de: {
    missingUserId: "userId fehlt",
    failedList: "Rueckgaben konnten nicht geladen werden",
  },
};

const RETURN_STATUS_LABELS: Record<Locale, Record<ReturnStatus, string>> = {
  en: {
    requested: "Requested",
    approved: "Approved",
    label_sent: "Label sent",
    in_transit: "In transit",
    received: "Received",
    refunded: "Refunded",
    rejected: "Rejected",
    cancelled: "Cancelled",
  },
  es: {
    requested: "Solicitada",
    approved: "Aprobada",
    label_sent: "Etiqueta enviada",
    in_transit: "En transito",
    received: "Recibida",
    refunded: "Reembolsada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
  },
  fr: {
    requested: "Demande",
    approved: "Approuvee",
    label_sent: "Etiquette envoyee",
    in_transit: "En transit",
    received: "Recue",
    refunded: "Remboursee",
    rejected: "Rejetee",
    cancelled: "Annulee",
  },
  de: {
    requested: "Angefordert",
    approved: "Genehmigt",
    label_sent: "Etikett gesendet",
    in_transit: "Unterwegs",
    received: "Eingegangen",
    refunded: "Erstattet",
    rejected: "Abgelehnt",
    cancelled: "Storniert",
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

function withStatusLabel(returnRequest: ReturnRequest, locale: Locale) {
  const labels = RETURN_STATUS_LABELS[locale] ?? RETURN_STATUS_LABELS.en;
  return {
    ...returnRequest,
    statusLabel: labels[returnRequest.status] ?? returnRequest.status,
  };
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const messages = LIST_RETURN_MESSAGES[locale] ?? LIST_RETURN_MESSAGES.en;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: messages.missingUserId }, { status: 400 });
    }
    const returns = await getReturnsByUser(userId);
    return NextResponse.json(returns.map((item) => withStatusLabel(item, locale)));
  } catch (err) {
    console.error("List returns error:", err);
    return NextResponse.json({ error: messages.failedList }, { status: 500 });
  }
}
