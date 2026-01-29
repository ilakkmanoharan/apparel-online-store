import type { CartItem } from "@/types";
import type { CartTotals } from "@/types/cart";

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return Math.round(subtotal * (discountPercent / 100) * 100) / 100;
}

export function estimateShipping(subtotal: number, freeShippingThreshold: number): number {
  if (subtotal >= freeShippingThreshold) return 0;
  return 5.99;
}

export function estimateTax(subtotal: number, taxRate = 0.08): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

export function calculateCartTotals(
  items: CartItem[],
  options: { discountPercent?: number; freeShippingThreshold?: number; taxRate?: number } = {}
): CartTotals {
  const { discountPercent = 0, freeShippingThreshold = 75, taxRate = 0.08 } = options;
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, discountPercent);
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = estimateShipping(afterDiscount, freeShippingThreshold);
  const tax = estimateTax(afterDiscount + shipping, taxRate);
  const total = Math.round((afterDiscount + shipping + tax) * 100) / 100;

  return {
    subtotal,
    shippingEstimate: shipping,
    taxEstimate: tax,
    discount,
    total,
  };
}
