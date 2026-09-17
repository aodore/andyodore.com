import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { accents, type AccentName } from "@/lib/accent";
import { emptyTallyCounts, type TallyCounts } from "@/lib/tally";

const redis =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
    ? Redis.fromEnv()
    : null;

const TALLY_KEY = "accent-tally";
const FILE_PATH = path.join(process.cwd(), ".data", "tally.json");

const VOTE_SCRIPT = `
local key = KEYS[1]
local prev = ARGV[1]
local nxt = ARGV[2]
if prev ~= nxt then
  if prev ~= '' then
    local current = tonumber(redis.call('HGET', key, prev) or '0')
    if current > 0 then
      redis.call('HINCRBY', key, prev, -1)
    end
  end
  redis.call('HINCRBY', key, nxt, 1)
end
return redis.call('HGETALL', key)
`;

function countsFromHash(entries: unknown): TallyCounts {
  const next = emptyTallyCounts();
  if (entries && typeof entries === "object" && !Array.isArray(entries)) {
    for (const accent of accents) {
      const count = Number((entries as Record<string, unknown>)[accent.name]);
      if (Number.isFinite(count) && count > 0) {
        next[accent.name] = Math.floor(count);
      }
    }
    return next;
  }
  if (!Array.isArray(entries)) return next;
  for (let i = 0; i + 1 < entries.length; i += 2) {
    const name = entries[i];
    const value = entries[i + 1];
    if (typeof name !== "string") continue;
    const count = typeof value === "number" ? value : Number(value);
    if (!accents.some((accent) => accent.name === name)) continue;
    if (Number.isFinite(count) && count > 0) {
      next[name as AccentName] = Math.floor(count);
    }
  }
  return next;
}

let fileQueue: Promise<unknown> = Promise.resolve();

function withFileLock<T>(work: () => Promise<T>) {
  const run = fileQueue.then(work, work);
  fileQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readFileCounts(): Promise<TallyCounts> {
  try {
    const raw = await readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const next = emptyTallyCounts();
    if (parsed && typeof parsed === "object") {
      for (const accent of accents) {
        const count = (parsed as Record<string, unknown>)[accent.name];
        if (typeof count === "number" && count >= 0) {
          next[accent.name] = Math.floor(count);
        }
      }
    }
    return next;
  } catch {
    return emptyTallyCounts();
  }
}

async function writeFileCounts(counts: TallyCounts) {
  await mkdir(path.dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, `${JSON.stringify(counts)}\n`);
}

/** Shared poll totals. Redis in production; a local JSON file in development
    so `next dev` still has somewhere to keep the running count. */
export async function getTallyCounts(): Promise<TallyCounts> {
  if (redis) {
    return countsFromHash(await redis.hgetall(TALLY_KEY));
  }
  if (process.env.VERCEL) {
    console.error(
      "Accent tally needs UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or the KV REST pair) in production.",
    );
    return emptyTallyCounts();
  }
  return readFileCounts();
}

export async function recordTallyVote(
  next: AccentName,
  previous: AccentName | null,
): Promise<TallyCounts> {
  if (redis) {
    const result = await redis.eval(VOTE_SCRIPT, [TALLY_KEY], [
      previous ?? "",
      next,
    ]);
    return countsFromHash(result);
  }
  if (process.env.VERCEL) {
    throw new Error("Accent tally is not configured");
  }
  return withFileLock(async () => {
    const counts = await readFileCounts();
    if (previous !== next) {
      if (previous) counts[previous] = Math.max(0, counts[previous] - 1);
      counts[next] += 1;
      await writeFileCounts(counts);
    }
    return counts;
  });
}
