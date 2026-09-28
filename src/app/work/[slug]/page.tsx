import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { AboutRow } from "@/components/about-row";
import { HomeLink } from "@/components/home-link";
import { ProjectNav } from "@/components/project-nav";
import { SayHello } from "@/components/say-hello";
import { StudyCycle } from "@/components/study-cycle";
import { ShotLightbox, ShotTrigger, PresentationLaunch } from "@/components/shot-lightbox";
import { SiteFooter } from "@/components/site-footer";
import { StaggerReveal } from "@/components/stagger-reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorkLozenges } from "@/components/work-lozenges";
import {
  caseStudies,
  caseStudyGuide,
  caseStudyShots,
  getCaseStudy,
  type CaseStudySection,
  type CaseStudyParagraph,
} from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    robots: { index: false, follow: false },
    openGraph: {
      title: study.title,
      description: study.summary,
      type: "article",
      url: `/work/${study.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();

  return (
    // globals.css hangs this case study's palette off the document root, so
    // every component below picks up its colors from the usual theme slots.
    <div
      data-case-study={study.slug}
      className="flex min-h-dvh flex-col px-6 md:px-10 xl:px-[46px]"
    >
      <div className="mx-auto flex w-full max-w-[1636px] flex-1 flex-col">
        <header className="flex items-start justify-between pt-8 xl:pt-[45px]">
          {/* Block, not inline-block: an inline box would add the header's
              line-height as dead space under the monogram. */}
          <HomeLink className="block w-fit rounded-full" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SayHello />
          </div>
        </header>

        <StaggerReveal key={study.slug} className="flex flex-1 flex-col">
          <main>
            <ShotLightbox
              shots={caseStudyShots(study)}
              guide={caseStudyGuide(study)}
            >
              <div className="t-stagger-line mt-10 flex items-center justify-between gap-6 xl:mt-16">
                <h1 className="text-ink font-display text-display min-w-0 font-thin text-balance">
                  {study.title}
                </h1>
                <div className="flex shrink-0 items-center gap-2 xl:gap-3">
                  <PresentationLaunch />
                  <StudyCycle previous={study.previous} next={study.next} />
                </div>
              </div>
              {/* leading-none at xl matches the design's 24/24 single line; the
                  looser value keeps it readable if it wraps on a narrow screen. */}
              <p className="t-stagger-line text-lede mt-3 text-base leading-snug font-light md:text-lg xl:mt-6 xl:text-2xl xl:leading-none">
                {study.meta}
              </p>
              <WorkLozenges
                tags={study.tags}
                size="page"
                className="t-stagger-line mt-4 xl:mt-5"
              />

              {/* The design spaces copy and screenshots evenly, so one gap covers
                  both the run between a section and its shot and the run to the
                  next section. */}
              <div className="mt-10 flex flex-col gap-10 xl:mt-16 xl:gap-16">
                {(() => {
                  let shotIndex = 0;
                  return (
                    <>
                      {study.hero && (
                        <ShotTrigger
                          shot={study.hero}
                          index={shotIndex++}
                        />
                      )}
                      {study.sections
                        .filter((section) => section.beforeClip)
                        .map((section) => (
                          <SectionCopy key={section.label} section={section} />
                        ))}
                      {study.heroClip && (
                        <ShotTrigger
                          shot={study.heroClip}
                          index={shotIndex++}
                        />
                      )}
                      {study.sections.map((section, sectionIndex) => (
                        <Fragment key={`${section.label}-${sectionIndex}`}>
                          {!section.beforeClip && (
                            <SectionCopy section={section} />
                          )}
                          {section.images?.map((item) => {
                            if (Array.isArray(item)) {
                              const start = shotIndex;
                              return (
                                <div
                                  key={`${section.label}-row-${start}`}
                                  className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:gap-4"
                                >
                                  {item.map((shot) => {
                                    const index = shotIndex++;
                                    return (
                                      <ShotTrigger
                                        key={`${section.label}-${index}`}
                                        shot={shot}
                                        index={index}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            }
                            const index = shotIndex++;
                            return (
                              <ShotTrigger
                                key={`${section.label}-${index}`}
                                shot={item}
                                index={index}
                              />
                            );
                          })}
                        </Fragment>
                      ))}
                    </>
                  );
                })()}
              </div>
            </ShotLightbox>

            <div className="mt-20 xl:mt-[200px]">
              <ProjectNav previous={study.previous} next={study.next} />
            </div>
          </main>

          <div className="mt-auto pt-10 pb-10 xl:pt-[70px] xl:pb-[45px]">
            <SiteFooter />
          </div>
        </StaggerReveal>
      </div>
    </div>
  );
}

function bulletList(items: CaseStudyParagraph[]) {
  return (
    <ul className="list-disc space-y-2 pl-[1.1em] xl:space-y-3">
      {items.map((item) => (
        <li key={typeof item === "string" ? item : item.lead}>
          {typeof item === "string" ? (
            item
          ) : (
            <>
              <strong className="font-bold">{item.lead}</strong> {item.rest}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function copyBlocks(paragraphs: CaseStudyParagraph[]) {
  return paragraphs.map((paragraph) =>
    typeof paragraph === "string" ? (
      <p key={paragraph}>{paragraph}</p>
    ) : (
      <p key={paragraph.lead}>
        <strong className="block font-bold">{paragraph.lead}</strong>
        {paragraph.rest}
      </p>
    ),
  );
}

function SectionCopy({ section }: { section: CaseStudySection }) {
  const paragraphs = Array.isArray(section.body)
    ? section.body
    : section.body
      ? [section.body]
      : [];
  const after = Array.isArray(section.after)
    ? section.after
    : section.after
      ? [section.after]
      : [];

  return (
    <AboutRow label={section.label}>
      {section.facts ? (
        <ul className="list-disc space-y-2 pl-[1.1em] xl:space-y-3">
          {section.facts.map((fact) => (
            <li key={fact.label}>
              <strong className="font-bold">{fact.label}</strong> {fact.value}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-4 xl:gap-5">
          {copyBlocks(paragraphs)}
          {section.list ? bulletList(section.list) : null}
          {copyBlocks(after)}
          {section.afterList ? bulletList(section.afterList) : null}
        </div>
      )}
    </AboutRow>
  );
}
