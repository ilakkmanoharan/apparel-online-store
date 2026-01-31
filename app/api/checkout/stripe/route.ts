import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { CartItem, Address } from "@/types";
import { getProductById } from "@/lib/firebase/products";
import type { CheckoutMetadataItem } from "@/types/checkout";

/**
 * POST /api/checkout/stripe — creates a Stripe Checkout Session.
 *
 * Request body:
 *   items            CartItem[]   Required. Products, quantities, and selections.
 *   userId          string?      Optional. Authenticated user id; defaults to "guest".
 *   shippingAddress  Address?     Optional. Validated when present (see @/types Address).
 *   successUrl       string?      Optional. Must be same-origin; defaults to /checkout/success.
 *   cancelUrl        string?      Optional. Must be same-origin; defaults to /checkout/cancel.
 *
 * Stripe session metadata (read by webhook to create the order):
 *   userId          string       Trimmed user id or "guest".
 *   items            string       JSON — compact array: [{ productId, quantity, selectedSize, selectedColor, price }].
 *                                 Webhook re-fetches full product details from DB. See lib/firebase/orders.ts.
 *   shippingAddress  string?      JSON of Address. Omitted when no address provided.
 *
 * Validation order: items shape → shipping address → userId → URL origin →
 *   product existence (parallel DB reads) → stock → price match.
 */
interface CheckoutRequestBody {
  items: CartItem[];
  userId?: string;
  shippingAddress?: Address;
  successUrl?: string;
  cancelUrl?: string;
}

const DEFAULT_SUCCESS_PATH = "/checkout/success";
const DEFAULT_CANCEL_PATH = "/checkout/cancel";

// NEXT_PUBLIC_BASE_URL must be set in production for correct success/cancel redirects.
function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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

    if (body.userId != null) {
      if (typeof body.userId !== "string" || !body.userId.trim()) {
        return NextResponse.json(
          { error: "Invalid userId: must be non-empty string" },
          { status: 400 }
        );
      }
    }

    const baseUrl = getBaseUrl();

    if (body.successUrl && !body.successUrl.startsWith(baseUrl)) {
      return NextResponse.json(
        { error: "successUrl must be same-origin" },
        { status: 400 }
      );
    }
    if (body.cancelUrl && !body.cancelUrl.startsWith(baseUrl)) {
      return NextResponse.json(
        { error: "cancelUrl must be same-origin" },
        { status: 400 }
      );
    }

    const fetchedProducts = await Promise.all(
      body.items.map((item) => getProductById(item.product.id))
    );
    for (let i = 0; i < fetchedProducts.length; i++) {
      if (!fetchedProducts[i]) {
        return NextResponse.json(
          { error: `Product not found: ${body.items[i].product.id}` },
          { status: 400 }
        );
      }
    }

    for (let i = 0; i < fetchedProducts.length; i++) {
      const product = fetchedProducts[i]!;
      if (!product.inStock || body.items[i].quantity > (product.stockCount ?? 0)) {
        return NextResponse.json(
          {
            error: `Insufficient stock for product ${product.id}: requested ${body.items[i].quantity}, available ${product.stockCount ?? 0}`,
          },
          { status: 400 }
        );
      }

      // Price must match server to prevent client manipulation; exact match required.
      if (body.items[i].product.price !== product.price) {
        return NextResponse.json(
          {
            error: `Price mismatch for product ${product.id}: expected ${product.price}, got ${body.items[i].product.price}`,
          },
          { status: 400 }
        );
      }
    }

    const lineItems = body.items.map((item, i) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: fetchedProducts[i]!.name,
          images: fetchedProducts[i]!.images?.slice(0, 1),
        },
        unit_amount: Math.round(fetchedProducts[i]!.price * 100),
      },
      quantity: item.quantity,
    }));

    // Stripe metadata: max 500 chars per value, 50 keys. We use 3 keys:
    // userId, items, shippingAddress.
    // Strategy (Option B — compact): items stores only the fields needed to
    // reconstruct order lines; webhook re-fetches product details (name, images)
    // from DB. Price is included here to capture the amount actually charged.
    const metaUserId =
      body.userId && body.userId.trim() ? body.userId.trim() : "guest";
    const compactItems: CheckoutMetadataItem[] = body.items.map((item, i) => ({
      productId: item.product.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      price: fetchedProducts[i]!.price,
    }));
    const metaItems = JSON.stringify(compactItems);
    if (metaItems.length > 500) {
      return NextResponse.json(
        { error: "Cart too large for checkout; please reduce items" },
        { status: 400 }
      );
    }
    const metadata: Record<string, string> = {
      userId: metaUserId,
      items: metaItems,
    };
    if (body.shippingAddress) {
      metadata.shippingAddress = JSON.stringify(body.shippingAddress);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url:
        body.successUrl || `${baseUrl}${DEFAULT_SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl || `${baseUrl}${DEFAULT_CANCEL_PATH}`,
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

