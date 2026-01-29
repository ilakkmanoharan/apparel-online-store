import { NextRequest, NextResponse } from "next/server";
import { createRefund } from "@/lib/stripe/refunds";
import { getAdminOrder } from "@/lib/admin/orders";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { stripe } from "@/lib/stripe/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: "Server auth not configured" }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const body = await req.json();
    const { orderId, paymentIntentId: bodyPaymentIntentId } = body as {
      orderId?: string;
      paymentIntentId?: string;
    };

    const order = orderId ? await getAdminOrder(orderId) : null;
    if (!order || order.userId !== userId) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 404 });
    }

    let paymentIntentId = bodyPaymentIntentId ?? (order as { paymentIntentId?: string }).paymentIntentId;
    if (!paymentIntentId && order.stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId, {
          expand: ["payment_intent"],
        });
        const pi = session.payment_intent;
        paymentIntentId = typeof pi === "string" ? pi : pi?.id ?? null;
      } catch {
        paymentIntentId = null;
      }
    }
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "No payment information available for refund" },
        { status: 400 }
      );
    }

    const refund = await createRefund({
      paymentIntentId,
      reason: "requested_by_customer",
      metadata: { orderId: order.id, userId },
    });

    return NextResponse.json({ refundId: refund.id, status: refund.status });
  } catch (error) {
    console.error("[stripe/refund]", error);
    return NextResponse.json(
      { error: "Failed to create refund" },
      { status: 500 }
    );
  }
}
