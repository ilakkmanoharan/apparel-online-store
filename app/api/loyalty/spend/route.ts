import { NextResponse } from "next/server";
import { getUserSpend } from "@/lib/firebase/userSpend";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    const userSpend = await getUserSpend(userId);
    return NextResponse.json(userSpend ?? { userId, lifetimeSpend: 0, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Loyalty spend error:", err);
    return NextResponse.json({ error: "Failed to get spend" }, { status: 500 });
  }
}
