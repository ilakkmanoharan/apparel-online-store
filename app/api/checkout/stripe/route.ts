/**
 * Stripe Checkout Session API
 *
 * POST /api/checkout/stripe
 *
 * Creates a Stripe Checkout Session for cart payment. After successful payment,
 * Stripe webhook calls lib/firebase/orders.ts to create the order.
 *
 * ## Request Body
 * @see CheckoutRequestBody
 * - items: CartItem[] (required) - Cart items with product, quantity, size, color
 * - userId?: string - User ID or omit for guest checkout (defaults to "guest")
 * - shippingAddress?: Address - Shipping address (validated if provided)
 * - promotionCode?: string - Promo code to validate and apply
 * - idempotencyKey?: string - Unique key to prevent duplicate sessions
 * - successUrl?: string - Custom success redirect (must be same-origin)
 * - cancelUrl?: string - Custom cancel redirect (must be same-origin)
 *
 * ## Rate Limiting (Phase 20)
 * Prevents abuse by limiting checkout attempts:
 * - 10 requests per minute per IP (configurable via CHECKOUT_RATE_LIMIT_IP_MAX)
 * - 5 requests per minute per userId (configurable via CHECKOUT_RATE_LIMIT_USER_MAX)
 * - Returns 429 with Retry-After header when limit exceeded
 *
 * ## Idempotency (Phase 19)
 * To prevent duplicate checkout sessions on retry/double-submit:
 * - Send `Idempotency-Key` header OR `idempotencyKey` in request body
 * - Key should be unique per checkout attempt (e.g., client-generated UUID)
 * - If same key is used within 24 hours, cached session is returned
 * - After 24 hours, key expires and a new session can be created
 *
 * ## Validation (returns 400 on failure)
 * - Product must exist in database
 * - Sufficient stock (quantity <= stockCount)
 * - Price must match server price (prevents manipulation)
 * - Promotion code must be valid (if provided)
 * - URLs must be same-origin (prevents open redirect)
 *
 * ## Stripe Metadata
 * Metadata keys sent to Stripe (read by webhook to create order):
 * - userId: string - User ID or "guest"
 * - items: string - JSON array of compact items (see below)
 * - shippingAddress?: string - JSON serialized Address (if provided)
 * - promotionCode?: string - Validated promo code (if provided)
 *
 * ## Compact Items Format (Stripe 500-char limit strategy)
 * Instead of full CartItem[], metadata.items contains:
 * [{ productId, quantity, selectedSize, selectedColor, price }]
 *
 * Webhook (lib/firebase/orders.ts) re-fetches full product details from DB.
 * Price is stored at checkout time to preserve the paid amount.
 *
 * @see lib/firebase/orders.ts - handleStripeWebhookEvent for order creation
 */
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { CartItem, Address } from "@/types";
import { CompactCartItem } from "@/types/checkout";
import { getProductById } from "@/lib/firebase/products";
import { validatePromoCode } from "@/lib/promo/validatePromo";
import { getCachedSession, setCachedSession } from "@/lib/checkout/idempotency";
import { checkRateLimit, getClientIp } from "@/lib/checkout/rateLimit";

/**
 * Request body for POST /api/checkout/stripe
 *
 * @property items - Cart items (required). Each item needs:
 *   - product: { id, name, price, images?, sizes?, colors? }
 *   - quantity: number (>= 1)
 *   - selectedSize: string (must be in product.sizes if defined)
 *   - selectedColor: string (must be in product.colors if defined)
 * @property userId - Optional user ID. Omit for guest checkout.
 * @property shippingAddress - Optional shipping address.
 * @property promotionCode - Optional promo code to validate and apply.
 * @property idempotencyKey - Optional key to prevent duplicate sessions.
 * @property successUrl - Optional custom success redirect (same-origin only).
 * @property cancelUrl - Optional custom cancel redirect (same-origin only).
 */
interface CheckoutRequestBody {
  items: CartItem[];
  userId?: string;
  shippingAddress?: Address;
  promotionCode?: string;
  idempotencyKey?: string;
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

    // Phase 20: Rate limiting - prevent abuse by limiting checkout attempts.
    // Check both IP and userId limits; returns 429 if either is exceeded.
    const clientIp = getClientIp(req.headers);
    const rateLimitResult = checkRateLimit(clientIp, body.userId);

