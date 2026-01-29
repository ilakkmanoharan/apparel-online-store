"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardStats } from "@/types/admin";

interface UseAdminDashboardOptions {
  period?: "day" | "week" | "month";
}

interface UseAdminDashboardResult {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminDashboard(
  options: UseAdminDashboardOptions = {}
): UseAdminDashboardResult {
  const { period = "week" } = options;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/dashboard?period=${period}`);
      if (!res.ok) throw new Error("Failed to load dashboard");
      const data = (await res.json()) as DashboardStats;
      setStats({
        ...data,
        periodStart: data.periodStart ? new Date(data.periodStart) : new Date(),
        periodEnd: data.periodEnd ? new Date(data.periodEnd) : new Date(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, loading, error, refresh: load };
}
