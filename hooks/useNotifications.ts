"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserPreferences } from "@/lib/firebase/userPreferences";
import type { NotificationPrefs } from "@/components/account/NotificationPreferences";

export function useNotifications(userId: string | undefined) {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setPrefs(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getUserPreferences(userId);
      setPrefs({
        orderUpdates: data?.orderUpdates ?? true,
        promos: data?.promos ?? false,
        newArrivals: data?.newArrivals ?? true,
      });
    } catch (e) {
      setPrefs(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { prefs, loading, refetch };
}
