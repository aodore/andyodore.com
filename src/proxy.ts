import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  WORK_ACCESS_COOKIE,
  hasWorkAccessFrom,
  isWorkSlug,
} from "@/lib/work-access";

export async function proxy(request: NextRequest) {
  const unlocked = await hasWorkAccessFrom(
    request.cookies.get(WORK_ACCESS_COOKIE)?.value,
  );
  if (unlocked) return NextResponse.next();

  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  if (isWorkSlug(slug)) url.searchParams.set("unlock", slug);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/work/:path*",
};
