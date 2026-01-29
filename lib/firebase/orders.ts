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

  const now = new Date();

  const baseData = {
    userId,
    items: (session.metadata?.items
      ? (JSON.parse(session.metadata.items) as CartItem[])
      : []) as CartItem[],
    total: amountTotal,
    shippingAddress: (session.metadata?.shippingAddress
      ? (JSON.parse(session.metadata.shippingAddress) as Address)
      : null) as Address | null,
    status: "processing",
    paymentMethod: "stripe",
    paymentStatus: session.payment_status === "paid" ? "paid" : "pending",
    stripeSessionId: session.id,
    stripeCustomerId: session.customer as string | null,
    createdAt: snap.exists() ? snap.data().createdAt : now,
    updatedAt: now,
  };

  await setDoc(ref, baseData, { merge: true });
}

