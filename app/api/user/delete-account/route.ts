import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const body = await req.json().catch(() => ({}));
    const confirm = body.confirm as string;
    if (confirm !== "DELETE MY ACCOUNT") {
      return NextResponse.json({ error: "Confirmation phrase required" }, { status: 400 });
    }

    await firebaseAdmin.auth.deleteUser(userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[user/delete-account]", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
