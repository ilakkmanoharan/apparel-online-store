import { NextRequest, NextResponse } from "next/server";
import {
  validateShippingAddress,
  validatePaymentMethod,
} from "@/lib/checkout/validation";
import type { Address } from "@/types";
import type { CheckoutValidation } from "@/types/checkout";

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
  try {
    const body = await request.json();
    const address = parseAddress(body);
    const paymentMethodId = (body as { paymentMethodId?: string }).paymentMethodId ?? null;

    const shipping = validateShippingAddress(address);
    const payment = validatePaymentMethod(paymentMethodId);

    const result: CheckoutValidation = {
      shipping,
      payment,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/checkout/validate]", err);
    return NextResponse.json(
      {
        shipping: { valid: false, errors: ["Validation failed"] },
        payment: { valid: false, errors: ["Validation failed"] },
      },
      { status: 500 }
    );
  }
}
