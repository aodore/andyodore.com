import Image from "next/image";
import { PasswordBadge } from "@/components/password-badge";
import { WorkLink } from "@/components/work-link";
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
  const { cardTitle, title, image, mark: Mark, tint } = study;

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
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
        />
        {isGatedWorkSlug(study.slug) && <PasswordBadge />}
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <span className="text-label text-lg leading-tight xl:text-2xl">
            {cardTitle ?? title}
          </span>
          <Mark className="text-label size-7 shrink-0 xl:size-9" />
        </figcaption>
      </figure>
    </WorkLink>
  );
}
