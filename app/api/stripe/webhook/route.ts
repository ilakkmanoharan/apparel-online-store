import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { handleStripeWebhookEvent } from "@/lib/firebase/orders";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set. " +
        "Set it from Stripe Dashboard → Developers → Webhooks."
    );
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const bodyBuffer = Buffer.from(await req.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      bodyBuffer,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error("[stripe/webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await handleStripeWebhookEvent(event);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[stripe/webhook] Error handling event:", err);
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 });
  }
}

