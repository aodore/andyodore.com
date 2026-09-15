/** Case studies that still ask for a password. Campaign Manager is public. */
export function isGatedWorkSlug(slug: string) {
  return slug === "strategy-collection" || slug === "post-office";
}
