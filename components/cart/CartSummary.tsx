"use client";

import { formatPrice } from "@/lib/utils";
import { usePromoStore } from "@/store/promoStore";

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const { code, discountPercent, applyDiscount } = usePromoStore();
  const discountAmount = discountPercent > 0 ? subtotal * (discountPercent / 100) : 0;
  const total = applyDiscount(subtotal);

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {code && discountPercent > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount ({code})</span>
          <span>-{formatPrice(discountAmount)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-gray-900 pt-2">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
