/** HttpOnly cookie set after a correct password. The value is a hash of the
    password, not the password itself, so a leaked cookie still isn't the key. */
export const WORK_ACCESS_COOKIE = "work-access";

/** Binds the hash to this site so a matching password elsewhere wouldn't mint
    a cookie this gate would accept. */
const GATE_SALT = "andyodore.com/work";

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** SHA-256 of the password, used both as the cookie value and as the thing we
    compare against so a length mismatch can't leak through timing. */
export async function workAccessToken(password: string) {
  const bytes = new TextEncoder().encode(`${GATE_SALT}:${password}`);
  return toHex(await crypto.subtle.digest("SHA-256", bytes));
}

function secretsMatch(left: string, right: string) {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0;
}

export function caseStudyPassword() {
  return process.env.CASE_STUDY_PASSWORD;
}

/** No password in the environment means the gate is off, so local work isn't
    bricked. Production should set `CASE_STUDY_PASSWORD`. */
export async function hasWorkAccessFrom(cookieValue: string | undefined) {
  const password = caseStudyPassword();
  if (!password) return true;
  if (!cookieValue) return false;
  return secretsMatch(cookieValue, await workAccessToken(password));
}

export async function passwordUnlocksWork(candidate: string) {
  const password = caseStudyPassword();
  if (!password) return true;
  return secretsMatch(
    await workAccessToken(candidate),
    await workAccessToken(password),
  );
}

const WORK_SLUGS = new Set([
  "strategy-collection",
  "post-office",
  "campaign-manager",
]);

export function isWorkSlug(value: string) {
  return WORK_SLUGS.has(value);
}
