"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/config";

interface RefundRequestButtonProps {
  orderId: string;
  paymentIntentId?: string | null;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export default function RefundRequestButton({
  orderId,
  paymentIntentId,
  disabled,
  onSuccess,
  onError,
}: RefundRequestButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!paymentIntentId) {
      onError?.("No payment information available for refund.");
      return;
    }
    setLoading(true);
    try {
      const token = user ? await auth.currentUser?.getIdToken() : null;
      const res = await fetch("/api/stripe/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ orderId, paymentIntentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Refund request failed");
      onSuccess?.();
    } catch (e) {
      onError?.(e instanceof Error ? e.message : "Refund request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleRequest}
      disabled={disabled || loading || !paymentIntentId}
    >
      {loading ? "Requesting…" : "Request refund"}
    </Button>
  );
}
