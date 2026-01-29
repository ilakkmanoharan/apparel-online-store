"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { usePromoStore } from "@/store/promoStore";
import { calculateCartTotals } from "@/lib/cart/calculations";
import { MIN_CART_FOR_FREE_SHIPPING } from "@/lib/constants";

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const appliedPromo = usePromoStore((s) => s.appliedPromo);

  return useMemo(() => {
    const discountPercent = appliedPromo?.discountPercent ?? 0;
    return calculateCartTotals(items, {
      discountPercent,
      freeShippingThreshold: MIN_CART_FOR_FREE_SHIPPING,
    });
  }, [items, appliedPromo?.discountPercent]);
}
