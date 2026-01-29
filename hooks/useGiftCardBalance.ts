"use client";

import { useState, useCallback } from "react";

export function useGiftCardBalance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const c = code.trim().replace(/\s/g, "").toUpperCase();
      const res = await fetch("/api/gift-cards/balance?code=" + encodeURIComponent(c));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Check failed");
      return { balance: data.balance as number, currency: (data.currency as string) ?? "USD" };
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkBalance, loading, error };
}
