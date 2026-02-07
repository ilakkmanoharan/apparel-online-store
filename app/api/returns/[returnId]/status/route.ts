import { NextRequest, NextResponse } from "next/server";
import { getReturnById } from "@/lib/returns/firebase";
import type { ReturnStatus } from "@/types/returns";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    returnId: string;
  };
}

const RETURN_STATUS_MESSAGES: Record<
  Locale,
  {
    notFound: string;
    failedLoad: string;
  }
> = {
  en: {
    notFound: "Return not found",
    failedLoad: "Failed to load return status",
  },
  es: {
    notFound: "Devolucion no encontrada",
    failedLoad: "No se pudo cargar el estado de la devolucion",
  },
  fr: {
    notFound: "Retour introuvable",
    failedLoad: "Echec du chargement du statut du retour",
  },
  de: {
    notFound: "Rueckgabe nicht gefunden",
    failedLoad: "Rueckgabestatus konnte nicht geladen werden",
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

export async function GET(request: NextRequest, { params }: RouteParams) {
  const locale = resolveLocale(request);
  const messages = RETURN_STATUS_MESSAGES[locale] ?? RETURN_STATUS_MESSAGES.en;
  try {
    const returnRequest = await getReturnById(params.returnId);
    if (!returnRequest) {
      return NextResponse.json({ error: messages.notFound }, { status: 404 });
    }
    const labels = RETURN_STATUS_LABELS[locale] ?? RETURN_STATUS_LABELS.en;
    return NextResponse.json({
      ...returnRequest,
      statusLabel: labels[returnRequest.status] ?? returnRequest.status,
    });
  } catch (err) {
    console.error("[api/returns/[returnId]/status GET]", err);
    return NextResponse.json(
      { error: messages.failedLoad },
      { status: 500 }
    );
  }
}