    if (rateLimitResult.isLimited) {
      console.warn(
        `[checkout/stripe] Rate limit exceeded for ${rateLimitResult.limitType}: ${
          rateLimitResult.limitType === "ip" ? clientIp : body.userId
        }`
      );
      return NextResponse.json(
        { error: "Too many checkout attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfterSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Phase 19: Idempotency check - prevent duplicate sessions on retry/double-submit.
    // Key can come from Idempotency-Key header or idempotencyKey in body.
    const idempotencyKey =
      req.headers.get("Idempotency-Key") || body.idempotencyKey;

    if (idempotencyKey) {
      const cached = getCachedSession(idempotencyKey);
      if (cached) {
        console.log(
          "[checkout/stripe] Returning cached session for idempotency key:",
          idempotencyKey
        );
        return NextResponse.json({
          url: cached.url,
          id: cached.sessionId,
          cached: true,
        });
      }
    }

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

    // Server-side validation: verify all products exist in database.
    // Fetch in parallel for performance; reject if any product not found.
    const productIds = body.items.map((item) => item.product.id);
    const products = await Promise.all(productIds.map((id) => getProductById(id)));

    for (let i = 0; i < products.length; i++) {
      if (!products[i]) {
        return NextResponse.json(
          { error: `Product not found: ${productIds[i]}` },
          { status: 400 }
        );
      }
    }

    // Server-side validation: verify sufficient stock for each item.
    // Uses inStock flag and stockCount from fetched products.
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      const product = products[i]!;
      const available = product.stockCount ?? 0;

      if (!product.inStock || item.quantity > available) {
        return NextResponse.json(
          {
            error: `Insufficient stock for product ${product.id}: requested ${item.quantity}, available ${available}`,
          },
          { status: 400 }
        );
      }
    }

    // Server-side validation: verify price matches server to prevent manipulation.
    // Exact match required; no tolerance. Client must use current server price.
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      const product = products[i]!;
      const clientPrice = item.product.price;
      const serverPrice = product.price;

      if (clientPrice !== serverPrice) {
        return NextResponse.json(
          {
            error: `Price mismatch for product ${product.id}: expected ${serverPrice}, got ${clientPrice}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal for promo validation (server prices)
    const subtotal = body.items.reduce(
      (sum, item, i) => sum + products[i]!.price * item.quantity,
      0
    );

    // Phase 18: Validate promotion code if provided.
    // Returns 400 if code is invalid, expired, or doesn't meet minimum order.
    let validatedPromoCode: string | null = null;
    let promoDiscountPercent: number | undefined;

    if (body.promotionCode) {
      const promoResult = validatePromoCode(body.promotionCode, subtotal);
      if (!promoResult.valid) {
        return NextResponse.json(
          { error: promoResult.message || "Invalid or expired promotion code" },
          { status: 400 }
        );
      }
      validatedPromoCode = body.promotionCode.trim().toUpperCase();
      promoDiscountPercent = promoResult.discountPercent;
    }

    const baseUrl = getBaseUrl();

    // Build Stripe line items using SERVER price (authoritative) for security.
    // Even though we validated prices match, using server price ensures
    // Stripe always charges the correct amount.
    const lineItems = body.items.map((item, i) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: products[i]!.name,
          images: products[i]!.images?.slice(0, 1),
        },
        unit_amount: Math.round(products[i]!.price * 100),
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

    // Compact items: only essential fields for order creation.
    // Uses SERVER price (authoritative) to preserve the actual paid amount.
    // Type shared with webhook (lib/firebase/orders.ts) for consistency.
    const compactItems: CompactCartItem[] = body.items.map((item, i) => ({
      productId: item.product.id,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      price: products[i]!.price,
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

    // Add validated promo code to metadata for order tracking
    if (validatedPromoCode) {
      metadata.promotionCode = validatedPromoCode;
      if (promoDiscountPercent !== undefined) {
        metadata.promoDiscountPercent = String(promoDiscountPercent);
      }
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

    // Phase 18: Enable Stripe promotion codes if a promo was validated.
    // This allows the validated code to be applied at Stripe checkout.
    // User may need to re-enter the code in Stripe UI (allow_promotion_codes).
    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    };

    // Enable promotion code entry in Stripe checkout when a valid promo is provided
    if (validatedPromoCode) {
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Phase 19: Store session in idempotency cache for future requests.
    // Only cache if an idempotency key was provided.
    if (idempotencyKey) {
      setCachedSession(idempotencyKey, session.id, session.url);
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("[checkout/stripe] Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

