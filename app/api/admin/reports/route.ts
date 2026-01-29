import { NextRequest, NextResponse } from "next/server";
import { getTopProducts, getOrderStatsByDay } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/reports?type=topProducts|orderStats&days=7&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") ?? "orderStats";
    const days = parseInt(searchParams.get("days") ?? "7", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    if (type === "topProducts") {
      const topProducts = await getTopProducts(limit);
      return NextResponse.json({ type: "topProducts", data: topProducts });
    }

    if (type === "orderStats") {
      const orderStats = await getOrderStatsByDay(days);
      return NextResponse.json({ type: "orderStats", data: orderStats });
    }

    return NextResponse.json(
      { error: "Invalid report type. Use topProducts or orderStats." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[admin reports GET]", err);
    return NextResponse.json(
      { error: "Failed to load report" },
      { status: 500 }
    );
  }
}
