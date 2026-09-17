import { redirect } from "next/navigation";
import { AboutRow } from "@/components/about-row";
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
import { hasWorkAccess } from "@/lib/work-session";

const perspective = [
  "I run my work like it's my own business.",
  "I build what users actually need and what\u2019s good for the business.",
  "I like working with people who will challenge me and have fun.",
  "I build foundations \u2013 ones that last.",
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
                <ThemeToggle />
                <SayHello />
              </div>
            </header>

            <main>
              <h1 className="t-stagger-line text-ink font-display text-display mt-10 max-w-[9.5em] font-thin text-balance xl:mt-16">
                Great products start with curiosity and craft.
              </h1>
              <p className="t-stagger-line text-lede mt-4 text-base leading-snug font-light md:text-lg xl:mt-6 xl:text-2xl">
                I build systems and foundations that let organizations scale
                without losing either.
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
                    setting design direction on Strategy Collection, building
                    AI-native systems that sharpen how leaders make decisions.
                    Before that, I spent time at{" "}
                    <strong className="font-semibold">Instacart</strong>, growing a
                    marketing platform from a 4-retailer pilot to $192M in
                    attributed revenue, and at{" "}
                    <strong className="font-semibold">Meta</strong>, envisioning
                    career growth, hiring, and workforce planning tools used across
                    its global workforce. Earlier still, I was at{" "}
                    <strong className="font-semibold">Curalate</strong>, a startup,
                    as one of the first product designers there, building the design
                    org from the ground up as the company scaled toward acquisition.
                    I started in branding and identity design, a foundation that
                    still shapes how I approach every project.
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
                    three daughters, swinging a golf club when I can, and telling a
                    dad joke whether you asked for one or not.
                  </p>
                </AboutRow>
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
