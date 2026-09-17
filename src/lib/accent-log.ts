import { ACCENT_STORAGE_KEY, isAccentName, type AccentName } from "@/lib/accent";
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

/** Casts this visitor's vote. Picking again moves the vote rather than
    stacking another one, so one browser is one voice. */
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

/** Returning visitors who chose before the poll existed still get counted
    once, from the accent already on this device. */
export async function hydrateAccentLog() {
  const tally = await fetchTally();
  if (!tally) return { counts: emptyTallyCounts(), vote: null };
  if (tally.vote) {
    publish(tally);
    return tally;
  }
  try {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (stored && isAccentName(stored)) {
      return (await recordAccentChoice(stored)) ?? tally;
    }
  } catch {
    // Private mode: they can still vote when they drop a monogram.
  }
  publish(tally);
  return tally;
}
