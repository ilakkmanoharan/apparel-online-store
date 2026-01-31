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
import { Order, CartItem, Address } from "@/types";
import type { CheckoutMetadataItem } from "@/types/checkout";
import { getProductById } from "./products";

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
    status: metadataParseError ? "needs_review" : "processing",
    paymentMethod: "stripe",
    paymentStatus: session.payment_status === "paid" ? "paid" : "pending",
    stripeSessionId: session.id,
    stripeCustomerId: session.customer as string | null,
    createdAt: snap.exists() ? snap.data().createdAt : now,
    updatedAt: now,
    ...(metadataParseError && { metadataParseError: true }),
  };

  await setDoc(ref, baseData, { merge: true });
}

