import { NextResponse } from "next/server";
import { getOrderStatsByDay } from "@/lib/admin/analytics";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days")) || 7;
    const stats = await getOrderStatsByDay(days);
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Admin analytics orders error:", err);
    return NextResponse.json({ error: "Failed to get order stats" }, { status: 500 });
  }
}
