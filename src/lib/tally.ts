import { accents, type AccentName } from "@/lib/accent";

export const TALLY_EVENT = "accent:tally";
export const TALLY_VOTE_COOKIE = "accent-vote";

export type TallyCounts = Record<AccentName, number>;

export type Tally = {
  counts: TallyCounts;
  vote: AccentName | null;
};

export function emptyTallyCounts(): TallyCounts {
  return { amber: 0, ember: 0, meadow: 0, rose: 0, tide: 0 };
}

export function parseTallyCounts(raw: unknown): TallyCounts {
  const next = emptyTallyCounts();
  if (!raw || typeof raw !== "object") return next;
  const data = raw as Record<string, unknown>;
  for (const accent of accents) {
    const count = data[accent.name];
    if (typeof count === "number" && Number.isFinite(count) && count >= 0) {
      next[accent.name] = Math.floor(count);
    }
  }
  return next;
}
