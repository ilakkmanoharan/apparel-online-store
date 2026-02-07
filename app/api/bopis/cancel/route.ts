import { NextRequest, NextResponse } from "next/server";
import { cancelReservation } from "@/lib/bopis/reservations";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

const BOPIS_CANCEL_MESSAGES: Record<
  Locale,
  {
    missingReservationId: string;
    cancelled: string;
    cancelFailed: string;
    notFound: string;
    alreadyPickedUp: string;
  }
> = {
  en: {
    missingReservationId: "reservationId is required",
    cancelled: "Reservation cancelled successfully",
    cancelFailed: "Cancel failed",
    notFound: "Reservation not found.",
    alreadyPickedUp: "Cannot cancel; already picked up.",
  },
  es: {
    missingReservationId: "reservationId es obligatorio",
    cancelled: "Reserva cancelada correctamente",
    cancelFailed: "La cancelacion fallo",
    notFound: "Reserva no encontrada.",
    alreadyPickedUp: "No se puede cancelar; ya fue recogida.",
  },
  fr: {
    missingReservationId: "reservationId est requis",
    cancelled: "Reservation annulee avec succes",
    cancelFailed: "L'annulation a echoue",
    notFound: "Reservation introuvable.",
    alreadyPickedUp: "Annulation impossible : deja recuperee.",
  },
  de: {
    missingReservationId: "reservationId ist erforderlich",
    cancelled: "Reservierung erfolgreich storniert",
    cancelFailed: "Stornierung fehlgeschlagen",
    notFound: "Reservierung nicht gefunden.",
    alreadyPickedUp: "Kann nicht storniert werden; bereits abgeholt.",
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

function localizeCancelMessage(message: string, locale: Locale): string {
  const m = BOPIS_CANCEL_MESSAGES[locale] ?? BOPIS_CANCEL_MESSAGES.en;
  if (message === "Reservation not found.") return m.notFound;
  if (message === "Cannot cancel; already picked up.") return m.alreadyPickedUp;
  if (message === "Cancel failed") return m.cancelFailed;
  return message;
}

export async function POST(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const messages = BOPIS_CANCEL_MESSAGES[locale] ?? BOPIS_CANCEL_MESSAGES.en;
    const reservationId = body.reservationId as string;
    if (!reservationId) {
      return NextResponse.json(
        { error: messages.missingReservationId },
        { status: 400 }
      );
    }
    await cancelReservation(reservationId);
    return NextResponse.json({ success: true, message: messages.cancelled });
  } catch (e) {
    const messages = BOPIS_CANCEL_MESSAGES[locale] ?? BOPIS_CANCEL_MESSAGES.en;
    const errorMessage =
      e instanceof Error
        ? localizeCancelMessage(e.message, locale)
        : messages.cancelFailed;
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
