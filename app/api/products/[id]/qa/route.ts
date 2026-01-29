import { NextRequest, NextResponse } from "next/server";
import { getQAByProduct, addQuestion } from "@/lib/qa/firebase";
import { validateQuestion } from "@/lib/qa/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const items = await getQAByProduct(id, { limit });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[products qa GET]", err);
    return NextResponse.json({ error: "Failed to get Q&A", items: [] }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    const body = await req.json();
    const question = typeof body.question === "string" ? body.question : "";
    const validation = validateQuestion(question);
    if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });
    const userId = body.userId ?? null;
    const displayName = body.displayName ?? null;
    const qaId = await addQuestion(id, question, userId, displayName);
    return NextResponse.json({ id: qaId });
  } catch (err) {
    console.error("[products qa POST]", err);
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}
