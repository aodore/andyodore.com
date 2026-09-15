import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Light-theme data URI of `src/app/icon.svg`, for OG and apple-touch PNGs
    that cannot follow `prefers-color-scheme`. */
export async function monogramDataUri() {
  const svg = await readFile(
    join(process.cwd(), "src/app/icon.svg"),
    "utf8",
  );
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
