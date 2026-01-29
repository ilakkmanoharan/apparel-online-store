import { NextRequest, NextResponse } from "next/server";
import { reservePickup } from "@/lib/bopis/reservations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId as string;
    const storeId = body.storeId as string;
    const productId = body.productId as string;
    const variantKey = (body.variantKey as string) ?? "";
    const quantity = Math.max(1, parseInt(String(body.quantity ?? 1), 10));
    const expiresInHours = Math.min(72, Math.max(1, parseInt(String(body.expiresInHours ?? 24), 10)));
    if (!userId || !storeId || !productId) {
      return NextResponse.json(
        { error: "userId, storeId, and productId are required" },
        { status: 400 }
      );
    }
    const result = await reservePickup(userId, storeId, productId, variantKey, quantity, expiresInHours);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Reserve failed" },
      { status: 400 }
    );
  }
}
