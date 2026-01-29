import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 503 }
      );
    }

    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const body = await request.json();
    const avatarUrl = typeof body.avatarUrl === "string" ? body.avatarUrl : "";
    if (!avatarUrl) {
      return NextResponse.json(
        { error: "avatarUrl is required" },
        { status: 400 }
      );
    }

    await firebaseAdmin.db
      .collection("users")
      .doc(userId)
      .set(
        {
          avatarUrl,
          updatedAt: new Date(),
        },
        { merge: true }
      );

    return NextResponse.json({ avatarUrl });
  } catch (err) {
    console.error("[api/user/avatar PUT]", err);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}

