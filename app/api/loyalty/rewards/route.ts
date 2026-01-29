import { NextRequest, NextResponse } from "next/server";
import { getEligibleRewards } from "@/lib/loyalty/rewards";

export const dynamic = "force-dynamic";

/**
 * GET /api/loyalty/rewards?userId=...
 * Returns rewards the user can redeem with current points.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const rewards = await getEligibleRewards(userId);
    return NextResponse.json(rewards);
  } catch (err) {
    console.error("[api/loyalty/rewards GET]", err);
    return NextResponse.json(
      { error: "Failed to load rewards" },
      { status: 500 }
    );
  }
}
