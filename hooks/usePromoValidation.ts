"use client";

import { useState, useCallback } from "react";
import type { PromoValidationResult } from "@/lib/promo/types";

interface UsePromoValidationOptions {
  subtotal: number;
}

interface UsePromoValidationResult {
  validating: boolean;
  error: string | null;
  result: PromoValidationResult | null;
  validate: (code: string) => Promise<PromoValidationResult>;
  reset: () => void;
}

export function usePromoValidation({
  subtotal,
}: UsePromoValidationOptions): UsePromoValidationResult {
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PromoValidationResult | null>(null);

  const validate = useCallback(
    async (code: string): Promise<PromoValidationResult> => {
      const trimmed = code.trim().toUpperCase();
      setValidating(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch("/api/promo/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: trimmed, subtotal }),
        });
        const data = (await res.json()) as PromoValidationResult & { error?: string };
        if (!res.ok) {
          setError(data.message ?? data.error ?? "Validation failed");
          setResult({ valid: false, message: data.message ?? data.error });
          return { valid: false, message: data.message ?? data.error };
        }
        setResult(data);
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to validate promo";
        setError(msg);
        setResult({ valid: false, message: msg });
        return { valid: false, message: msg };
      } finally {
        setValidating(false);
      }
    },
    [subtotal]
  );

  const reset = useCallback(() => {
    setValidating(false);
    setError(null);
    setResult(null);
  }, []);

  return { validating, error, result, validate, reset };
}
