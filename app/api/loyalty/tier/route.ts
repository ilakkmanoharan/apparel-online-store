import { NextResponse } from "next/server";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend } from "@/lib/loyalty/spend";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const userSpend = await getUserSpend(userId);
    const spend = userSpend?.lifetimeSpend ?? 0;
    const tier = getTierBySpend(spend);
    return NextResponse.json({ tier, lifetimeSpend: spend });
  } catch (err) {
    console.error("Loyalty tier error:", err);
    return NextResponse.json({ error: "Failed to get tier" }, { status: 500 });
  }
}
