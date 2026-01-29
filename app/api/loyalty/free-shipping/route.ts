import { NextResponse } from "next/server";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend, isFreeShippingEligible } from "@/lib/loyalty/spend";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const userSpend = await getUserSpend(userId);
    const spend = userSpend?.lifetimeSpend ?? 0;
    const tier = getTierBySpend(spend);
    const eligible = isFreeShippingEligible(tier.id);
    return NextResponse.json({ eligible, tierId: tier.id, lifetimeSpend: spend });
  } catch (err) {
    console.error("Free shipping check error:", err);
    return NextResponse.json({ error: "Failed to check" }, { status: 500 });
  }
}
