import { collection, doc, getDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Order } from "@/types";

const COLLECTION = "orders";

export async function listAdminOrders(opts: { limit?: number; status?: Order["status"] } = {}): Promise<Order[]> {
  const { limit: limitCount = 50, status } = opts;
  let q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  if (status) q = query(collection(db, COLLECTION), where("status", "==", status), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limitCount).map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      shippingAddress: data.shippingAddress,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      stripeSessionId: data.stripeSessionId,
      stripeCustomerId: data.stripeCustomerId,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    };
  }) as Order[];
}

export async function getAdminOrder(id: string): Promise<Order | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    userId: data.userId,
    items: data.items,
    total: data.total,
    shippingAddress: data.shippingAddress,
    status: data.status,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    stripeSessionId: data.stripeSessionId,
    stripeCustomerId: data.stripeCustomerId,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  } as Order;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: serverTimestamp() });
}
