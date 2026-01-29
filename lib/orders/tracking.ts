import { getAdminDb } from "@/lib/firebase/admin";
import type { Order } from "@/types";
import type { OrderTrackingInfo } from "@/types/order";
import { buildOrderTimeline } from "./status";

export async function getOrderTrackingInfo(orderId: string): Promise<OrderTrackingInfo | null> {
  const db = await getAdminDb();
  if (!db) return null;

  const ref = db.collection("orders").doc(orderId);
  const snap = await ref.get();
  if (!snap.exists) return null;

  const data = snap.data() as any;
  const order: Order = {
    id: snap.id,
    ...(data as any),
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
  };

  const events = buildOrderTimeline(order);

  return {
    orderId: order.id,
    status: order.status,
    carrier: data.carrier ?? undefined,
    trackingNumber: data.trackingNumber ?? undefined,
    estimatedDelivery: data.estimatedDelivery?.toDate?.() ?? null,
    events,
  };
}

