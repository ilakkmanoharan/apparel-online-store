import { useState, useEffect, useCallback } from "react";
import { getDashboardStats, getTopProducts, getOrderStatsByDay } from "@/lib/admin/analytics";
import type { DashboardStats, TopProductRow, OrderStatsRow } from "@/types/admin";

export function useAdminAnalytics(period: "day" | "week" | "month" = "week") {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    Promise.all([
      getDashboardStats(period),
      getTopProducts(10),
      getOrderStatsByDay(period === "day" ? 1 : period === "week" ? 7 : 30),
    ])
      .then(([s, products, orders]) => {
        setStats(s);
        setTopProducts(products);
        setOrderStats(orders.sort((a, b) => a.date.localeCompare(b.date)));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [period]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { stats, topProducts, orderStats, loading, error, refetch };
}
