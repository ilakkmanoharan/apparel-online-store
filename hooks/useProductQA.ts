"use client";

import { useEffect, useState, useCallback } from "react";
import type { QAPair } from "@/types/qa";

interface UseProductQAOptions {
  productId: string | null | undefined;
  limit?: number;
}

interface UseProductQAResult {
  items: QAPair[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  submitQuestion: (question: string) => Promise<void>;
}

export function useProductQA({
  productId,
  limit = 20,
}: UseProductQAOptions): UseProductQAResult {
  const [items, setItems] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!productId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/products/${productId}/qa?limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to load Q&A");
      const data = (await res.json()) as { items: QAPair[] };
      const parsed = (data.items ?? []).map((item) => ({
        ...item,
        askedAt: item.askedAt ? new Date(item.askedAt) : new Date(),
        answeredAt: item.answeredAt ? new Date(item.answeredAt) : null,
      }));
      setItems(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Q&A");
    } finally {
      setLoading(false);
    }
  }, [productId, limit]);

  const submitQuestion = useCallback(
    async (question: string) => {
      if (!productId) return;
      const res = await fetch(`/api/products/${productId}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Failed to submit");
      }
      await load();
    },
    [productId, load]
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { items, loading, error, refresh: load, submitQuestion };
}
