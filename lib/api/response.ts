import { NextResponse } from "next/server";

export function jsonOk(data: unknown) {
  return NextResponse.json(data);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
