"use client";

import { useState, useCallback } from "react";

interface ReserveResult {
  reservationId: string;
  expiresAt: string;
}

export function useBopisReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserve = useCallback(
    async (
      userId: string,
      storeId: string,
      productId: string,
      variantKey = "",
      quantity = 1,
      expiresInHours = 24
    ): Promise<ReserveResult | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/bopis/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            storeId,
            productId,
            variantKey,
            quantity,
            expiresInHours,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Reserve failed");
        return { reservationId: data.reservationId, expiresAt: data.expiresAt };
      } catch (e) {
        setError(e instanceof Error ? e.message : "Reserve failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancel = useCallback(async (reservationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bopis/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cancel failed");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancel failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reserve, cancel, loading, error };
}
