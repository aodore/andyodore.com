/** Retired URLs that still resolve to a live study. */
const aliases: Record<string, string> = {
  "strategy-collection": "strategic-intelligence",
};

export function canonicalWorkSlug(slug: string) {
  return aliases[slug] ?? slug;
}

/** Case studies that still ask for a password. Campaign Manager is public. */
export function isGatedWorkSlug(slug: string) {
  const canonical = canonicalWorkSlug(slug);
  return (
    canonical === "strategic-intelligence" || canonical === "post-office"
  );
}
