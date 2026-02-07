import { NextRequest, NextResponse } from "next/server";
import {
  validateShippingAddress,
  validatePaymentMethod,
} from "@/lib/checkout/validation";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Address } from "@/types";
import type { CheckoutValidation } from "@/types/checkout";
import type { Locale } from "@/types/i18n";

const LOCALIZED_VALIDATION_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    "Shipping address is required.": "Shipping address is required.",
    "Full name is required.": "Full name is required.",
    "Street address is required.": "Street address is required.",
    "City is required.": "City is required.",
    "State is required.": "State is required.",
    "ZIP code is required.": "ZIP code is required.",
    "Country is required.": "Country is required.",
    "Payment method is required.": "Payment method is required.",
    "Validation failed": "Validation failed",
  },
  es: {
    "Shipping address is required.": "La direccion de envio es obligatoria.",
    "Full name is required.": "El nombre completo es obligatorio.",
    "Street address is required.": "La direccion es obligatoria.",
    "City is required.": "La ciudad es obligatoria.",
    "State is required.": "El estado o provincia es obligatorio.",
    "ZIP code is required.": "El codigo postal es obligatorio.",
    "Country is required.": "El pais es obligatorio.",
    "Payment method is required.": "El metodo de pago es obligatorio.",
    "Validation failed": "La validacion fallo",
  },
  fr: {
    "Shipping address is required.": "L'adresse de livraison est requise.",
    "Full name is required.": "Le nom complet est requis.",
    "Street address is required.": "L'adresse est requise.",
    "City is required.": "La ville est requise.",
    "State is required.": "L'etat ou la region est requis.",
    "ZIP code is required.": "Le code postal est requis.",
    "Country is required.": "Le pays est requis.",
    "Payment method is required.": "Le moyen de paiement est requis.",
    "Validation failed": "La validation a echoue",
  },
  de: {
    "Shipping address is required.": "Die Lieferadresse ist erforderlich.",
    "Full name is required.": "Der vollstandige Name ist erforderlich.",
    "Street address is required.": "Die Strassenadresse ist erforderlich.",
    "City is required.": "Die Stadt ist erforderlich.",
    "State is required.": "Das Bundesland ist erforderlich.",
    "ZIP code is required.": "Die Postleitzahl ist erforderlich.",
    "Country is required.": "Das Land ist erforderlich.",
    "Payment method is required.": "Die Zahlungsmethode ist erforderlich.",
    "Validation failed": "Die Validierung ist fehlgeschlagen",
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

  const headerLocale = request.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(request);
}

function localizeErrors(errors: string[], locale: Locale): string[] {
  const map = LOCALIZED_VALIDATION_MESSAGES[locale] ?? LOCALIZED_VALIDATION_MESSAGES.en;
  return errors.map((error) => map[error] ?? error);
}

function parseAddress(body: unknown): Address | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const address = o.shippingAddress;
  if (!address || typeof address !== "object") return null;
  const a = address as Record<string, unknown>;
  return {
    id: String(a.id ?? ""),
    fullName: String(a.fullName ?? ""),
    street: String(a.street ?? ""),
    city: String(a.city ?? ""),
    state: String(a.state ?? ""),
    zipCode: String(a.zipCode ?? ""),
    country: String(a.country ?? ""),
    isDefault: Boolean(a.isDefault),
  } as Address;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const address = parseAddress(body);
    const paymentMethodId = (body as { paymentMethodId?: string }).paymentMethodId ?? null;

    const shipping = validateShippingAddress(address);
    const payment = validatePaymentMethod(paymentMethodId);

    const result: CheckoutValidation = {
      shipping: {
        valid: shipping.valid,
        errors: localizeErrors(shipping.errors, locale),
      },
      payment: {
        valid: payment.valid,
        errors: localizeErrors(payment.errors, locale),
      },
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/checkout/validate]", err);
    const genericError =
      LOCALIZED_VALIDATION_MESSAGES[locale]?.["Validation failed"] ??
      LOCALIZED_VALIDATION_MESSAGES.en["Validation failed"];
    return NextResponse.json(
      {
        shipping: { valid: false, errors: [genericError] },
        payment: { valid: false, errors: [genericError] },
      },
      { status: 500 }
    );
  }
}
