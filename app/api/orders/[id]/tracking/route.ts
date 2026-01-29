import { NextRequest, NextResponse } from "next/server";
import { getOrderTrackingInfo } from "@/lib/orders/tracking";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const tracking = await getOrderTrackingInfo(params.id);
    if (!tracking) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(tracking);
  } catch (err) {
    console.error("[api/orders/[id]/tracking GET]", err);
    return NextResponse.json(
      { error: "Failed to load tracking info" },
      { status: 500 }
    );
  }
}

