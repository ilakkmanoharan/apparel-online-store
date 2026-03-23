"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { usePromoStore } from "@/store/promoStore";
import { calculateCartTotals } from "@/lib/cart/calculations";
import { MIN_CART_FOR_FREE_SHIPPING } from "@/lib/constants";

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const discountPercent = usePromoStore((s) => s.discountPercent);

  return useMemo(() => {
    return calculateCartTotals(items, {
      discountPercent: discountPercent ?? 0,
      freeShippingThreshold: MIN_CART_FOR_FREE_SHIPPING,
    });
  }, [items, discountPercent]);
}
