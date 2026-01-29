"use client";

import { useState, useEffect, useCallback } from "react";
import { getReviews } from "@/lib/reviews/firebase";
import type { ProductReview } from "@/types/review";

export function useProductReviews(productId: string | null, opts?: { limit?: number; orderBy?: "createdAt" | "rating" }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(!!productId);

  const refetch = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getReviews(productId, opts);
      setReviews(data);
    } catch (e) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, opts?.limit, opts?.orderBy]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { reviews, loading, refetch };
}
