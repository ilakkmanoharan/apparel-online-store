import { NextResponse } from "next/server";
import { getReturnsByUser } from "@/lib/returns/firebase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const returns = await getReturnsByUser(userId);
    return NextResponse.json(returns);
  } catch (err) {
    console.error("List returns error:", err);
    return NextResponse.json({ error: "Failed to list returns" }, { status: 500 });
  }
}
