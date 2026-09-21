import Image from "next/image";
import { PasswordBadge } from "@/components/password-badge";
import { WorkLink } from "@/components/work-link";
import { WorkLozenges } from "@/components/work-lozenges";
import type { CaseStudy } from "@/lib/case-studies";
import { isGatedWorkSlug } from "@/lib/gated-work";

export function ProjectCard({
  study,
  priority,
}: {
  study: CaseStudy;
  /** Preloaded: the first card is the likely LCP element at every width. */
  priority?: boolean;
}) {
  const { title, tags, image, mark: Mark, tint, company } = study;

  return (
    <WorkLink slug={study.slug}>
      <figure
        className={`relative isolate aspect-[535/700] overflow-hidden rounded-3xl ${tint}`}
      >
        <Image
          src={image}
          // The caption names the project, so the photo adds nothing to read out.
          alt=""
          fill
          sizes="(min-width: 1728px) 535px, (min-width: 1024px) 33vw, 100vw"
          priority={priority}
          // All three cards are inside the initial viewport from `lg` up, so the
          // other two load without waiting but without competing for preload.
          loading={priority ? undefined : "eager"}
          // Same as the case-study shots: Next's optimizer was recompressing
          // the card photos and softening the type on the screens.
          unoptimized
          className="object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
        />
        {isGatedWorkSlug(study.slug) && <PasswordBadge />}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        />
        <figcaption className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-6">
          <div className="min-w-0">
            <span className="text-label text-lg leading-tight xl:text-2xl">
              {title}
            </span>
            <WorkLozenges tags={tags} className="mt-2" />
          </div>
          {/* Named group so hovering the card does not pop the company name —
              only the mark itself, matching the other chrome tooltips. Sits
              to the left of the logo so the figure's clip does not eat it. */}
          <span className="group/mark relative shrink-0">
            <Mark className="text-label size-7 xl:size-9" />
            <span
              aria-hidden
              className="bg-ink text-canvas pointer-events-none absolute top-1/2 right-full z-10 mr-3 -translate-y-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/mark:opacity-100"
            >
              {company}
            </span>
          </span>
        </figcaption>
      </figure>
    </WorkLink>
  );
}
