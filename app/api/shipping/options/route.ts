import { NextResponse } from "next/server";
import { getShippingOptions } from "@/lib/shipping/options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subtotal = Number(searchParams.get("subtotal")) || 0;
    const options = getShippingOptions(subtotal);
    return NextResponse.json(options);
  } catch (err) {
    console.error("Shipping options error:", err);
    return NextResponse.json({ error: "Failed to get shipping options" }, { status: 500 });
  }
}
