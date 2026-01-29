"use client";

import { cn } from "@/lib/utils";

interface PaymentStepProps {
  paymentMethodId: string | null;
  onPaymentMethodChange?: (id: string) => void;
  children?: React.ReactNode;
  error?: string;
  className?: string;
}

export default function PaymentStep({
  paymentMethodId,
  children,
  error,
  className,
}: PaymentStepProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
      {children ?? (
        <p className="text-sm text-gray-500">
          Payment is collected securely at the next step via Stripe Checkout.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
