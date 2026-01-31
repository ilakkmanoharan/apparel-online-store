/**
 * Orders API
 *
 * GET /api/orders
 * Returns orders for the authenticated user or by session_id.
 *
 * ## Query Parameters
 * - session_id: Stripe checkout session ID (returns single order)
 * - userId: User ID to fetch orders for (required if no session_id)
 *
 * ## Response
 * - With session_id: Single order object or 404
 * - With userId: Array of orders sorted by createdAt desc
 *
 * ## Order Fields
 * - id: Order ID (same as Stripe session ID)
 * - userId: User ID or "guest"
 * - items: Array of cart items with product details
 * - total: Order total in USD
 * - shippingAddress: Shipping address object
 * - status: Order status (processing, shipped, delivered, refunded, etc.)
 * - paymentStatus: Payment status (paid, pending, refunded)
 * - createdAt: Order creation timestamp
 *
 * @see lib/firebase/orders.ts - Order data access functions
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getOrdersForUser,
  getOrderByStripeSessionId,
} from "@/lib/firebase/orders";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const userId = searchParams.get("userId");

    // If session_id is provided, return single order
    if (sessionId) {
      const order = await getOrderByStripeSessionId(sessionId);

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    }

    // If userId is provided, return user's orders
    if (userId) {
      const orders = await getOrdersForUser(userId);
      return NextResponse.json({ orders });
    }

    // Neither session_id nor userId provided
    return NextResponse.json(
      { error: "Either session_id or userId is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[api/orders] Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
