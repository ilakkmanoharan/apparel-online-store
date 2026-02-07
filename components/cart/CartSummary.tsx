"use client";

import { useTranslations } from "@/hooks/useTranslations";
import { useI18n } from "@/components/common/I18nProvider";
import { getCurrencyForLocale } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import { usePromoStore } from "@/store/promoStore";

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const { code, discountPercent, applyDiscount } = usePromoStore();
  const discountAmount = discountPercent > 0 ? subtotal * (discountPercent / 100) : 0;
  const total = applyDiscount(subtotal);
  const { locale } = useI18n();
  const currency = getCurrencyForLocale(locale);
  const t = useTranslations();

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{t("cart.subtotal")}</span>
        <span>{formatPrice(subtotal, currency, locale)}</span>
      </div>
      {code && discountPercent > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>{t("cart.discount")} ({code})</span>
          <span>-{formatPrice(discountAmount, currency, locale)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-gray-900 pt-2">
        <span>{t("cart.total")}</span>
        <span>{formatPrice(total, currency, locale)}</span>
      </div>
    </div>
  );
}
