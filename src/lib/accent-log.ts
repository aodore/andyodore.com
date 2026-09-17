import {
  ACCENT_STORAGE_KEY,
  accents,
  type AccentName,
} from "@/lib/accent";

export const ACCENT_LOG_KEY = "accent-log";
export const ACCENT_LOG_EVENT = "accent:log";

const names = new Set<string>(accents.map((accent) => accent.name));

export type AccentLogEntry = {
  name: AccentName;
  at: number;
};

export type AccentLog = {
  counts: Record<AccentName, number>;
  entries: AccentLogEntry[];
};

export function emptyAccentLog(): AccentLog {
  return {
    counts: { amber: 0, ember: 0, meadow: 0, rose: 0, tide: 0 },
    entries: [],
  };
}

function isAccentName(value: string): value is AccentName {
  return names.has(value);
}

function parseLog(raw: string): AccentLog | null {
  try {
    const data = JSON.parse(raw) as Partial<AccentLog>;
    const next = emptyAccentLog();
    if (data.counts && typeof data.counts === "object") {
      for (const accent of accents) {
        const count = data.counts[accent.name];
        if (typeof count === "number" && count >= 0) {
          next.counts[accent.name] = Math.floor(count);
        }
      }
    }
    if (Array.isArray(data.entries)) {
      next.entries = data.entries.flatMap((entry) => {
        if (
          !entry ||
          typeof entry !== "object" ||
          !isAccentName(entry.name) ||
          typeof entry.at !== "number"
        ) {
          return [];
        }
        return [{ name: entry.name, at: entry.at }];
      });
    }
    return next;
  } catch {
    return null;
  }
}

function writeLog(log: AccentLog) {
  localStorage.setItem(ACCENT_LOG_KEY, JSON.stringify(log));
  window.dispatchEvent(new Event(ACCENT_LOG_EVENT));
}

export function readAccentLog(): AccentLog {
  try {
    const raw = localStorage.getItem(ACCENT_LOG_KEY);
    if (raw) return parseLog(raw) ?? emptyAccentLog();
  } catch {
    // Private mode: the tally just stays empty.
  }
  return emptyAccentLog();
}

/** Fills a missing log from the accent already on this device, so visitors
    who chose before the tally existed are not starting from zero. */
export function hydrateAccentLog(): AccentLog {
  const existing = readAccentLog();
  if (existing.entries.length > 0) return existing;
  try {
    const current = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (current && isAccentName(current)) {
      const seeded = emptyAccentLog();
      seeded.counts[current] = 1;
      seeded.entries.push({ name: current, at: Date.now() });
      writeLog(seeded);
      return seeded;
    }
  } catch {
    // Same as a missing store.
  }
  return existing;
}

export function recordAccentChoice(name: AccentName): AccentLog {
  const log = readAccentLog();
  log.counts[name] += 1;
  log.entries.push({ name, at: Date.now() });
  try {
    writeLog(log);
  } catch {
    // Same as a missing store: the page still wears the color.
  }
  return log;
}
