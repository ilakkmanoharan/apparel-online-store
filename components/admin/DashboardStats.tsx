"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/admin/analytics";
import type { DashboardStats as DashboardStatsType } from "@/types/admin";
import StatCard from "./StatCard";
import { formatPrice } from "@/lib/utils";

const PERIODS: { value: DashboardStatsType["period"]; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
];

export default function DashboardStats() {
  const [period, setPeriod] = useState<DashboardStatsType["period"]>("week");
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDashboardStats(period).then(setStats).finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              period === p.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={stats.totalOrders} subtext={stats.period} />
        <StatCard label="Revenue" value={formatPrice(stats.totalRevenue)} subtext={stats.period} />
        <StatCard label="Products" value={stats.totalProducts} />
        <StatCard label="Pending orders" value={stats.pendingOrders} />
      </div>
    </div>
  );
}
