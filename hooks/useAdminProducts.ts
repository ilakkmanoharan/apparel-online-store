import { useState, useEffect, useCallback } from "react";
import { listAdminProducts } from "@/lib/admin/products";
import type { Product } from "@/types";

export function useAdminProducts(opts: { limit?: number; categoryId?: string } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    listAdminProducts(opts)
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [opts.limit, opts.categoryId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}
