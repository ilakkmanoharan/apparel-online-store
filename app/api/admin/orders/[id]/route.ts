import { NextResponse } from "next/server";
import { getAdminOrder, updateOrderStatus } from "@/lib/admin/orders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getAdminOrder(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error("Admin order get error:", err);
    return NextResponse.json({ error: "Failed to get order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as string | undefined;
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });
    const valid = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!valid.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    await updateOrderStatus(id, status as "pending" | "processing" | "shipped" | "delivered" | "cancelled");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
