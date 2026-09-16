import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { AboutRow } from "@/components/about-row";
import { HomeLink } from "@/components/home-link";
import { ProjectNav } from "@/components/project-nav";
import { SayHello } from "@/components/say-hello";
import { ShotLightbox, ShotTrigger } from "@/components/shot-lightbox";
import { SiteFooter } from "@/components/site-footer";
import { StaggerReveal } from "@/components/stagger-reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  caseStudies,
  caseStudyShots,
  getCaseStudy,
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
            <h1 className="t-stagger-line text-ink font-display text-display mt-10 font-thin text-balance xl:mt-16">
              {study.title}
            </h1>
            {/* leading-none at xl matches the design's 24/24 single line; the
                looser value keeps it readable if it wraps on a narrow screen. */}
            <p className="t-stagger-line text-lede mt-3 text-base leading-snug font-light md:text-lg xl:mt-6 xl:text-2xl xl:leading-none">
              {study.meta}
            </p>

            <hr className="border-rule mt-10 xl:mt-16" />

            {/* The design spaces copy and screenshots evenly, so one gap covers
                both the run between a section and its shot and the run to the
                next section. */}
            <ShotLightbox shots={caseStudyShots(study)}>
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
                      {study.sections.map((section) => (
                        <Fragment key={section.label}>
                          <AboutRow label={section.label}>
                            <p>{section.body}</p>
                          </AboutRow>
                          {section.images?.map((shot) => {
                            const index = shotIndex++;
                            return (
                              <ShotTrigger
                                key={`${section.label}-${index}`}
                                shot={shot}
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
