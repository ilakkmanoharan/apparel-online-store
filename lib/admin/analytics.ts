import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { DashboardStats, TopProductRow, OrderStatsRow } from "@/types/admin";

const ORDERS_COLLECTION = "orders";

export async function getDashboardStats(period: "day" | "week" | "month"): Promise<DashboardStats> {
  const now = new Date();
  const periodStart = new Date(now);
  if (period === "day") periodStart.setHours(0, 0, 0, 0);
  else if (period === "week") periodStart.setDate(periodStart.getDate() - 7);
  else periodStart.setMonth(periodStart.getMonth() - 1);

  const q = query(
    collection(db, ORDERS_COLLECTION),
    where("createdAt", ">=", periodStart),
    where("paymentStatus", "==", "paid")
  );
  const snap = await getDocs(q);
  let totalRevenue = 0;
  const orderIds: string[] = [];
  snap.docs.forEach((d) => {
    const data = d.data();
    totalRevenue += data.total ?? 0;
    orderIds.push(d.id);
  });

  return {
    totalOrders: snap.size,
    totalRevenue,
    totalProducts: 0, // TODO: count from products collection
    pendingOrders: 0, // TODO: count where status === 'pending'
    period,
    periodStart,
    periodEnd: now,
  };
}

export async function getTopProducts(limitCount = 10): Promise<TopProductRow[]> {
  const q = query(collection(db, ORDERS_COLLECTION), where("paymentStatus", "==", "paid"));
  const snap = await getDocs(q);
  const byProduct: Record<string, { quantity: number; revenue: number; name: string }> = {};
  snap.docs.forEach((d) => {
    const items = d.data().items ?? [];
    items.forEach((item: { product: { id: string; name: string; price: number }; quantity: number }) => {
      const id = item.product?.id ?? "unknown";
      if (!byProduct[id]) byProduct[id] = { quantity: 0, revenue: 0, name: item.product?.name ?? id };
      byProduct[id].quantity += item.quantity;
      byProduct[id].revenue += (item.product?.price ?? 0) * item.quantity;
    });
  });
  return Object.entries(byProduct)
    .map(([productId, data]) => ({ productId, name: data.name, quantitySold: data.quantity, revenue: data.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limitCount);
}

export async function getOrderStatsByDay(days = 7): Promise<OrderStatsRow[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const byDate: Record<string, { orders: number; revenue: number }> = {};
  const start = new Date();
  start.setDate(start.getDate() - days);
  snap.docs.forEach((d) => {
    const data = d.data();
    const created = data.createdAt?.toDate?.() ?? new Date();
    if (created < start) return;
    const key = created.toISOString().slice(0, 10);
    if (!byDate[key]) byDate[key] = { orders: 0, revenue: 0 };
    byDate[key].orders++;
    if (data.paymentStatus === "paid") byDate[key].revenue += data.total ?? 0;
  });
  return Object.entries(byDate).map(([date, data]) => ({ date, orders: data.orders, revenue: data.revenue }));
}
