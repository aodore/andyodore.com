import { cookies } from "next/headers";
import { WORK_ACCESS_COOKIE, hasWorkAccessFrom } from "@/lib/work-access";

export async function hasWorkAccess() {
  const jar = await cookies();
  return hasWorkAccessFrom(jar.get(WORK_ACCESS_COOKIE)?.value);
}
