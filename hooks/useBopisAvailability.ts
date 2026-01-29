"use client";

import { useState, useCallback } from "react";

interface AvailabilityResult {
  available: boolean;
  message?: string;
}

export function useBopisAvailability() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(
    async (
      storeId: string,
      productId: string,
      variantKey = "",
      quantity = 1
    ): Promise<AvailabilityResult> => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          storeId,
          productId,
          variantKey,
          quantity: String(quantity),
        });
        const res = await fetch(`/api/bopis/availability?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Check failed");
        return { available: data.available === true, message: data.message };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Check failed";
        setError(msg);
        return { available: false, message: msg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { checkAvailability, loading, error };
}
