import { NextRequest, NextResponse } from "next/server";
import { getOrdersForExport, ordersToCsv } from "@/lib/admin/export";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const limit = searchParams.get("limit");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const orders = await getOrdersForExport({
      status: status as "pending" | "processing" | "shipped" | "delivered" | "cancelled" | undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    const csv = ordersToCsv(orders);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("[admin export GET]", err);
    return NextResponse.json(
      { error: "Failed to export orders" },
      { status: 500 }
    );
  }
}
