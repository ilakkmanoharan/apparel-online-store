import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { getOrCreateStripeCustomerId } from "@/lib/stripe/customers";
import { getSavedPaymentMethods } from "@/lib/stripe/saved-methods";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const admin = await getFirebaseAdmin();
    if (!admin?.auth) return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
    const decoded = await admin.auth.verifyIdToken(token);
    const customerId = await getOrCreateStripeCustomerId(decoded.uid, decoded.email);
    const methods = await getSavedPaymentMethods(customerId);
    return NextResponse.json({ methods });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "List failed" },
      { status: 500 }
    );
  }
}
