import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/admin/dashboard";

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("[admin dashboard]", err);
    return NextResponse.json({ error: "Failed to get dashboard stats" }, { status: 500 });
  }
}
