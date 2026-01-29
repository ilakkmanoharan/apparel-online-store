import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe/portal";
import { getFirebaseAdmin, getAdminDb } from "@/lib/firebase/admin";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.auth) {
      return NextResponse.json({ error: "Server auth not configured" }, { status: 500 });
    }
    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const body = await req.json().catch(() => ({}));
    const returnUrl = (body.returnUrl as string) || `${getBaseUrl()}/account/security`;

    const adminDb = await getAdminDb();
    if (!adminDb) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }
    const userSnap = await adminDb.collection("users").doc(userId).get();
    const stripeCustomerId = userSnap.exists ? (userSnap.data() as { stripeCustomerId?: string })?.stripeCustomerId : null;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing customer found. Complete a purchase first." },
        { status: 400 }
      );
    }

    const session = await createCustomerPortalSession(stripeCustomerId, returnUrl);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/portal]", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
