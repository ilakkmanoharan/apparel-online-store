/**
 * Orders Module - Firestore operations and Stripe webhook handling
 *
 * ## Stripe Webhook Integration
 * handleStripeWebhookEvent() is called by the Stripe webhook endpoint when
 * checkout.session.completed event is received. It creates/updates orders
 * based on session metadata.
 *
 * ## Metadata Contract (from app/api/checkout/stripe/route.ts)
 * The checkout route sends these metadata keys to Stripe:
 * - userId: string - User ID or "guest" for guest checkout
 * - items: string - JSON array of CompactCartItem (see below)
 * - shippingAddress?: string - JSON serialized Address
 * - promotionCode?: string - Validated promo code (if applied)
 * - promoDiscountPercent?: string - Discount percentage (if promo applied)
 *
 * ## Compact Items Format
 * Due to Stripe's 500-char limit per metadata value, items are stored as:
 * [{ productId, quantity, selectedSize, selectedColor, price }]
 *
 * This module expands compact items by fetching full product details from DB.
 * Price is preserved from checkout time (not re-fetched) to match paid amount.
 *
 * ## Error Handling
 * - Missing metadata: Order created with guest/empty items, warning logged
 * - Malformed JSON: Order created with status "needs_review", error logged
 * - Product not found: Placeholder product created with checkout-time data
 *
 * @see app/api/checkout/stripe/route.ts - Checkout session creation
 */
import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type Stripe from "stripe";
import { Order, CartItem, Address, Product } from "@/types";
import { CompactCartItem } from "@/types/checkout";
import { getProductById } from "./products";
import { deductForOrder } from "@/lib/inventory/deduct";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";

const ordersCollection = collection(db, "orders");

export async function getOrderById(id: string): Promise<Order | null> {
  const ref = doc(ordersCollection, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;

  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Order;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const q = query(
    ordersCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as any;
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    } as Order;
  });
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await createOrUpdateOrderFromCheckoutSession(session);
  }
}

/**
 * Expand compact cart items from metadata by fetching product details.
 * Compact items contain: productId, quantity, selectedSize, selectedColor, price.
 * We fetch the full product from DB; if not found, create a placeholder product
 * using the price stored at checkout time.
 */
