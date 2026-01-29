"use client";

import type { PaymentMethod, PaymentMethodType } from "@/types/payment";

interface PaymentMethodSelectProps {
  value: PaymentMethodType;
  onChange: (type: PaymentMethodType) => void;
  savedMethods?: PaymentMethod[];
  disabled?: boolean;
}

export default function PaymentMethodSelect({
  value,
  onChange,
  savedMethods = [],
  disabled,
}: PaymentMethodSelectProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Payment method</h3>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            checked={value === "card"}
            onChange={() => onChange("card")}
            disabled={disabled}
          />
          Card
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            checked={value === "paypal"}
            onChange={() => onChange("paypal")}
            disabled={disabled}
          />
          PayPal
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            checked={value === "apple_pay"}
            onChange={() => onChange("apple_pay")}
            disabled={disabled}
          />
          Apple Pay
        </label>
        {savedMethods.length > 0 && (
          <div className="ml-4 text-sm text-gray-600">
            {savedMethods.length} saved card(s)
          </div>
        )}
      </div>
    </div>
  );
}
