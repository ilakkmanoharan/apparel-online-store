/**
 * Orders Module - Firestore operations and Stripe webhook handling
 *
 * ## Stripe Webhook Integration
 * handleStripeWebhookEvent() is called by the Stripe webhook endpoint for:
 * - checkout.session.completed: Create order from checkout session
 * - charge.refunded: Update order status to refunded
 * - charge.dispute.created: Update order status to disputed
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
import { restoreForOrder } from "@/lib/inventory/restore";
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

/**
 * Phase 23: Get order by Stripe session ID.
 * Used by success page to display order confirmation.
 * The order ID is the same as the Stripe session ID.
 */
export async function getOrderByStripeSessionId(
  sessionId: string
): Promise<Order | null> {
  // Order ID is the Stripe session ID (set in createOrUpdateOrderFromCheckoutSession)
  return getOrderById(sessionId);
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await createOrUpdateOrderFromCheckoutSession(session);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await handleChargeRefunded(charge);
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      await handleDisputeCreated(dispute);
      break;
    }

    default:
      // Unhandled event type - log for debugging
      console.log(`[orders] Unhandled webhook event type: ${event.type}`);
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
    stripePaymentIntentId: session.payment_intent as string | null,
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

  // Phase 25: Structured logging for analytics - no PII, only IDs and counts.
  console.log(
    JSON.stringify({
      event: "order_created",
      orderId,
      sessionId: session.id,
      itemCount: items.length,
      total: amountTotal,
      status,
      hasShipping: !!shippingAddress,
      hasPromo: !!promotionCode,
    })
  );

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

/**
 * Find an order by Stripe payment intent ID.
 * Used for refund and dispute handling.
 */
async function findOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<{ id: string; data: Record<string, unknown> } | null> {
  const q = query(
    ordersCollection,
    where("stripePaymentIntentId", "==", paymentIntentId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, data: docSnap.data() as Record<string, unknown> };
}

/**
 * Phase 21: Handle charge.refunded webhook event.
 * Updates order status to "refunded" or "partially_refunded".
 * Phase 22: Restores inventory for full refunds.
 */
async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId = charge.payment_intent as string;

  if (!paymentIntentId) {
    console.warn(
      "[orders] charge.refunded event missing payment_intent",
      charge.id
    );
    return;
  }

  const order = await findOrderByPaymentIntentId(paymentIntentId);

  if (!order) {
    console.warn(
      "[orders] No order found for payment_intent in charge.refunded",
      paymentIntentId
    );
    return;
  }

  const now = new Date();
  const refundedAmount = charge.amount_refunded / 100;
  const totalAmount = charge.amount / 100;

  // Determine if full or partial refund
  const isFullRefund = charge.refunded && charge.amount_refunded === charge.amount;
  const newStatus = isFullRefund ? "refunded" : "partially_refunded";

  const ref = doc(ordersCollection, order.id);
  await setDoc(
    ref,
    {
      status: newStatus,
      paymentStatus: isFullRefund ? "refunded" : "partially_refunded",
      refundedAmount,
      refundedAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  console.log(
    `[orders] Order ${order.id} marked as ${newStatus}:`,
    `$${refundedAmount} of $${totalAmount} refunded`
  );

  // Phase 22: Restore inventory for full refunds.
  // For partial refunds, inventory is not restored automatically
  // (would require knowing which specific items were refunded).
  if (isFullRefund) {
    const orderItems = order.data.items as CartItem[] | undefined;

    if (orderItems && orderItems.length > 0) {
      try {
        await restoreForOrder(orderItems);
        console.log(
          `[orders] Inventory restored for refunded order ${order.id}`
        );
      } catch (error) {
        console.error(
          "[orders] Failed to restore inventory for refunded order; marking for review",
          order.id,
          error
        );
        // Mark order for manual inventory review
        await setDoc(
          ref,
          {
            inventoryRestoreError: true,
            updatedAt: new Date(),
          },
          { merge: true }
        );
      }
    } else {
      console.warn(
        "[orders] Refunded order has no items to restore inventory",
        order.id
      );
    }
  }
}

/**
 * Phase 21: Handle charge.dispute.created webhook event.
 * Updates order status to "disputed" for support investigation.
 */
async function handleDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
  const chargeId = dispute.charge as string;

  if (!chargeId) {
    console.warn(
      "[orders] charge.dispute.created event missing charge",
      dispute.id
    );
    return;
  }

  // Dispute has charge ID, not payment_intent directly.
  // We need to find the order by looking up all orders and checking.
  // For better performance, we could store chargeId on order during checkout,
  // but for now we'll query by the payment_intent from the dispute's payment_intent field.
  const paymentIntentId = dispute.payment_intent as string;

  if (!paymentIntentId) {
    console.warn(
      "[orders] charge.dispute.created event missing payment_intent",
      dispute.id
    );
    return;
  }

  const order = await findOrderByPaymentIntentId(paymentIntentId);

  if (!order) {
    console.warn(
      "[orders] No order found for payment_intent in dispute",
      paymentIntentId
    );
    return;
  }

  const now = new Date();
  const ref = doc(ordersCollection, order.id);

  await setDoc(
    ref,
    {
      status: "disputed",
      disputeId: dispute.id,
      disputeReason: dispute.reason,
      disputeAmount: dispute.amount / 100,
      disputedAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  console.log(
    `[orders] Order ${order.id} marked as disputed:`,
    `Dispute ${dispute.id}, reason: ${dispute.reason}, amount: $${dispute.amount / 100}`
  );
}

