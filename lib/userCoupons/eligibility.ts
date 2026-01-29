import type { UserCoupon } from "@/types/userCoupon";
import type { ShippingHabit } from "@/types/userPreferences";

export interface UserCouponEligibility {
  eligible: boolean;
  message?: string;
  minOrder?: number;
}

/**
 * Check if a user coupon is eligible for use given cart subtotal and optional shipping habit.
 */
export function checkUserCouponEligibility(
  coupon: UserCoupon | null,
  cartSubtotal: number,
  shippingHabit?: ShippingHabit
): UserCouponEligibility {
  if (!coupon) {
    return { eligible: false, message: "Invalid or expired coupon." };
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { eligible: false, message: "Coupon has expired." };
  }

  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { eligible: false, message: "Coupon use limit reached." };
  }

  if (coupon.minOrder != null && cartSubtotal < coupon.minOrder) {
    return {
      eligible: false,
      message: `Minimum order of $${coupon.minOrder} required.`,
      minOrder: coupon.minOrder,
    };
  }

  if (
    coupon.shippingHabit &&
    shippingHabit &&
    coupon.shippingHabit !== shippingHabit
  ) {
    return {
      eligible: false,
      message: "This coupon is for a different shipping preference.",
    };
  }

  return { eligible: true };
}
