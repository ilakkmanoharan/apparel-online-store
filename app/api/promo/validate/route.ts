import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo/validatePromo";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Promo code is required." },
        { status: 400 }
      );
    }

    const result = validatePromoCode(code, subtotal);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/promo/validate POST]", err);
    return NextResponse.json(
      { error: "Failed to validate promo" },
      { status: 500 }
    );
  }
}
