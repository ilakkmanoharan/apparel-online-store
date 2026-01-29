import { NextRequest, NextResponse } from "next/server";
import { getUserCouponByCode } from "@/lib/userCoupons/firebase";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { code: string };
}

/**
 * GET /api/user/coupons/[code]?userId=...
 * Returns the user's coupon for the given code, or 404.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const code = params.code;
    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const coupon = await getUserCouponByCode(userId, code);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (err) {
    console.error("[api/user/coupons/[code] GET]", err);
    return NextResponse.json(
      { error: "Failed to load coupon" },
      { status: 500 }
    );
  }
}
