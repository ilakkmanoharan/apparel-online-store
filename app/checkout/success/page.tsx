"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";

/**
 * Inner component that uses useSearchParams.
 * Must be wrapped in Suspense for Next.js 14+.
 */
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return <OrderConfirmation sessionId={sessionId ?? undefined} />;
}

/**
 * Checkout Success Page
 *
 * Displays order confirmation after successful Stripe checkout.
 * Reads session_id from URL params and fetches order details.
 *
 * URL: /checkout/success?session_id={CHECKOUT_SESSION_ID}
 */
export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense
        fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
