import { NextResponse } from "next/server";
import { isAdminUser, getAdminEmailsFromEnv } from "@/lib/admin/middleware";

/**
 * GET /api/admin/auth?uid=xxx
 * Check if user is admin. Call from client with current user uid.
 * In production, verify Firebase ID token and use its uid.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }
    const record = await isAdminUser(uid);
    if (record) {
      return NextResponse.json({ isAdmin: true, role: record.role });
    }
    const allowedEmails = getAdminEmailsFromEnv();
    if (allowedEmails.length > 0) {
      return NextResponse.json({ isAdmin: true, role: "admin" });
    }
    return NextResponse.json({ isAdmin: false });
  } catch (err) {
    console.error("Admin auth check error:", err);
    return NextResponse.json({ error: "Failed to check admin" }, { status: 500 });
  }
}
