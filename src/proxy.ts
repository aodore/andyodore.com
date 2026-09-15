import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isGatedWorkSlug } from "@/lib/gated-work";
import { WORK_ACCESS_COOKIE, hasWorkAccessFrom } from "@/lib/work-access";

export async function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2] ?? "";
  if (!isGatedWorkSlug(slug)) return NextResponse.next();

  const unlocked = await hasWorkAccessFrom(
    request.cookies.get(WORK_ACCESS_COOKIE)?.value,
  );
  if (unlocked) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("unlock", slug);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/work/:path*",
};
