import { NextRequest, NextResponse } from "next/server";
import { getGiftCardBalanceByCode } from "@/lib/giftcard/balance";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim();
    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }
    const result = await getGiftCardBalanceByCode(code);
    if (!result) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Balance check failed" },
      { status: 500 }
    );
  }
}
