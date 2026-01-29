import { NextResponse } from "next/server";
import { getReturnById } from "@/lib/returns/firebase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ returnId: string }> }
) {
  try {
    const { returnId } = await params;
    const returnRequest = await getReturnById(returnId);
    if (!returnRequest) {
      return NextResponse.json({ error: "Return not found" }, { status: 404 });
    }
    return NextResponse.json(returnRequest);
  } catch (err) {
    console.error("Get return error:", err);
    return NextResponse.json({ error: "Failed to get return" }, { status: 500 });
  }
}
