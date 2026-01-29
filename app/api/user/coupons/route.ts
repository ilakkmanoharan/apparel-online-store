import { NextResponse } from "next/server";
import { getUserCoupons } from "@/lib/userCoupons/firebase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const coupons = await getUserCoupons(userId);
    return NextResponse.json(coupons);
  } catch (err) {
    console.error("User coupons error:", err);
    return NextResponse.json({ error: "Failed to get coupons" }, { status: 500 });
  }
}
