import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { Address } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const firebaseAdmin = await getFirebaseAdmin();
    if (!firebaseAdmin?.db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });

    const decoded = await firebaseAdmin.auth.verifyIdToken(token);
    const userId = decoded.uid;

    const snapshot = await firebaseAdmin.db
      .collection("users")
      .doc(userId)
      .collection("addresses")
      .where("isDefault", "==", true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      const allSnap = await firebaseAdmin.db
        .collection("users")
        .doc(userId)
        .collection("addresses")
        .limit(1)
        .get();
      if (allSnap.empty) return NextResponse.json({ address: null });
      const doc = allSnap.docs[0];
      const data = doc.data();
      const address: Address = {
        id: doc.id,
        fullName: data.fullName ?? "",
        street: data.street ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        zipCode: data.zipCode ?? "",
        country: data.country ?? "",
        isDefault: !!data.isDefault,
      };
      return NextResponse.json({ address });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const address: Address = {
      id: doc.id,
      fullName: data.fullName ?? "",
      street: data.street ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      zipCode: data.zipCode ?? "",
      country: data.country ?? "",
      isDefault: !!data.isDefault,
    };
    return NextResponse.json({ address });
  } catch (err) {
    console.error("[api/addresses/default GET]", err);
    return NextResponse.json({ error: "Failed to get default address" }, { status: 500 });
  }
}
