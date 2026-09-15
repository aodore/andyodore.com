import Link from "next/link";
import { ArrowIcon } from "@/components/brand";
import { HomeLink } from "@/components/home-link";
import {
  caseStudyHref,
  getCaseStudy,
  type CaseStudy,
  type CaseStudySlug,
} from "@/lib/case-studies";
import { navCues } from "@/lib/sound";

type Direction = "previous" | "next";

/**
 * Walks to the neighbouring case studies, with the monogram between them as the
 * way back home. The two cards mirror each other: the arrow leads on the
 * previous card and trails on the next one. Resting colors are this page's
 * night palette; hover reveals the destination's day canvas.
 */
export function ProjectNav({
  previous,
  next,
}: {
  previous: CaseStudySlug;
  next: CaseStudySlug;
}) {
  const prevStudy = getCaseStudy(previous);
  const nextStudy = getCaseStudy(next);

  return (
    <nav
      aria-label="More work"
      className="project-nav grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-10 xl:gap-20"
    >
      {prevStudy && <NavCard direction="previous" study={prevStudy} />}
      <HomeLink className="t-stagger-line justify-self-center rounded-full" />
      {nextStudy && <NavCard direction="next" study={nextStudy} />}
    </nav>
  );
}

function NavCard({
  direction,
  study,
}: {
  direction: Direction;
  study: CaseStudy;
}) {
  const { mark: Mark, palette } = study;
  const isPrevious = direction === "previous";

  const label = (
    <span
      className={`text-ink text-base leading-[1.1] motion-safe:transition-colors motion-safe:duration-300 xl:text-2xl ${
        isPrevious ? "" : "text-right"
      }`}
    >
      <span className="block font-semibold">
        {isPrevious ? "Previous" : "Next"}
      </span>
      <span className="block">{study.title}</span>
    </span>
  );

  // Kept smaller than the design's 56px until xl, where the card is tall
  // enough for it not to crowd the label. With no photo left to scale on hover,
  // the pill carries the affordance by nudging the way it points.
  const pill = (
    <span
      className={`bg-ink text-canvas grid size-11 shrink-0 place-items-center rounded-full motion-safe:transition-[transform,background-color,color] motion-safe:duration-300 xl:size-14 ${
        isPrevious
          ? "motion-safe:group-hover:-translate-x-1"
          : "motion-safe:group-hover:translate-x-1"
      }`}
    >
      <ArrowIcon
        className={`size-4 xl:size-6 ${isPrevious ? "-scale-x-100" : ""}`}
      />
    </span>
  );

  return (
    <Link
      href={caseStudyHref(study.slug)}
      className="t-stagger-line group block rounded-[99px]"
      {...navCues}
    >
      {/* Resting colors come from .project-nav (this page, dark). The palette
          class only rebinds on hover, to the destination's designed canvas.
          With the photo gone there is nothing to hold an aspect ratio open, so
          the card is as tall as its caption plus an even inset. */}
      <figure
        className={`bg-canvas rounded-[99px] p-6 motion-safe:transition-colors motion-safe:duration-300 ${palette}`}
      >
        <figcaption className="flex items-center justify-between gap-4">
          {isPrevious ? (
            <>
              <span className="flex items-center gap-4">
                {pill}
                {label}
              </span>
              <Mark className="text-ink size-9 shrink-0 -translate-x-2 motion-safe:transition-colors motion-safe:duration-300 xl:size-11" />
            </>
          ) : (
            <>
              <Mark className="text-ink size-9 shrink-0 translate-x-2 motion-safe:transition-colors motion-safe:duration-300 xl:size-11" />
              <span className="flex items-center gap-4">
                {label}
                {pill}
              </span>
            </>
          )}
        </figcaption>
      </figure>
    </Link>
  );
}
