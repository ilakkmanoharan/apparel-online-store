"use client";

import { useSearchParams, useEffect, useState } from "next/navigation";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("session_id");
    setSessionId(id ?? null);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <OrderConfirmation sessionId={sessionId ?? undefined} />
    </div>
  );
}

