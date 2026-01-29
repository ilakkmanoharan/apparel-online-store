import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/firebase/userProfile";
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
    const profile = await getProfile(userId);
    return NextResponse.json(profile ?? {});
  } catch (err) {
    console.error("[user/profile GET]", err);
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
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
    const { displayName, phone, avatarUrl } = body as { displayName?: string; phone?: string; avatarUrl?: string };
    const updated = await updateProfile(userId, { displayName, phone, avatarUrl });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[user/profile PUT]", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
