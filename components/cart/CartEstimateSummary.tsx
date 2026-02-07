"use client";

import { useI18n } from "@/components/common/I18nProvider";
import { getCurrencyForLocale } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import type { CartTotals } from "@/types/cart";
import { cn } from "@/lib/utils";

interface CartEstimateSummaryProps {
  totals: CartTotals;
  className?: string;
}

export default function CartEstimateSummary({ totals, className }: CartEstimateSummaryProps) {
  const { locale } = useI18n();
  const currency = getCurrencyForLocale(locale);

  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatPrice(totals.subtotal, currency, locale)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Shipping (estimate)</span>
        <span>{totals.shippingEstimate === 0 ? "Free" : formatPrice(totals.shippingEstimate, currency, locale)}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Tax (estimate)</span>
        <span>{formatPrice(totals.taxEstimate, currency, locale)}</span>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-{formatPrice(totals.discount, currency, locale)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
        <span>Estimated total</span>
        <span>{formatPrice(totals.total, currency, locale)}</span>
      </div>
    </div>
  );
}
