import type { PromoValidationResult } from "./types";

const PROMOS: Record<string, { percent: number; minOrder?: number }> = {
  SAVE10: { percent: 10 },
  SAVE20: { percent: 20, minOrder: 50 },
  WELCOME: { percent: 15 },
};

export function validatePromoCode(
  code: string,
  subtotal: number
): PromoValidationResult {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) {
    return { valid: false, message: "Please enter a promo code." };
  }

  const promo = PROMOS[trimmed];
  if (!promo) {
    return { valid: false, message: "Invalid or expired code." };
  }

  if (promo.minOrder != null && subtotal < promo.minOrder) {
    return {
      valid: false,
      message: `Minimum order of $${promo.minOrder} required for this code.`,
    };
  }

  return {
    valid: true,
    discountPercent: promo.percent,
  };
}
