import { useState, useEffect, useCallback } from "react";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend } from "@/lib/loyalty/spend";
import type { UserSpend } from "@/types/loyalty";

export function useLoyaltySpend(userId: string | undefined) {
  const [userSpend, setUserSpend] = useState<UserSpend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    if (!userId) {
      setUserSpend(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserSpend(userId)
      .then(setUserSpend)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const spend = userSpend?.lifetimeSpend ?? 0;
  const tier = getTierBySpend(spend);

  return { userSpend, spend, tier, loading, error, refetch };
}
