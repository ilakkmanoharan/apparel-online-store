import { NextRequest, NextResponse } from "next/server";
import { getReturnById } from "@/lib/returns/firebase";
import type { ReturnStatus } from "@/types/returns";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const RETURN_DETAIL_MESSAGES: Record<
  Locale,
  {
    notFound: string;
    failedGet: string;
  }
> = {
  en: {
    notFound: "Return not found",
    failedGet: "Failed to get return",
  },
  es: {
    notFound: "Devolucion no encontrada",
    failedGet: "No se pudo obtener la devolucion",
  },
  fr: {
    notFound: "Retour introuvable",
    failedGet: "Echec de recuperation du retour",
  },
  de: {
    notFound: "Rueckgabe nicht gefunden",
    failedGet: "Rueckgabe konnte nicht geladen werden",
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ returnId: string }> }
) {
  const locale = resolveLocale(request);
  const messages = RETURN_DETAIL_MESSAGES[locale] ?? RETURN_DETAIL_MESSAGES.en;
  try {
    const { returnId } = await params;
    const returnRequest = await getReturnById(returnId);
    if (!returnRequest) {
      return NextResponse.json({ error: messages.notFound }, { status: 404 });
    }
    const labels = RETURN_STATUS_LABELS[locale] ?? RETURN_STATUS_LABELS.en;
    return NextResponse.json({
      ...returnRequest,
      statusLabel: labels[returnRequest.status] ?? returnRequest.status,
    });
  } catch (err) {
    console.error("Get return error:", err);
    return NextResponse.json({ error: messages.failedGet }, { status: 500 });
  }
}
