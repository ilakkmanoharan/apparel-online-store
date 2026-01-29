import { useEffect, useState } from "react";
import type { OrderTrackingInfo } from "@/types/order";

interface UseOrderTrackingOptions {
  orderId: string | null | undefined;
}

interface UseOrderTrackingResult {
  tracking: OrderTrackingInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useOrderTracking({ orderId }: UseOrderTrackingOptions): UseOrderTrackingResult {
  const [tracking, setTracking] = useState<OrderTrackingInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(!!orderId);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!orderId) {
      setTracking(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/tracking`, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to load tracking (status ${res.status})`);
      }

      const data = (await res.json()) as OrderTrackingInfo;
      setTracking({
        ...data,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : null,
        events: data.events.map((e) => ({
          ...e,
          timestamp: e.timestamp ? new Date(e.timestamp) : undefined,
        })),
      });
    } catch (err) {
      console.error("[useOrderTracking]", err);
      setError(err instanceof Error ? err.message : "Failed to load tracking information.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return {
    tracking,
    loading,
    error,
    refresh: load,
  };
}

