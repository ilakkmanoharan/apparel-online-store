"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import { getCurrencyForLocale } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import { usePromoStore } from "@/store/promoStore";
import { CartItem } from "@/types";
import Image from "next/image";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const { applyDiscount } = usePromoStore();
  const total = applyDiscount(subtotal);
  const { locale } = useI18n();
  const currency = getCurrencyForLocale(locale);
  const t = useTranslations();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">{t("cart.orderSummary")}</h2>
      <ul className="divide-y divide-gray-200 mb-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${item.product.id}-${index}`} className="flex gap-3 py-3">
            <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">-</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <LocaleLink
                href={`/products/${item.product.id}`}
                className="text-sm font-medium text-gray-900 hover:text-gray-600 line-clamp-2"
              >
                {item.product.name}
              </LocaleLink>
              <p className="text-xs text-gray-500">{t("cart.qtyShort", { qty: item.quantity })} - {item.selectedSize} - {item.selectedColor}</p>
            </div>
            <p className="text-sm font-medium text-gray-900 flex-shrink-0">
              {formatPrice(item.product.price * item.quantity, currency, locale)}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t("cart.subtotal")}</span>
          <span>{formatPrice(subtotal, currency, locale)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2">
          <span>{t("cart.total")}</span>
          <span>{formatPrice(total, currency, locale)}</span>
        </div>
      </div>
    </div>
  );
}
