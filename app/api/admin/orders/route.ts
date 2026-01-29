import { NextResponse } from "next/server";
import { listAdminOrders } from "@/lib/admin/orders";
import type { Order } from "@/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 50;
    const status = searchParams.get("status") as Order["status"] | null;
    const orders = await listAdminOrders({ limit, status: status ?? undefined });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Admin orders list error:", err);
    return NextResponse.json({ error: "Failed to list orders" }, { status: 500 });
  }
}
