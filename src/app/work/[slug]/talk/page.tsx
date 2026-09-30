import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TalkWindow } from "@/components/talk-window";
import { caseStudyShots, getCaseStudy } from "@/lib/case-studies";
import { hasTalkTrack, talkCueFor } from "@/lib/talk-track";

type TalkPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: TalkPageProps): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study || !hasTalkTrack(study.slug)) return {};
  return {
    title: { absolute: `Talk track — ${study.title}` },
    robots: { index: false, follow: false },
  };
}

export default async function TalkPage({ params, searchParams }: TalkPageProps) {
  const study = getCaseStudy((await params).slug);
  if (!study || !hasTalkTrack(study.slug)) notFound();

  const sessionParam = (await searchParams).session;
  const session =
    typeof sessionParam === "string" && /^[0-9a-f-]{36}$/i.test(sessionParam)
      ? sessionParam
      : "";

  const slides = caseStudyShots(study).map((shot) => {
    const cue = talkCueFor(study.slug, shot.src);
    if (!cue) return null;
    return {
      title: cue.title,
      onScreen: cue.onScreen,
      paragraphs: cue.paragraphs,
    };
  });

  return <TalkWindow slug={study.slug} session={session} slides={slides} />;
}
