"use client";

import LocaleLink from "@/components/common/LocaleLink";
import Button from "@/components/common/Button";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import PromoCodeInput from "@/components/cart/PromoCodeInput";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const subtotal = getTotal();
  const t = useTranslations();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">{t("cart.emptyTitle")}</h1>
          <p className="text-gray-600 mb-8">{t("cart.emptyDescription")}</p>
          <LocaleLink href="/">
            <Button>{t("common.continueShopping")}</Button>
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("cart.title")}</h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          {t("cart.clear")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-0 divide-y divide-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
          {items.map((item, index) => (
            <CartItemRow
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
              item={item}
              onUpdateQuantity={(delta) =>
                updateQuantity(
                  item.product.id,
                  item.selectedSize,
                  item.selectedColor,
                  item.quantity + delta
                )
              }
              onRemove={() =>
                removeItem(item.product.id, item.selectedSize, item.selectedColor)
              }
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-4">
            <h2 className="text-xl font-bold">{t("cart.orderSummary")}</h2>
            <PromoCodeInput />
            <CartSummary subtotal={subtotal} />
            <LocaleLink
              href="/checkout"
              className="block w-full text-center bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t("cart.proceedToCheckout")}
            </LocaleLink>
            <LocaleLink
              href="/"
              className="block w-full text-center text-gray-600 hover:text-gray-900 underline text-sm"
            >
              {t("common.continueShopping")}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
