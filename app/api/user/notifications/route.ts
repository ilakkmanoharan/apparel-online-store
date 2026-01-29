import { NextRequest, NextResponse } from "next/server";
import { getUserPreferences, updateUserPreferences } from "@/lib/firebase/userPreferences";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;
    const prefs = await getUserPreferences(userId);
    return NextResponse.json({
      orderUpdates: prefs?.orderUpdates ?? true,
      promos: prefs?.promos ?? false,
      newArrivals: prefs?.newArrivals ?? true,
    });
  } catch (err) {
    console.error("[user/notifications GET]", err);
    return NextResponse.json({ error: "Failed to get notifications" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;
    const body = await req.json();
    const { orderUpdates, promos, newArrivals } = body as { orderUpdates?: boolean; promos?: boolean; newArrivals?: boolean };
    await updateUserPreferences(userId, { orderUpdates, promos, newArrivals });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[user/notifications PUT]", err);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
