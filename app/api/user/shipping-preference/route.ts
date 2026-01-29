import { NextResponse } from "next/server";
import { getUserPreferences, setShippingPreference } from "@/lib/firebase/userPreferences";
import type { ShippingHabit } from "@/types/userPreferences";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const prefs = await getUserPreferences(userId);
    return NextResponse.json(prefs ?? { userId, shippingHabit: "none", marketingEmails: false, orderUpdates: true });
  } catch (err) {
    console.error("Shipping preference get error:", err);
    return NextResponse.json({ error: "Failed to get preference" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, shippingHabit } = body as { userId: string; shippingHabit: ShippingHabit };
    if (!userId || !shippingHabit) return NextResponse.json({ error: "Missing userId or shippingHabit" }, { status: 400 });
    await setShippingPreference(userId, shippingHabit);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Shipping preference update error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
