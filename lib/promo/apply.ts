import type { CartItem } from "@/types";
import type { PromoValidationResult } from "./types";

export interface AppliedPromoResult {
  discountAmount: number;
  subtotalAfterDiscount: number;
  discountPercent?: number;
  discountFixed?: number;
}

/**
 * Apply a validated promo to cart subtotal.
 * Returns discount amount and subtotal after discount.
 */
export function applyPromoToSubtotal(
  subtotal: number,
  validation: PromoValidationResult
): AppliedPromoResult {
  if (!validation.valid) {
    return { discountAmount: 0, subtotalAfterDiscount: subtotal };
  }

  let discountAmount = 0;

  if (validation.discountPercent != null && validation.discountPercent > 0) {
    discountAmount = (subtotal * validation.discountPercent) / 100;
  }
  if (validation.discountFixed != null && validation.discountFixed > 0) {
    discountAmount = Math.max(discountAmount, Math.min(validation.discountFixed, subtotal));
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

  return {
    discountAmount,
    subtotalAfterDiscount,
    discountPercent: validation.discountPercent,
    discountFixed: validation.discountFixed,
  };
}

/**
 * Compute cart subtotal from items (sum of price * quantity).
 */
export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}
