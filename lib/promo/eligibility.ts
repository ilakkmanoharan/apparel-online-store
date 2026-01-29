import type { CartItem } from "@/types";

export interface PromoEligibility {
  eligible: boolean;
  reason?: string;
  minOrder?: number;
  discountPercent?: number;
}

export function checkPromoEligibility(
  code: string,
  cartSubtotal: number,
  minOrder?: number | null
): PromoEligibility {
  if (minOrder != null && cartSubtotal < minOrder) {
    return {
      eligible: false,
      reason: `Minimum order of $${minOrder} required.`,
      minOrder,
    };
  }
  return { eligible: true };
}

export function getApplicableDiscountPercent(
  code: string,
  discountPercent: number,
  cartSubtotal: number,
  minOrder?: number | null
): number {
  const eligibility = checkPromoEligibility(code, cartSubtotal, minOrder);
  if (!eligibility.eligible) return 0;
  return discountPercent;
}
