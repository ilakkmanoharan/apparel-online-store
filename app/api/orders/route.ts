import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/firebase/orders";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders?session_id=<stripeSessionId>
 * Returns the order created from the given Stripe checkout session.
 * Order doc ID equals the session ID; no separate Firestore query is needed.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const order = await getOrderById(sessionId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("[api/orders GET]", err);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
  }
}
