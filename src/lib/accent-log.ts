import { type AccentName } from "@/lib/accent";
import { TALLY_EVENT, emptyTallyCounts, type Tally } from "@/lib/tally";

export { TALLY_EVENT } from "@/lib/tally";

async function parseTally(response: Response): Promise<Tally | null> {
  if (!response.ok) return null;
  try {
    return (await response.json()) as Tally;
  } catch {
    return null;
  }
}

export async function fetchTally(): Promise<Tally | null> {
  try {
    return await parseTally(await fetch("/api/tally", { cache: "no-store" }));
  } catch {
    return null;
  }
}

function publish(tally: Tally) {
  window.dispatchEvent(new CustomEvent(TALLY_EVENT, { detail: tally }));
}

/** Adds one to the dropped color. Picking again adds another — the tally
    is a running score, not a sealed ballot. */
export async function recordAccentChoice(name: AccentName) {
  try {
    const tally = await parseTally(
      await fetch("/api/tally", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }),
    );
    if (tally) publish(tally);
    return tally;
  } catch {
    return null;
  }
}

export async function hydrateAccentLog() {
  const tally = (await fetchTally()) ?? {
    counts: emptyTallyCounts(),
  };
  publish(tally);
  return tally;
}
