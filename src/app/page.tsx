import { redirect } from "next/navigation";
import { AboutRow } from "@/components/about-row";
import { AccentTally } from "@/components/accent-tally";
import { ExperienceToggle } from "@/components/experience-toggle";
import { HomeMonogram } from "@/components/home-monogram";
import { MonogramEntry } from "@/components/monogram-entry";
import { ProjectCard } from "@/components/project-card";
import { SayHello } from "@/components/say-hello";
import { SiteFooter } from "@/components/site-footer";
import { StaggerReveal } from "@/components/stagger-reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorkGate } from "@/components/work-gate";
import {
  caseStudies,
  caseStudyHref,
  getCaseStudy,
} from "@/lib/case-studies";
import { isGatedWorkSlug } from "@/lib/gated-work";
import { getTallyCounts } from "@/lib/tally-store";
import { hasWorkAccess } from "@/lib/work-session";

const perspective = [
  "I run my work like it\u2019s my own business.",
  "I go find the problem. I don\u2019t wait for the brief.",
  "I\u2019ve worked at every stage, pre-PMF to post-IPO. Same craft either way.",
  "I build foundations. The good ones outlive the thing they were built for.",
];

export default async function Home({ searchParams }: PageProps<"/">) {
  const unlocked = await hasWorkAccess();
  const unlock = (await searchParams).unlock;
  const requested =
    typeof unlock === "string" ? getCaseStudy(unlock) : undefined;
  const unlockSlug =
    requested && isGatedWorkSlug(requested.slug) ? requested.slug : undefined;

  if (unlocked && unlockSlug) {
    redirect(caseStudyHref(unlockSlug));
  }

  const tallyCounts = await getTallyCounts();

  return (
    <WorkGate unlocked={unlocked} initialSlug={unlockSlug}>
      {/* The id is what the entry hides behind itself while it is up, so the
          shell still lays out and nothing shifts when it is uncovered. */}
      <div
        id="site-shell"
        className="flex min-h-dvh flex-col px-6 md:px-10 xl:px-[46px]"
      >
        <div className="mx-auto flex w-full max-w-[1636px] flex-1 flex-col">
          <StaggerReveal className="flex flex-1 flex-col">
            <header className="flex items-start justify-between pt-8 xl:pt-[45px]">
              <HomeMonogram />
              <div className="t-stagger-line flex items-center gap-4">
                <ExperienceToggle />
                <ThemeToggle />
                <SayHello />
              </div>
            </header>

            <main>
              <h1 className="t-stagger-line text-ink font-display text-display mt-10 max-w-[9.5em] font-thin text-balance xl:mt-16">
                Great products start with curiosity and craft.
              </h1>
              <p className="t-stagger-line text-lede mt-4 text-base leading-snug font-light md:text-lg xl:mt-6 xl:text-2xl">
                I&rsquo;m Andy, a product designer. I&rsquo;m most useful when
                the problem is complex, the domain is broad, and the answer
                isn&rsquo;t obvious yet.
              </p>

              <section
                aria-label="Selected work"
                className="mt-10 grid grid-cols-1 gap-4 xl:mt-16 lg:grid-cols-3"
              >
                {caseStudies.map((study, index) => (
                  <ProjectCard
                    key={study.slug}
                    study={study}
                    priority={index === 0}
                  />
                ))}
              </section>

              <div className="mt-16 xl:mt-[102px]">
                <AboutRow label="The career">
                  <p>
                    Currently at{" "}
                    <strong className="font-semibold">Atlassian</strong>, I&rsquo;m
                    setting design direction on Strategy Collection, an AI-native
                    system that sharpens how leaders make decisions. Before that,
                    at <strong className="font-semibold">Instacart</strong>, I grew
                    a marketing platform from a four-retailer pilot to $192M in
                    attributed revenue. At{" "}
                    <strong className="font-semibold">Meta</strong>, I designed the
                    career growth, hiring, and workforce planning tools used by
                    every employee in the company. Earlier still, I was one of the first
                    product designers at{" "}
                    <strong className="font-semibold">Curalate</strong>, a martech
                    startup, where I hired and led a team as the company scaled
                    toward acquisition. I started in branding and identity design,
                    a foundation that still shapes how I approach every project.
                  </p>
                </AboutRow>

                <hr className="t-stagger-line border-rule my-10 xl:my-16" />

                <AboutRow label="The perspective">
                  <ul className="list-disc pl-[1.1em]">
                    {perspective.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </AboutRow>

                <hr className="t-stagger-line border-rule my-10 xl:my-16" />

                <AboutRow label="The fun">
                  <p>
                    Outside of work, you&rsquo;ll find me being a girl dad to my
                    three daughters, running long distances on purpose, making
                    Neapolitan pizza, and telling a dad joke whether you asked for
                    one or not.
                  </p>
                </AboutRow>

                <hr className="t-stagger-line border-rule my-10 xl:my-16" />

                <AccentTally initialCounts={tallyCounts} />
              </div>
            </main>

            <div className="mt-auto pt-20 pb-10 xl:pt-[157px] xl:pb-[45px]">
              <SiteFooter />
            </div>
          </StaggerReveal>
        </div>
      </div>

      <MonogramEntry />
    </WorkGate>
  );
}
