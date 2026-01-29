import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/admin/analytics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") as "day" | "week" | "month") || "week";
    const stats = await getDashboardStats(period);
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Admin analytics overview error:", err);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
