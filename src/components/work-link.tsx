"use client";

import Link from "next/link";
import { useWorkGate } from "@/components/work-gate";
import { caseStudyHref, type CaseStudySlug } from "@/lib/case-studies";
import { linkCues } from "@/lib/sound";

/** Same link the card used to be; intercepts a plain click while the work is
    still locked so the password dialog can open instead of navigating. */
export function WorkLink({
  slug,
  children,
}: {
  slug: CaseStudySlug;
  children: React.ReactNode;
}) {
  const { unlocked, requestUnlock } = useWorkGate();

  return (
    <Link
      href={caseStudyHref(slug)}
      // The radius keeps the global focus ring hugging the card.
      className="t-stagger-line group block rounded-3xl"
      {...linkCues}
      onClick={(event) => {
        if (unlocked) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        if (event.button !== 0) return;
        event.preventDefault();
        requestUnlock(slug);
      }}
    >
      {children}
    </Link>
  );
}
