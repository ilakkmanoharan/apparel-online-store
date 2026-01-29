import { useState, useEffect, useCallback } from "react";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend, isFreeShippingEligible } from "@/lib/loyalty/spend";
import type { SpendTierId } from "@/types/loyalty";

export function useFreeShippingEligible(userId: string | undefined) {
  const [eligible, setEligible] = useState(false);
  const [tierId, setTierId] = useState<SpendTierId | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!userId) {
      setEligible(false);
      setTierId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserSpend(userId)
      .then((s) => {
        const spend = s?.lifetimeSpend ?? 0;
        const tier = getTierBySpend(spend);
        setTierId(tier.id);
        setEligible(isFreeShippingEligible(tier.id));
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { eligible, tierId, loading, refetch };
}
