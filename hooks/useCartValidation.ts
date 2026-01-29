"use client";

import { useState, useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import { validateCart } from "@/lib/cart/validation";
import type { CartValidationResult } from "@/types/cart";

export function useCartValidation() {
  const items = useCartStore((s) => s.items);
  const [result, setResult] = useState<CartValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        return data as CartValidationResult;
      }
      const localResult = validateCart(items);
      setResult(localResult);
      return localResult;
    } catch {
      const localResult = validateCart(items);
      setResult(localResult);
      return localResult;
    } finally {
      setLoading(false);
    }
  }, [items]);

  const validateLocal = useCallback(() => {
    const localResult = validateCart(items);
    setResult(localResult);
    return localResult;
  }, [items]);

  return {
    result,
    loading,
    validate,
    validateLocal,
  };
}
