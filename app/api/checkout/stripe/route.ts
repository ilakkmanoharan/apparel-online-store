import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { CartItem, Address } from "@/types";

interface CheckoutRequestBody {
  items: CartItem[];
  userId?: string;
  shippingAddress?: Address;
  successUrl?: string;
  cancelUrl?: string;
}

const DEFAULT_SUCCESS_PATH = "/checkout/success";
const DEFAULT_CANCEL_PATH = "/checkout/cancel";

// Stripe metadata limits: 500 chars per value, 50 keys max.
// We use keys: userId, items, shippingAddress.
const STRIPE_METADATA_VALUE_LIMIT = 500;

/**
 * Get base URL for success/cancel redirects.
 * NEXT_PUBLIC_BASE_URL must be set in production for correct redirects.
 * Falls back to localhost:3000 for local development.
 */
function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

/**
 * Validate that a URL is same-origin to prevent open redirect vulnerabilities.
 * Returns true if URL is same-origin or a relative path.
 */
function isSameOrigin(url: string, baseUrl: string): boolean {
  // Allow relative paths
  if (url.startsWith("/")) return true;
  try {
    const urlObj = new URL(url);
    const baseObj = new URL(baseUrl);
    return urlObj.origin === baseObj.origin;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for checkout" },
        { status: 400 }
      );
    }

    for (const item of body.items) {
      if (!item?.product?.id) {
        return NextResponse.json(
          { error: "Invalid items: product id required" },
          { status: 400 }
        );
      }

      // Coerce quantity to integer; reject if < 1
      item.quantity = Math.floor(Number(item.quantity));
      if (item.quantity < 1) {
        return NextResponse.json(
          { error: "Invalid items: quantity must be at least 1" },
          { status: 400 }
        );
      }

      if (
        item.product.sizes &&
        item.product.sizes.length > 0 &&
        !item.product.sizes.includes(item.selectedSize)
      ) {
        return NextResponse.json(
          { error: "Invalid items: selectedSize must be one of product.sizes" },
          { status: 400 }
        );
      }

      if (
        item.product.colors &&
        item.product.colors.length > 0 &&
        !item.product.colors.includes(item.selectedColor)
      ) {
        return NextResponse.json(
          { error: "Invalid items: selectedColor must be one of product.colors" },
          { status: 400 }
        );
      }
    }

    const SHIPPING_REQUIRED = ["fullName", "street", "city", "state", "zipCode", "country"] as const;
    if (body.shippingAddress) {
      for (const key of SHIPPING_REQUIRED) {
        const value = body.shippingAddress[key];
        if (typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            { error: `Invalid shippingAddress: ${key} is required` },
            { status: 400 }
          );
        }
      }
    }

    // Validate userId when provided; must be non-empty string
    if (body.userId != null) {
      if (typeof body.userId !== "string" || !body.userId.trim()) {
        return NextResponse.json(
          { error: "Invalid userId: must be non-empty string" },
          { status: 400 }
        );
      }
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

    // Build metadata for webhook to create order (userId, items, shippingAddress).
    // Strategy for Stripe's 500-char limit per metadata value:
    // - Use compact items representation (productId, quantity, size, color, price).
    // - Webhook re-fetches full product details from DB if needed.
    // - Price is stored at checkout time to preserve the paid amount.
    // - If compact items still exceed 500 chars, return 400 (cart too large).
    const metaUserId = body.userId?.trim() || "guest";

    // Compact items: only essential fields for order creation
    const compactItems = body.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      price: item.product.price,
    }));
    const itemsJson = JSON.stringify(compactItems);

    if (itemsJson.length > STRIPE_METADATA_VALUE_LIMIT) {
      return NextResponse.json(
        { error: "Cart too large for checkout; please reduce items" },
        { status: 400 }
      );
    }

    const metadata: Record<string, string> = {
      userId: metaUserId,
      items: itemsJson,
    };

    if (body.shippingAddress) {
      const addressJson = JSON.stringify(body.shippingAddress);
      if (addressJson.length > STRIPE_METADATA_VALUE_LIMIT) {
        return NextResponse.json(
          { error: "Shipping address too large; please shorten field values" },
          { status: 400 }
        );
      }
      metadata.shippingAddress = addressJson;
    }

    // Validate client-provided URLs are same-origin to prevent open redirect
    if (body.successUrl && !isSameOrigin(body.successUrl, baseUrl)) {
      return NextResponse.json(
        { error: "Invalid successUrl: must be same-origin" },
        { status: 400 }
      );
    }
    if (body.cancelUrl && !isSameOrigin(body.cancelUrl, baseUrl)) {
      return NextResponse.json(
        { error: "Invalid cancelUrl: must be same-origin" },
        { status: 400 }
      );
    }

    // Build redirect URLs:
    // - success_url includes {CHECKOUT_SESSION_ID} so success page can load order details
    // - cancel_url points to checkout cancel page
    // - Client can override with same-origin URLs if needed
    const successUrl =
      body.successUrl || `${baseUrl}${DEFAULT_SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = body.cancelUrl || `${baseUrl}${DEFAULT_CANCEL_PATH}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
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

