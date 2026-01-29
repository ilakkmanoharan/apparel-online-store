import { NextRequest, NextResponse } from "next/server";
import { cancelReservation } from "@/lib/bopis/reservations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reservationId = body.reservationId as string;
    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId is required" },
        { status: 400 }
      );
    }
    await cancelReservation(reservationId);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cancel failed" },
      { status: 400 }
    );
  }
}
