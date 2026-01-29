import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { CartItem } from "@/types";

interface CheckoutRequestBody {
  items: CartItem[];
  successUrl?: string;
  cancelUrl?: string;
}

const DEFAULT_SUCCESS_PATH = "/checkout/success";
const DEFAULT_CANCEL_PATH = "/checkout/cancel";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for checkout" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();

    const lineItems = body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: item.product.images?.slice(0, 1),
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url:
        body.successUrl || `${baseUrl}${DEFAULT_SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl || `${baseUrl}${DEFAULT_CANCEL_PATH}`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("[checkout/stripe] Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

