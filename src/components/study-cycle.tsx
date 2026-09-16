import Link from "next/link";
import { ArrowIcon } from "@/components/brand";
import {
  caseStudyHref,
  getCaseStudy,
  type CaseStudySlug,
} from "@/lib/case-studies";
import { navCues } from "@/lib/sound";

/** Left/right arrows on the case-study title, cycling the same order as the
    cards at the bottom of the page. */
export function StudyCycle({
  previous,
  next,
}: {
  previous: CaseStudySlug;
  next: CaseStudySlug;
}) {
  const prevStudy = getCaseStudy(previous);
  const nextStudy = getCaseStudy(next);
  if (!prevStudy || !nextStudy) return null;

  return (
    <nav
      aria-label="Other work"
      className="flex shrink-0 items-center gap-2 xl:gap-3"
    >
      <CycleLink
        slug={prevStudy.slug}
        label={`Previous: ${prevStudy.title}`}
        direction="previous"
      />
      <CycleLink
        slug={nextStudy.slug}
        label={`Next: ${nextStudy.title}`}
        direction="next"
      />
    </nav>
  );
}

function CycleLink({
  slug,
  label,
  direction,
}: {
  slug: CaseStudySlug;
  label: string;
  direction: "previous" | "next";
}) {
  const isPrevious = direction === "previous";

  return (
    <Link
      href={caseStudyHref(slug)}
      aria-label={label}
      className={`bg-ink text-canvas grid size-11 place-items-center rounded-full motion-safe:transition-transform motion-safe:duration-300 xl:size-14 ${
        isPrevious
          ? "motion-safe:hover:-translate-x-1"
          : "motion-safe:hover:translate-x-1"
      }`}
      {...navCues}
    >
      <ArrowIcon
        className={`size-4 xl:size-6 ${isPrevious ? "-scale-x-100" : ""}`}
      />
    </Link>
  );
}
