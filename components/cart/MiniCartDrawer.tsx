"use client";

import LocaleLink from "@/components/common/LocaleLink";
import Drawer from "@/components/common/Drawer";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cartStore";
import CartItemRow from "./CartItemRow";
import CartSummary from "./CartSummary";
import PromoCodeInput from "./PromoCodeInput";

interface MiniCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MiniCartDrawer({ open, onClose }: MiniCartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();
  const t = useTranslations();

  return (
    <Drawer open={open} onClose={onClose} side="right" title={t("cart.title")}>
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p className="mb-4">{t("cart.emptyTitle")}</p>
          <LocaleLink
            href="/"
            onClick={onClose}
            className="inline-block bg-gray-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {t("common.continueShopping")}
          </LocaleLink>
        </div>
      ) : (
        <>
          <div className="space-y-0 divide-y divide-gray-200">
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
          <div className="mt-4 space-y-4">
            <PromoCodeInput />
            <CartSummary subtotal={total} />
            <LocaleLink
              href="/cart"
              onClick={onClose}
              className="block w-full text-center bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t("cart.viewCartCheckout")}
            </LocaleLink>
          </div>
        </>
      )}
    </Drawer>
  );
}
