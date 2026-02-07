import { NextRequest, NextResponse } from "next/server";
import { createRefund } from "@/lib/stripe/refunds";
import { getAdminOrder } from "@/lib/admin/orders";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { stripe } from "@/lib/stripe/server";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const STRIPE_REFUND_MESSAGES: Record<
  Locale,
  {
    unauthorized: string;
    serverAuthNotConfigured: string;
    orderNotFoundOrDenied: string;
    noPaymentInfo: string;
    refundCreated: string;
    failedCreateRefund: string;
  }
> = {
  en: {
    unauthorized: "Unauthorized",
    serverAuthNotConfigured: "Server auth not configured",
    orderNotFoundOrDenied: "Order not found or access denied",
    noPaymentInfo: "No payment information available for refund",
    refundCreated: "Refund created successfully",
    failedCreateRefund: "Failed to create refund",
  },
  es: {
    unauthorized: "No autorizado",
    serverAuthNotConfigured: "Autenticacion del servidor no configurada",
    orderNotFoundOrDenied: "Pedido no encontrado o acceso denegado",
    noPaymentInfo: "No hay informacion de pago disponible para reembolso",
    refundCreated: "Reembolso creado correctamente",
    failedCreateRefund: "No se pudo crear el reembolso",
  },
  fr: {
    unauthorized: "Non autorise",
    serverAuthNotConfigured: "Authentification serveur non configuree",
    orderNotFoundOrDenied: "Commande introuvable ou acces refuse",
    noPaymentInfo: "Aucune information de paiement disponible pour le remboursement",
    refundCreated: "Remboursement cree avec succes",
    failedCreateRefund: "Echec de creation du remboursement",
  },
  de: {
    unauthorized: "Nicht autorisiert",
    serverAuthNotConfigured: "Server-Authentifizierung nicht konfiguriert",
    orderNotFoundOrDenied: "Bestellung nicht gefunden oder Zugriff verweigert",
    noPaymentInfo: "Keine Zahlungsinformationen fuer Rueckerstattung verfuegbar",
    refundCreated: "Rueckerstattung erfolgreich erstellt",
    failedCreateRefund: "Rueckerstattung konnte nicht erstellt werden",
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
    const body = await req.json();
    locale = resolveLocale(req, body);
    const messages = STRIPE_REFUND_MESSAGES[locale] ?? STRIPE_REFUND_MESSAGES.en;

    if (!token) {
      return NextResponse.json({ error: messages.unauthorized }, { status: 401 });
    }
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: messages.serverAuthNotConfigured }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const { orderId, paymentIntentId: bodyPaymentIntentId } = body as {
      orderId?: string;
      paymentIntentId?: string;
    };

    const order = orderId ? await getAdminOrder(orderId) : null;
    if (!order || order.userId !== userId) {
      return NextResponse.json({ error: messages.orderNotFoundOrDenied }, { status: 404 });
    }

    let paymentIntentId = bodyPaymentIntentId ?? (order as { paymentIntentId?: string }).paymentIntentId;
    if (!paymentIntentId && order.stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId, {
          expand: ["payment_intent"],
        });
        const pi = session.payment_intent;
        paymentIntentId = typeof pi === "string" ? pi : pi?.id ?? null;
      } catch {
        paymentIntentId = null;
      }
    }
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: messages.noPaymentInfo },
        { status: 400 }
      );
    }

    const refund = await createRefund({
      paymentIntentId,
      reason: "requested_by_customer",
      metadata: { orderId: order.id, userId },
    });

    return NextResponse.json({
      refundId: refund.id,
      status: refund.status,
      message: messages.refundCreated,
    });
  } catch (error) {
    console.error("[stripe/refund]", error);
    const messages = STRIPE_REFUND_MESSAGES[locale] ?? STRIPE_REFUND_MESSAGES.en;
    return NextResponse.json(
      { error: messages.failedCreateRefund },
      { status: 500 }
    );
  }
}
