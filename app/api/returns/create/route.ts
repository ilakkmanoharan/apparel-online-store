import { NextResponse } from "next/server";
import { createReturn } from "@/lib/returns/firebase";
import { validateReturnItems } from "@/lib/returns/validation";
import type { ReturnItem } from "@/types/returns";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, orderId, items } = body as { userId: string; orderId: string; items: ReturnItem[] };
    if (!userId || !orderId || !items?.length) {
      return NextResponse.json({ error: "Missing userId, orderId, or items" }, { status: 400 });
    }
    const validation = validateReturnItems(items);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }
    const returnId = await createReturn(userId, orderId, items);
    return NextResponse.json({ returnId });
  } catch (err) {
    console.error("Create return error:", err);
    return NextResponse.json({ error: "Failed to create return" }, { status: 500 });
  }
}
