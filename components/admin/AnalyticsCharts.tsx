"use client";

import { useEffect, useState } from "react";
import { getTopProducts, getOrderStatsByDay } from "@/lib/admin/analytics";
import type { TopProductRow, OrderStatsRow } from "@/types/admin";
import SimpleBarChart from "./SimpleBarChart";
import SimpleLineChart from "./SimpleLineChart";

export default function AnalyticsCharts() {
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStatsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTopProducts(10), getOrderStatsByDay(14)]).then(([products, stats]) => {
      setTopProducts(products);
      setOrderStats(stats.sort((a, b) => a.date.localeCompare(b.date)));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  const productChartData = topProducts.map((p) => ({ label: p.name.slice(0, 20), value: p.revenue }));
  const orderChartData = orderStats.map((s) => ({ date: s.date.slice(5), value: s.revenue }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top products by revenue</h3>
        <SimpleBarChart data={productChartData} valueLabel="currency" />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue by day</h3>
        <SimpleLineChart data={orderChartData} valueLabel="currency" />
      </div>
    </div>
  );
}
