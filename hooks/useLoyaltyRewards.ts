"use client";

import { useEffect, useState, useCallback } from "react";
import type { RewardOption } from "@/lib/loyalty/rewards";

interface UseLoyaltyRewardsOptions {
  userId: string | null | undefined;
}

interface UseLoyaltyRewardsResult {
  rewards: RewardOption[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useLoyaltyRewards({
  userId,
}: UseLoyaltyRewardsOptions): UseLoyaltyRewardsResult {
  const [rewards, setRewards] = useState<RewardOption[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setRewards([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/loyalty/rewards?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed to load rewards (${res.status})`);
      }
      const data = (await res.json()) as RewardOption[];
      setRewards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { rewards, loading, error, refresh: load };
}
