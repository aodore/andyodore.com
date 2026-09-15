"use server";

import { cookies } from "next/headers";
import {
  WORK_ACCESS_COOKIE,
  caseStudyPassword,
  passwordUnlocksWork,
  workAccessToken,
} from "@/lib/work-access";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function unlockWork(password: string) {
  const trimmed = password.trim();
  if (!trimmed) {
    return { ok: false as const, error: "A password lives here." };
  }

  if (!(await passwordUnlocksWork(trimmed))) {
    return { ok: false as const, error: "That’s not it." };
  }

  const expected = caseStudyPassword();
  const jar = await cookies();
  jar.set(WORK_ACCESS_COOKIE, await workAccessToken(expected ?? trimmed), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  return { ok: true as const };
}
