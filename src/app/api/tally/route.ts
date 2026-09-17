import { NextResponse } from "next/server";
import { isAccentName } from "@/lib/accent";
import { getTallyCounts, recordTallyVote } from "@/lib/tally-store";
import { type Tally } from "@/lib/tally";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const tally: Tally = { counts: await getTallyCounts() };
  return NextResponse.json(tally);
}

export async function POST(request: Request) {
  let name: unknown;
  try {
    const body = (await request.json()) as { name?: unknown };
    name = body.name;
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }
  if (typeof name !== "string" || !isAccentName(name)) {
    return NextResponse.json({ error: "Unknown accent." }, { status: 400 });
  }

  try {
    const tally: Tally = { counts: await recordTallyVote(name) };
    return NextResponse.json(tally);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Tally is unavailable." },
      { status: 503 },
    );
  }
}
