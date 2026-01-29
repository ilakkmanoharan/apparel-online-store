import type { UserCoupon, UserCouponType } from "@/types/userCoupon";
import type { ShippingHabit } from "@/types/userPreferences";

export interface UserCouponValidationResult {
  valid: boolean;
  message?: string;
  discountAmount?: number;
  discountPercent?: number;
  freeShipping?: boolean;
}

export function validateUserCoupon(
  coupon: UserCoupon | null,
  cartSubtotal: number,
  shippingHabit?: ShippingHabit
): UserCouponValidationResult {
  if (!coupon) return { valid: false, message: "Invalid or expired coupon." };
  if (coupon.expiresAt && new Date() > coupon.expiresAt) return { valid: false, message: "Coupon has expired." };
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return { valid: false, message: "Coupon limit reached." };
  if (coupon.minOrder != null && cartSubtotal < coupon.minOrder) {
    return { valid: false, message: `Minimum order of $${coupon.minOrder} required.` };
  }
  if (coupon.shippingHabit && shippingHabit && coupon.shippingHabit !== shippingHabit) {
    return { valid: false, message: "This coupon is for your selected shipping preference." };
  }
  if (coupon.type === "percent") {
    const discountAmount = Math.min(coupon.value / 100 * cartSubtotal, coupon.value >= 100 ? cartSubtotal : cartSubtotal * (coupon.value / 100));
    return { valid: true, discountPercent: coupon.value, discountAmount };
  }
  if (coupon.type === "fixed") {
    const discountAmount = Math.min(coupon.value, cartSubtotal);
    return { valid: true, discountAmount };
  }
  if (coupon.type === "free_shipping") {
    return { valid: true, freeShipping: true };
  }
  return { valid: false, message: "Invalid coupon type." };
}
