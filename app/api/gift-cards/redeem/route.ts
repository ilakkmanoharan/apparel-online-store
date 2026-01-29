import { NextRequest, NextResponse } from "next/server";
import { getGiftCardByCode, updateGiftCardBalance } from "@/lib/giftcard/firebase";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { validateGiftCardCode } from "@/lib/giftcard/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = String(body?.code ?? "").trim().replace(/\s/g, "").toUpperCase();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });
    if (!validateGiftCardCode(code).valid) return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    const giftCard = await getGiftCardByCode(code);
    if (!giftCard) return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    if (giftCard.balance <= 0) return NextResponse.json({ error: "No balance" }, { status: 400 });
    let userId: string | undefined;
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (token) {
      const admin = await getFirebaseAdmin();
      if (admin?.auth) userId = (await admin.auth.verifyIdToken(token)).uid;
    }
    if (userId) await updateGiftCardBalance(giftCard.id, giftCard.balance, userId);
    return NextResponse.json({ balance: giftCard.balance, id: giftCard.id });
  } catch (err) {
    console.error("[gift-cards redeem]", err);
    return NextResponse.json({ error: "Redeem failed" }, { status: 500 });
  }
}
