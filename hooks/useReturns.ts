import { useState, useEffect, useCallback } from "react";
import { getReturnsByUser } from "@/lib/returns/firebase";
import type { ReturnRequest } from "@/types/returns";

export function useReturns(userId: string | undefined) {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    getReturnsByUser(userId)
      .then(setReturns)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setReturns([]);
      setLoading(false);
      return;
    }
    refetch();
  }, [userId, refetch]);

  return { returns, loading, error, refetch };
}
