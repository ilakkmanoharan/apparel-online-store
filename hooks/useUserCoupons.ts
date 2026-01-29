import { useState, useEffect, useCallback } from "react";
import { getUserCoupons } from "@/lib/userCoupons/firebase";
import type { UserCoupon } from "@/types/userCoupon";

export function useUserCoupons(userId: string | undefined) {
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    if (!userId) {
      setCoupons([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserCoupons(userId)
      .then(setCoupons)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { coupons, loading, error, refetch };
}
