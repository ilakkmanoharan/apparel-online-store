import { NextRequest, NextResponse } from "next/server";
import { getOrderTrackingInfo } from "@/lib/orders/tracking";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";
import type { OrderStatus, OrderTimelineEvent } from "@/types/order";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

const ORDER_TRACKING_MESSAGES: Record<
  Locale,
  { orderNotFound: string; failedTracking: string }
> = {
  en: { orderNotFound: "Order not found", failedTracking: "Failed to load tracking info" },
  es: { orderNotFound: "Pedido no encontrado", failedTracking: "No se pudo cargar el seguimiento" },
  fr: { orderNotFound: "Commande introuvable", failedTracking: "Echec du chargement du suivi" },
  de: { orderNotFound: "Bestellung nicht gefunden", failedTracking: "Sendungsverfolgung konnte nicht geladen werden" },
};

const ORDER_STATUS_LABELS: Record<Locale, Record<OrderStatus, string>> = {
  en: {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    needs_review: "Needs review",
  },
  es: {
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    needs_review: "Necesita revision",
  },
  fr: {
    pending: "En attente",
    processing: "En traitement",
    shipped: "Expedie",
    delivered: "Livre",
    cancelled: "Annulee",
    needs_review: "A verifier",
  },
  de: {
    pending: "Ausstehend",
    processing: "In Bearbeitung",
    shipped: "Versandt",
    delivered: "Zugestellt",
    cancelled: "Storniert",
    needs_review: "Pruefung erforderlich",
  },
};

const ORDER_EVENT_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    "Order placed": "Order placed",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  },
  es: {
    "Order placed": "Pedido realizado",
    Processing: "Procesando",
    Shipped: "Enviado",
    Delivered: "Entregado",
    Cancelled: "Cancelado",
  },
  fr: {
    "Order placed": "Commande passee",
    Processing: "En traitement",
    Shipped: "Expedie",
    Delivered: "Livre",
    Cancelled: "Annulee",
  },
  de: {
    "Order placed": "Bestellung aufgegeben",
    Processing: "In Bearbeitung",
    Shipped: "Versandt",
    Delivered: "Zugestellt",
    Cancelled: "Storniert",
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

function localizeEvents(events: OrderTimelineEvent[], locale: Locale): OrderTimelineEvent[] {
  const labels = ORDER_EVENT_LABELS[locale] ?? ORDER_EVENT_LABELS.en;
  return events.map((event) => ({
    ...event,
    label: labels[event.label] ?? event.label,
  }));
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const locale = resolveLocale(request);
  const messages = ORDER_TRACKING_MESSAGES[locale] ?? ORDER_TRACKING_MESSAGES.en;
  try {
    const tracking = await getOrderTrackingInfo(params.id);
    if (!tracking) {
      return NextResponse.json({ error: messages.orderNotFound }, { status: 404 });
    }
    const statusLabels = ORDER_STATUS_LABELS[locale] ?? ORDER_STATUS_LABELS.en;
    return NextResponse.json({
      ...tracking,
      statusLabel: statusLabels[tracking.status] ?? tracking.status,
      events: localizeEvents(tracking.events, locale),
    });
  } catch (err) {
    console.error("[api/orders/[id]/tracking GET]", err);
    return NextResponse.json(
      { error: messages.failedTracking },
      { status: 500 }
    );
  }
}
