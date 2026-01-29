import { NextResponse } from "next/server";
import { getDeliveryEstimate } from "@/lib/shipping/options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minDays = Number(searchParams.get("minDays")) || 5;
    const maxDays = Number(searchParams.get("maxDays")) || 7;
    const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date();
    const estimate = getDeliveryEstimate({ minDays, maxDays }, from);
    return NextResponse.json(estimate);
  } catch (err) {
    console.error("Delivery estimate error:", err);
    return NextResponse.json({ error: "Failed to get estimate" }, { status: 500 });
  }
}
