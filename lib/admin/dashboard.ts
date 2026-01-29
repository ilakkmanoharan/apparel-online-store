import { getAdminDb } from "@/lib/firebase/admin";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getAdminDb();
  if (!db) return { totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 };
  const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
    db.collection("orders").get(),
    db.collection("products").get(),
    db.collection("users").get(),
  ]);
  let totalRevenue = 0;
  ordersSnap.docs.forEach((d) => {
    const data = d.data();
    totalRevenue += (data.total as number) ?? 0;
  });
  return {
    totalOrders: ordersSnap.size,
    totalRevenue,
    totalProducts: productsSnap.size,
    totalUsers: usersSnap.size,
  };
}
