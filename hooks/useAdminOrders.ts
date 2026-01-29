import { useState, useEffect, useCallback } from "react";
import { listAdminOrders } from "@/lib/admin/orders";
import type { Order } from "@/types";

export function useAdminOrders(opts: { limit?: number; status?: Order["status"] } = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    listAdminOrders(opts)
      .then(setOrders)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [opts.limit, opts.status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { orders, loading, error, refetch };
}
