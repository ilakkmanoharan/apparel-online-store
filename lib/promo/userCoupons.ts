import { getUserCoupons } from "@/lib/userCoupons/firebase";
import type { UserCoupon } from "@/types/userCoupon";
import type { ShippingHabit } from "@/types/userPreferences";

/** Return coupons eligible for user; optionally filter by shipping habit. */
export async function getEligibleCouponsForUser(
  userId: string,
  shippingHabit?: ShippingHabit
): Promise<UserCoupon[]> {
  const all = await getUserCoupons(userId);
  const now = new Date();
  return all.filter((c) => {
    if (c.expiresAt && c.expiresAt < now) return false;
    if (c.maxUses != null && c.usedCount >= c.maxUses) return false;
    if (shippingHabit && c.shippingHabit && c.shippingHabit !== shippingHabit) return false;
    return true;
  });
}
