import { useState, useEffect, useCallback } from "react";
import { getUserPreferences } from "@/lib/firebase/userPreferences";
import type { UserPreferences, ShippingHabit } from "@/types/userPreferences";

export function useShippingPreference(userId: string | undefined) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    if (!userId) {
      setPreferences(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserPreferences(userId)
      .then(setPreferences)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const shippingHabit: ShippingHabit = preferences?.shippingHabit ?? "none";

  return { preferences, shippingHabit, loading, error, refetch };
}
