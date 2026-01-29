"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import DataExportButton from "@/components/admin/DataExportButton";
import { getTopProducts, getOrderStatsByDay } from "@/lib/admin/analytics";
import type { TopProductRow, OrderStatsRow } from "@/types/admin";

export default function AdminAnalyticsPage() {
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTopProducts(20), getOrderStatsByDay(30)]).then(([products, stats]) => {
      setTopProducts(products);
      setOrderStats(stats.sort((a, b) => a.date.localeCompare(b.date)));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-2">
          <DataExportButton data={topProducts} filename="top-products" label="Export products" />
          <DataExportButton data={orderStats} filename="order-stats" label="Export orders" />
        </div>
      </div>
      <DashboardStats />
      {!loading && <AnalyticsCharts />}
    </div>
  );
}