async function expandCompactItems(
  compactItems: CompactCartItem[]
): Promise<CartItem[]> {
  const cartItems: CartItem[] = [];

  for (const item of compactItems) {
    const product = await getProductById(item.productId);

    if (product) {
      // Use the price from checkout time (stored in compact item) to preserve paid amount
      cartItems.push({
        product: {
          ...product,
          price: item.price, // Override with checkout-time price
        },
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    } else {
      // Product not found in DB - create placeholder with checkout-time data.
      // This can happen if product was deleted after checkout.
      console.warn(
        `[orders] Product not found: ${item.productId}; using placeholder`
      );
      const placeholderProduct: Product = {
        id: item.productId,
        name: `[Deleted Product] ${item.productId}`,
        description: "This product is no longer available",
        price: item.price,
        images: [],
        category: "unknown",
        sizes: [item.selectedSize],
        colors: [item.selectedColor],
        inStock: false,
        stockCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      cartItems.push({
        product: placeholderProduct,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    }
  }

  return cartItems;
}

/**
 * Check if parsed items are in compact format (have productId) or full format (have product).
 */
function isCompactFormat(items: unknown[]): items is CompactCartItem[] {
  return (
    items.length > 0 &&
    typeof items[0] === "object" &&
    items[0] !== null &&
    "productId" in items[0] &&
    !("product" in items[0])
  );
}

async function createOrUpdateOrderFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const orderId = session.id;
  const ref = doc(ordersCollection, orderId);
  const snap = await getDoc(ref);

  const amountTotal = (session.amount_total ?? 0) / 100;
  const now = new Date();

  // Phase 8: Log warning when metadata is missing userId or items.
  // This can happen with old sessions or misconfigured clients.
  // Order is still created with fallback values (guest, empty items).
  const metadataMissing =
    !session.metadata ||
    typeof session.metadata.userId === "undefined" ||
    typeof session.metadata.items === "undefined";

  if (metadataMissing) {
    console.warn(
      "[orders] Checkout session missing metadata; order created with guest/empty items",
      session.id
    );
  }

  const userId = (session.metadata?.userId as string) || "guest";

  // Phase 9: Malformed metadata handling.
  // If JSON.parse fails, we save order with status "needs_review" and metadataParseError
  // so payment is not lost; support can fix order details manually.
  let items: CartItem[] = [];
  let shippingAddress: Address | null = null;
  let metadataParseError = false;

  // Parse items from metadata; support both compact and full formats.
  // Compact format: [{ productId, quantity, selectedSize, selectedColor, price }]
  // Full format (legacy): [{ product, quantity, selectedSize, selectedColor }]
  if (session.metadata?.items) {
    try {
      const parsedItems = JSON.parse(session.metadata.items) as unknown[];
      if (isCompactFormat(parsedItems)) {
        items = await expandCompactItems(parsedItems);
      } else {
        // Legacy full format - use as-is
        items = parsedItems as CartItem[];
      }
    } catch (error) {
      console.error(
        "[orders] Failed to parse metadata.items; marking order for review",
        session.id,
        error
      );
      metadataParseError = true;
    }
  }

  // Parse shipping address
  if (session.metadata?.shippingAddress) {
    try {
      shippingAddress = JSON.parse(session.metadata.shippingAddress) as Address;
    } catch (error) {
      console.error(
        "[orders] Failed to parse metadata.shippingAddress; marking order for review",
        session.id,
        error
      );
      metadataParseError = true;
    }
  }

  // Determine order status: needs_review if metadata parse failed, otherwise processing
  const status = metadataParseError ? "needs_review" : "processing";

  // Phase 18: Extract promotion code from metadata for order tracking
  const promotionCode = session.metadata?.promotionCode || null;
  const promoDiscountPercent = session.metadata?.promoDiscountPercent
    ? Number(session.metadata.promoDiscountPercent)
    : null;

  const baseData: Record<string, unknown> = {
    userId,
    items,
    total: amountTotal,
    shippingAddress,
    status,
    paymentMethod: "stripe",
    paymentStatus: session.payment_status === "paid" ? "paid" : "pending",
    stripeSessionId: session.id,
    stripeCustomerId: session.customer as string | null,
    createdAt: snap.exists() ? snap.data().createdAt : now,
    updatedAt: now,
  };

  // Phase 18: Add promotion code to order for reporting/tracking
  if (promotionCode) {
    baseData.promotionCode = promotionCode;
    if (promoDiscountPercent !== null) {
      baseData.promoDiscountPercent = promoDiscountPercent;
    }
  }

  // Add flag for admin to filter orders with parse errors
  if (metadataParseError) {
    baseData.metadataParseError = true;
  }

  await setDoc(ref, baseData, { merge: true });

  // Phase 16: Deduct inventory for order items.
  // Called after order is saved so payment is not lost even if deduction fails.
  // On failure, mark order as "needs_review" for manual intervention.
  if (items.length > 0 && !metadataParseError) {
    try {
      await deductForOrder(items);
    } catch (error) {
      console.error(
        "[orders] Failed to deduct inventory for order; marking for review",
        orderId,
        error
      );
      // Update order status to needs_review so admin can investigate
      await setDoc(
        ref,
        {
          status: "needs_review",
          inventoryDeductionError: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }
  }

  // Phase 17: Send order confirmation email.
  // Uses customer_email or customer_details.email from Stripe session.
  // Errors are logged but do not fail order creation.
  const customerEmail =
    session.customer_email || session.customer_details?.email;

  if (customerEmail && !metadataParseError) {
    try {
      await sendOrderConfirmationEmail(orderId, customerEmail, {
        items,
        total: amountTotal,
        shippingAddress,
        orderDate: now,
      });
    } catch (error) {
      console.error(
        "[orders] Failed to send order confirmation email",
        orderId,
        error
      );
      // Do not fail order creation; email can be resent manually if needed
    }
  } else if (!customerEmail) {
    console.warn(
      "[orders] No customer email available for order confirmation",
      orderId
    );
  }
}

