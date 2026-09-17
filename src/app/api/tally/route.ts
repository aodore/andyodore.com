import { cookies } from "next/headers";
import { isAccentName } from "@/lib/accent";
import { getTallyCounts, recordTallyVote } from "@/lib/tally-store";
import { TALLY_VOTE_COOKIE, type Tally } from "@/lib/tally";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  secure: process.env.NODE_ENV === "production",
};

function voteFrom(value: string | undefined) {
  return value && isAccentName(value) ? value : null;
}

export async function GET() {
  const jar = await cookies();
  const tally: Tally = {
    counts: await getTallyCounts(),
    vote: voteFrom(jar.get(TALLY_VOTE_COOKIE)?.value),
  };
  return Response.json(tally);
}

export async function POST(request: Request) {
  let name: unknown;
  try {
    const body = (await request.json()) as { name?: unknown };
    name = body.name;
  } catch {
    return Response.json({ error: "Expected JSON." }, { status: 400 });
  }
  if (typeof name !== "string" || !isAccentName(name)) {
    return Response.json({ error: "Unknown accent." }, { status: 400 });
  }

  const jar = await cookies();
  const previous = voteFrom(jar.get(TALLY_VOTE_COOKIE)?.value);

  try {
    const counts = await recordTallyVote(name, previous);
    jar.set(TALLY_VOTE_COOKIE, name, cookieOptions);
    const tally: Tally = { counts, vote: name };
    return Response.json(tally);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Tally is unavailable." }, { status: 503 });
  }
}
