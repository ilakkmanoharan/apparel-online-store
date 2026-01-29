"use client";

import { useEffect, useState, useCallback } from "react";
import type { ProductAvailability } from "@/types/inventory";

interface UseProductAvailabilityOptions {
  productId: string | null | undefined;
}

interface UseProductAvailabilityResult {
  availability: ProductAvailability | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProductAvailability({
  productId,
}: UseProductAvailabilityOptions): UseProductAvailabilityResult {
  const [availability, setAvailability] = useState<ProductAvailability | null>(null);
  const [loading, setLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!productId) {
      setAvailability(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/availability`);
      if (!res.ok) {
        if (res.status === 404) {
          setAvailability(null);
          return;
        }
        throw new Error("Failed to load availability");
      }
      const data = (await res.json()) as ProductAvailability;
      setAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { availability, loading, error, refresh: load };
}
