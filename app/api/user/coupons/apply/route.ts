import { NextResponse } from "next/server";
import { getUserCouponByCode } from "@/lib/userCoupons/firebase";
import { validateUserCoupon } from "@/lib/userCoupons/validate";
import { getUserPreferences } from "@/lib/firebase/userPreferences";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, code, cartSubtotal } = body as { userId: string; code: string; cartSubtotal: number };
    if (!userId || !code || cartSubtotal == null) {
      return NextResponse.json({ error: "Missing userId, code, or cartSubtotal" }, { status: 400 });
    }
    const coupon = await getUserCouponByCode(userId, code);
    const prefs = await getUserPreferences(userId);
    const shippingHabit = prefs?.shippingHabit;
    const result = validateUserCoupon(coupon, cartSubtotal, shippingHabit);
    if (!result.valid) {
      return NextResponse.json({ valid: false, message: result.message }, { status: 200 });
    }
    return NextResponse.json({
      valid: true,
      discountAmount: result.discountAmount,
      discountPercent: result.discountPercent,
      freeShipping: result.freeShipping,
    });
  } catch (err) {
    console.error("Apply coupon error:", err);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}
