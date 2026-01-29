import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/audit?limit=100&resource=order&userId=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "100", 10);
    const resource = searchParams.get("resource") ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const entries = await getAuditLogs({
      limit: Math.min(limit, 500),
      resource,
      userId,
    });
    return NextResponse.json({ entries });
  } catch (err) {
    console.error("[admin audit GET]", err);
    return NextResponse.json(
      { error: "Failed to load audit log" },
      { status: 500 }
    );
  }
}
