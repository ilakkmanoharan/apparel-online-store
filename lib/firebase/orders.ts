import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import type Stripe from "stripe";
import { Order, CartItem, Address } from "@/types";
import type { CheckoutMetadataItem } from "@/types/checkout";
import { getProductById } from "./products";
import { deductForOrder } from "@/lib/inventory/deduct";
import { restoreForOrder } from "@/lib/inventory/restore";

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

async function getOrderByPaymentIntentId(paymentIntentId: string): Promise<{ id: string } | null> {
  const q = query(
    ordersCollection,
    where("stripePaymentIntentId", "==", paymentIntentId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id };
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await createOrUpdateOrderFromCheckoutSession(session);
  } else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    await handleChargeRefunded(charge);
  } else if (event.type === "charge.dispute.created") {
    const dispute = event.data.object as Stripe.Dispute;
    await handleDisputeCreated(dispute, event.id);
  }
}

async function createOrUpdateOrderFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const orderId = session.id;
  const ref = doc(ordersCollection, orderId);
  const snap = await getDoc(ref);

  const amountTotal = (session.amount_total ?? 0) / 100;
  const userId = (session.metadata?.userId as string) || "guest";

  // Warn when metadata keys are absent so operators can monitor sessions
  // created without proper metadata (legacy or misconfigured clients).
  if (!session.metadata?.userId || !session.metadata?.items) {
    console.warn(
      "[orders] Checkout session missing metadata; order created with guest/empty items",
      session.id
    );
  }

  const now = new Date();
  let metadataParseError = false;

  // Malformed metadata: we save order with status needs_review and
  // metadataParseError so payment is not lost; support can fix order details.
  let parsedItems: CheckoutMetadataItem[] = [];
  try {
    if (session.metadata?.items) {
      parsedItems = JSON.parse(session.metadata.items) as CheckoutMetadataItem[];
    }
  } catch {
    console.error("[orders] Failed to parse metadata.items for session", session.id);
    metadataParseError = true;
  }

  let shippingAddress: Address | null = null;
  try {
    if (session.metadata?.shippingAddress) {
      shippingAddress = JSON.parse(session.metadata.shippingAddress) as Address;
    }
  } catch {
    console.error("[orders] Failed to parse metadata.shippingAddress for session", session.id);
    metadataParseError = true;
  }

  // Reconstruct CartItem[] from compact metadata; fetch full product details
  // from DB. Price is taken from metadata to preserve the amount actually charged.
  const items: CartItem[] = [];
  for (const entry of parsedItems) {
    const product = await getProductById(entry.productId);
    if (!product) {
      console.warn("[orders] Product not found; skipping order line", entry.productId, session.id);
      continue;
    }
    items.push({
      product: { ...product, price: entry.price },
      quantity: entry.quantity,
      selectedSize: entry.selectedSize,
      selectedColor: entry.selectedColor,
    });
  }

  const baseData = {
    userId,
    items,
    total: amountTotal,
    shippingAddress,
    promotionCode: (session.metadata?.promotionCode as string) || null,
    status: metadataParseError ? "needs_review" : "processing",
    paymentMethod: "stripe",
    paymentStatus: session.payment_status === "paid" ? "paid" : "pending",
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent as string | null,
    stripeCustomerId: session.customer as string | null,
    createdAt: snap.exists() ? snap.data().createdAt : now,
    updatedAt: now,
    ...(metadataParseError && { metadataParseError: true }),
  };

  await setDoc(ref, baseData, { merge: true });

  console.log(JSON.stringify({
    event: "order_created",
    orderId,
    sessionId: session.id,
    itemCount: baseData.items.length,
    status: baseData.status,
  }));

  // Deduct stock after order is persisted. On failure the order is already
  // saved (payment succeeded), so we mark it needs_review rather than deleting.
  try {
    await deductForOrder(orderId, items);
  } catch (err) {
    console.error("[orders] Inventory deduction failed; marking order needs_review", orderId, err);
    await setDoc(ref, { status: "needs_review", inventoryDeductError: true }, { merge: true });
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id ?? null;
  if (!paymentIntentId) {
    console.warn("[orders] charge.refunded has no payment_intent; cannot link to order", charge.id);
    return;
  }

  const order = await getOrderByPaymentIntentId(paymentIntentId);
  if (!order) {
    console.warn("[orders] No order found for payment_intent", paymentIntentId, "charge", charge.id);
    return;
  }

  const isFullRefund = charge.amount_refunded === charge.amount;
  const orderRef = doc(ordersCollection, order.id);

  await setDoc(orderRef, {
    status: isFullRefund ? "refunded" : "partially_refunded",
    refundedAt: new Date(),
    updatedAt: new Date(),
  }, { merge: true });

  // Only restore inventory on full refund; partial refund restore is a future phase.
  if (isFullRefund) {
    try {
      const orderSnap = await getDoc(orderRef);
      const items = orderSnap.exists() ? (orderSnap.data().items as CartItem[]) : [];
      await restoreForOrder(order.id, items);
    } catch (err) {
      console.error("[orders] Inventory restore failed; order may need manual stock adjustment", order.id, err);
      await setDoc(orderRef, { inventoryRestoreError: true }, { merge: true });
    }
  }
}

async function handleDisputeCreated(dispute: Stripe.Dispute, eventId: string) {
  const paymentIntentId =
    typeof dispute.payment_intent === "string"
      ? dispute.payment_intent
      : dispute.payment_intent?.id ?? null;
  if (!paymentIntentId) {
    console.warn("[orders] charge.dispute.created has no payment_intent; cannot link to order", dispute.id);
    return;
  }

  const order = await getOrderByPaymentIntentId(paymentIntentId);
  if (!order) {
    console.warn("[orders] No order found for payment_intent", paymentIntentId, "dispute", dispute.id);
    return;
  }

  console.warn("[orders] Dispute created for order", order.id, "event", eventId, "dispute", dispute.id);
  await setDoc(doc(ordersCollection, order.id), {
    status: "disputed",
    updatedAt: new Date(),
  }, { merge: true });
}

