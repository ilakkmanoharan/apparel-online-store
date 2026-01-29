import { NextRequest, NextResponse } from "next/server";
import { getReturnById } from "@/lib/returns/firebase";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    returnId: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const request = await getReturnById(params.returnId);
    if (!request) {
      return NextResponse.json({ error: "Return not found" }, { status: 404 });
    }
    return NextResponse.json(request);
  } catch (err) {
    console.error("[api/returns/[returnId]/status GET]", err);
    return NextResponse.json(
      { error: "Failed to load return status" },
      { status: 500 }
    );
  }
}

