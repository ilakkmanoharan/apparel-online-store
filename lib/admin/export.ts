import { getAdminDb } from "@/lib/firebase/admin";
import type { Order } from "@/types";

export interface ExportOrdersOptions {
  startDate?: Date;
  endDate?: Date;
  status?: Order["status"];
  limit?: number;
}

/**
 * Fetch orders for CSV export. Uses Admin Firestore.
 */
export async function getOrdersForExport(
  opts: ExportOrdersOptions = {}
): Promise<Order[]> {
  const db = await getAdminDb();
  if (!db) return [];

  let ref: firestore.Query = db.collection("orders");
  if (opts.status) ref = ref.where("status", "==", opts.status);
  ref = ref.orderBy("createdAt", "desc");
  const limit = opts.limit ?? 1000;
  const snap = await ref.limit(limit).get();

  const orders: Order[] = [];
  snap.docs.forEach((d) => {
    const data = d.data();
    const createdAt = data.createdAt?.toDate?.() ?? new Date();
    const updatedAt = data.updatedAt?.toDate?.() ?? new Date();
    if (opts.startDate && createdAt < opts.startDate) return;
    if (opts.endDate && createdAt > opts.endDate) return;
    orders.push({
      id: d.id,
      userId: data.userId,
      items: data.items ?? [],
      total: data.total ?? 0,
      shippingAddress: data.shippingAddress,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      stripeSessionId: data.stripeSessionId,
      stripeCustomerId: data.stripeCustomerId,
      createdAt,
      updatedAt,
    } as Order);
  });
  return orders;
}

const CSV_ESCAPE = (v: string) =>
  /[,"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;

/**
 * Convert orders to CSV string (id, userId, total, status, createdAt).
 */
export function ordersToCsv(orders: Order[]): string {
  const header = "id,userId,total,status,paymentStatus,createdAt";
  const rows = orders.map(
    (o) =>
      [
        o.id,
        o.userId,
        o.total,
        o.status,
        o.paymentStatus,
        o.createdAt.toISOString(),
      ].map(String).map(CSV_ESCAPE).join(",")
  );
  return [header, ...rows].join("\n");
}
