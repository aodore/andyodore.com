import { AtlassianMark, CampaignManagerMark } from "@/components/brand";

export type CaseStudySlug =
  | "strategy-collection"
  | "post-office"
  | "campaign-manager";

export type CaseStudyShot = {
  src: string;
  /** Written here rather than taken from the design, which carries no alt text. */
  alt: string;
  width?: number;
  height?: number;
  kind?: "image" | "video";
  /** Small credit under the shot, opening in a new tab. */
  caption?: {
    label: string;
    href: string;
  };
  /** Caps the inline frame; the photo is cover-centered inside it. */
  maxHeight?: number;
};

export type CaseStudySection = {
  label: string;
  body: string;
  /** Screenshots below the copy. A nested array is a row of shots. */
  images?: Array<CaseStudyShot | CaseStudyShot[]>;
};

/** Named separately because a case study reuses its shots across sections. */
const shots = {
  strategyTablet: {
    src: "/images/strategy-collection-tablet.webp",
    alt: "A tablet on a wooden desk showing a Strategic Intelligence briefing, with a keyboard and pencil beside it.",
    width: 3272,
    height: 2454,
    maxHeight: 1200,
  },
  strategyBriefingStand: {
    src: "/images/strategy-collection-briefing-stand.webp",
    alt: "A Strategic Intelligence briefing for Veronica, with a Rovo summary of lagging focus areas, insight cards, and stacked dashboards.",
    width: 3272,
    height: 4192,
  },
  strategyBriefingHeadline: {
    src: "/images/strategy-collection-briefing-headline.webp",
    alt: "A briefing titled ARR on track, three areas behind, with insights, latest updates, and a What’s next list.",
    width: 3272,
    height: 4192,
  },
  strategyBriefingWeekly: {
    src: "/images/strategy-collection-briefing-weekly.webp",
    alt: "A weekly briefing with a yellow header, insight cards, dashboard tiles, and a What’s next timeline.",
    width: 3272,
    height: 4192,
  },
  strategyAgentSplit: {
    src: "/images/strategy-collection-agent-split.webp",
    alt: "An agent-first briefing with a large ARR on track headline, suggested prompts, and insight cards with charts.",
    width: 3272,
    height: 2256,
  },
  strategyAgentDark: {
    src: "/images/strategy-collection-agent-dark.webp",
    alt: "A dark briefing canvas with floating cards for new insights, items to pick back up, updated dashboards, and recent updates.",
    width: 3272,
    height: 2256,
  },
  strategyAgentBoard: {
    src: "/images/strategy-collection-agent-board.webp",
    alt: "A light briefing board with cards for Insights, Updates, and Dashboards around the ARR on track headline.",
    width: 3272,
    height: 2256,
  },
  strategyBriefingStable: {
    src: "/images/strategy-collection-briefing-stable.mp4",
    alt: "A film of a curated briefing for Olivia, titled Fill 12 open positions to unblock two focus areas, with insight cards and a Rovo prompt.",
    width: 3432,
    height: 2160,
    kind: "video",
  },
  strategyMcp: {
    src: "/images/strategy-collection-mcp.mp4",
    alt: "A film of a Cursor session writing a weekly briefing prompt with Atlassian Rovo MCP tools.",
    width: 3424,
    height: 2160,
    kind: "video",
  },
  strategyViews: {
    src: "/images/strategy-collection-views.mp4",
    alt: "A film of creating a view in the briefing, rolling up everything at risk across Strategy Collection and Talent.",
    width: 3428,
    height: 2160,
    kind: "video",
  },
  strategyForYou: {
    src: "/images/strategy-collection-for-you.webp",
    alt: "The Strategic Intelligence For you page, with focus-area status cards, an activity feed, and critique notes around the layout.",
    width: 3272,
    height: 1449,
  },
  strategyPersonas: {
    src: "/images/strategy-collection-personas.webp",
    alt: "Three audience cards for Bradley the beneficiary, Brian the buyer, and Olivia the contributor, each with a sticky-note job statement.",
    width: 3272,
    height: 2130,
  },
  strategyJob: {
    src: "/images/strategy-collection-job.webp",
    alt: "A What’s the job to be done slide with Bradley’s card: capture an accurate pulse of execution so he can make high-confidence decisions.",
    width: 3272,
    height: 1390,
  },
  strategyMoodboard: {
    src: "/images/strategy-collection-moodboard.webp",
    alt: "A moodboard of dashboards, product launches, sleep tracking, JARVIS-style overlays, and other interfaces that informed the early direction.",
    width: 3272,
    height: 1756,
  },
  strategyPhones: {
    src: "/images/strategy-collection-phones.webp",
    alt: "Four phone screens for an AI Experience portfolio: a score of 54, a weekly trend, a Rovo chat, and a generated briefing.",
    width: 3272,
    height: 1686,
  },
  strategySnapshot: {
    src: "/images/strategy-collection-snapshot.webp",
    alt: "A strategic snapshot for Olivia, with overview stats, a stacked status chart, and latest updates on Model Lifecycle and MLOps.",
    width: 3272,
    height: 2990,
  },
  postOfficeHero: {
    src: "/images/post-office-desk.webp",
    alt: "A laptop on a wooden cabinet showing Atlassian Home, with Getting started cards, Frequently visited, and a vase beside it.",
    width: 3272,
    height: 2454,
    maxHeight: 1200,
  },
  postOfficeNoise: {
    src: "/images/post-office-noise.webp",
    alt: "A Confluence page crowded with overlapping purple onboarding boxes, flags, and spotlights competing for attention.",
    width: 3272,
    height: 1664,
  },
  postOfficeCourier: {
    src: "/images/post-office-courier.webp",
    alt: "Courier’s messaging principles, four intensity levels from Subtle to Notable, and Confluence pages for Message Maker Guidance and the pattern library.",
    width: 3272,
    height: 3342,
  },
  postOfficeSpotlight: {
    src: "/images/post-office-spotlight.webp",
    alt: "Spotlight in Confluence on a Strategy Planning page, with an inline comment prompt and a notifications panel of comments and requests.",
    width: 3272,
    height: 1788,
  },
  postOfficeOnboarding: {
    src: "/images/post-office-onboarding.webp",
    alt: "Confluence Home with the old purple Welcome box versus Atlassian Home with Spotlight’s dark Welcome Home tooltip.",
    width: 3272,
    height: 1396,
  },
  postOfficeHome: {
    src: "/images/post-office-home.mp4",
    alt: "Atlassian Home with a Connect your work across Atlassian banner, Getting started cards for Jira, Confluence, Loom, and Rovo, and Frequently visited.",
    width: 2880,
    height: 1800,
    kind: "video",
  },
  postOfficeFlags: {
    src: "/images/post-office-flags.webp",
    alt: "A set of composable in-product messages: comments, reactions, published-page flags, replies, and a first-project tour.",
    width: 3272,
    height: 1760,
  },
  postOfficeChannels: {
    src: "/images/post-office-channels.webp",
    alt: "The same messaging system across channels: in-product flags, a Confluence page, and an email digest of what the team is reading.",
    width: 3272,
    height: 1788,
  },
  postOfficeAttention: {
    src: "/images/post-office-attention.webp",
    alt: "The level of attention framework on a Jira Product Discovery overlay: notable attention, overlay with blanket, major brand moment, and rare frequency.",
    width: 3272,
    height: 1872,
  },
  postOfficeMoments: {
    src: "/images/post-office-moments.webp",
    alt: "A grid of branded moment overlays across Confluence, Teams, Jira Product Discovery, and Jira Service Management.",
    width: 3272,
    height: 1886,
  },
  postOfficeAcrossApps: {
    src: "/images/post-office-across-apps.webp",
    alt: "Spotlight across Atlassian surfaces—Home, Teamwork, Focus, Bitbucket, Jira Service Management, and Discovery—around a Coherent across apps & collections title.",
    width: 3272,
    height: 1883,
  },
  postOfficeFigma: {
    src: "/images/post-office-figma.webp",
    alt: "The Spotlight Figma kit: ready-made examples in light and dark, component variants by caret position, and purple code parts.",
    width: 3272,
    height: 2454,
  },
  postOfficeUsage: {
    src: "/images/post-office-usage.webp",
    alt: "The Atlassian Design System Spotlight usage page, with guidance for a single-step spotlight on a Jira board.",
    width: 3272,
    height: 1696,
    caption: {
      label: "Check it out",
      href: "https://atlassian.design/components/spotlight/usage",
    },
  },
  campaignHero: {
    src: "/images/campaign-manager-desk.webp",
    alt: "A laptop on a wooden cabinet showing Instacart Brand overview, with spend and sales performance over the last 90 days.",
    width: 3272,
    height: 2454,
    maxHeight: 1200,
  },
  campaignOffers: {
    src: "/images/campaign-manager-offers.webp",
    alt: "The old Unata offers admin: a table of draft offers above a form for a free-delivery offer, with dates, conditions, and a customer list.",
    width: 3272,
    height: 1670,
  },
  campaignModel: {
    src: "/images/campaign-manager-model.webp",
    alt: "A system diagram of campaign inputs on the retailer side and campaign outputs on the consumer side, connected by data, action, and experience.",
    width: 3272,
    height: 1897,
  },
  campaignFramework: {
    src: "/images/campaign-manager-framework.webp",
    alt: "A campaign framework stacked as objective, setup, targeting, offer, and promote, with the questions each step has to answer.",
    width: 3272,
    height: 1430,
  },
  campaignTablet: {
    src: "/images/campaign-manager-create.webp",
    alt: "The Instacart campaign builder on the create step, with cards for acquire, grow basket, and win-back objectives, and a phone preview of the storefront.",
    width: 3272,
    height: 1732,
  },
  campaignName: {
    src: "/images/campaign-manager-name.webp",
    alt: "The Instacart campaign builder naming a draft campaign and setting its goal, schedule, targeting, and offer.",
    width: 3272,
    height: 3026,
  },
  campaignTargeting: {
    src: "/images/campaign-manager-targeting.webp",
    alt: "The Instacart campaign builder with targeting open, showing a non-loyalty customer segment covering 50% of shoppers.",
    width: 3272,
    height: 2774,
  },
  campaignStorefront: {
    src: "/images/campaign-manager-storefront.webp",
    alt: "A live storefront editor with the mobile preview open and an Add Section menu for categories, collection, banner, and display unit.",
    width: 3272,
    height: 1788,
  },
  campaignBanner: {
    src: "/images/campaign-manager-banner.webp",
    alt: "The storefront editor with a banner selected on the mobile preview and its image, type, and lookup settings in the side panel.",
    width: 3272,
    height: 1788,
  },
  campaignPromote: {
    src: "/images/campaign-manager-promote.webp",
    alt: "A collage of campaign promotion placements, grocery ads, offer setup, targeting rules, and customer-match summaries.",
    width: 3272,
    height: 3476,
  },
  campaignOffer: {
    src: "/images/campaign-manager-offer.webp",
    alt: "The campaign builder Offer step, with shortcut rewards, earning conditions, and redemption rules for a loyalty campaign.",
    width: 3272,
    height: 3602,
  },
  campaignInsights: {
    src: "/images/campaign-manager-insights.webp",
    alt: "Brand overview insights showing Instacart performance, category mix, products in active campaigns, and page metrics.",
    width: 3272,
    height: 4510,
  },
} satisfies Record<string, CaseStudyShot>;

export type CaseStudy = {
  slug: CaseStudySlug;
  title: string;
  /** The home page card sets it in sentence case, matching the design. */
  cardTitle?: string;
  /** Company, role, and year, on the line under the title. */
  meta: string;
  /** For the page description. Not in the design file. */
  summary: string;
  /** Portrait card art for the home page grid. */
  image: string;
  mark: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Sits behind the photo, so a slow image load still reads as designed. */
  tint: string;
  /** Rebinds the color slots to this project's palette, for the card leading here. */
  palette: string;
  sections: CaseStudySection[];
  /** Full-width shot above the first section, when the story opens on a photo. */
  hero?: CaseStudyShot;
  /** Optional clip under the hero, in the same rounded frame as the stills. */
  heroClip?: CaseStudyShot;
  /** The design cycles the work in a different order than the home grid. */
  previous: CaseStudySlug;
  next: CaseStudySlug;
};

/** Home page order. Walking between case studies follows previous/next. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "strategy-collection",
    title: "Strategy Collection",
    meta: "Atlassian • Lead Product Designer • 2026",
    summary:
      "Setting design direction on Strategic Intelligence at Atlassian: an agent-first decision partner grounded in the teamwork graph.",
    image: "/images/strategy-collection-hero.webp",
    mark: AtlassianMark,
    tint: "bg-tile-strategy",
    palette: "palette-strategy-collection",
    previous: "post-office",
    next: "campaign-manager",
    hero: shots.strategyTablet,
    heroClip: {
      src: "/images/strategy-collection-clip.mp4",
      alt: "A Strategy Collection film, opening on a chess pawn and rook.",
      width: 1920,
      height: 1080,
      kind: "video",
    },
    sections: [
      {
        label: "The initial direction",
        body:
          "Before Strategic Intelligence, leaders had no actionable, intelligent way to sense and steer their business. We started with a ‘For You’ page with three layers—Portfolio Health, Execution Feed, Active Tasks—each surfacing signals for Executives who need visibility, Buyers who own the operating cadence, and Contributors who input the signals. We embedded Rovo throughout, treating AI as intelligence woven into the insight layer.",
        images: [
          shots.strategyForYou,
          shots.strategyPersonas,
          shots.strategyJob,
          shots.strategyMoodboard,
          shots.strategyPhones,
          shots.strategySnapshot,
        ],
      },
      {
        label: "The insight",
        body:
          "But the early signals revealed the real problem: leaders don’t need more data, they need better questions. A dashboard—even an AI-informed one—still asks users to hunt. That gap led us to pivot.",
        images: [
          [
            shots.strategyBriefingStand,
            shots.strategyBriefingHeadline,
            shots.strategyBriefingWeekly,
          ],
        ],
      },
      {
        label: "The new direction",
        body:
          "We rebuilt as an agent-first, chat-led interface where Rovo becomes the decision partner—surfacing the right signals to the right person at the right moment. Critically, we grounded intelligence in our teamwork graph data and built pathways for users to understand how signals were gathered, ensuring trust over black-box AI. For Executives: faster sensemaking. For Buyers: a trusted compass for running business rhythm. For Contributors: their inputs become visible impact.",
        images: [
          [
            shots.strategyAgentSplit,
            shots.strategyAgentDark,
            shots.strategyAgentBoard,
          ],
          shots.strategyBriefingStable,
          shots.strategyMcp,
          shots.strategyViews,
        ],
      },
      {
        label: "The outcome",
        body:
          "The prototype became the centerpiece for Strategy Collection at Team ’26, reshaping the entire product direction. This vision is now driving how we attract and onboard new customers—positioning Strategic Intelligence as the decision-operating system for the collection.",
      },
    ],
  },
  {
    slug: "post-office",
    title: "Post Office",
    meta: "Atlassian • Lead Product Designer • 2025",
    summary:
      "Leading Courier, Post Office’s pattern library at Atlassian, and shipping @atlaskit/spotlight to unify in-product messaging.",
    image: "/images/post-office-hero.webp",
    mark: AtlassianMark,
    tint: "bg-tile-post-office",
    palette: "palette-post-office",
    previous: "campaign-manager",
    next: "strategy-collection",
    hero: shots.postOfficeHero,
    sections: [
      {
        label: "The opportunity",
        body:
          "Atlassian sends millions of in-product messages across its system of work, but with no coherent strategy. Teams built messaging from scratch, resulting in fragmented designs, message fatigue, and inconsistent experiences. Post Office was created to fix this: a centralized platform for orchestrating messaging across all channels (in-product, email, chat, push). My role was to lead Courier, Post Office’s pattern library—the foundational components and guidance that would enable teams to send the right message at the right time.",
        images: [
          shots.postOfficeNoise,
          shots.postOfficeCourier,
          shots.postOfficeSpotlight,
          shots.postOfficeFlags,
          shots.postOfficeChannels,
          shots.postOfficeAttention,
          shots.postOfficeMoments,
        ],
      },
      {
        label: "The spotlight challenge",
        body:
          "For 10+ years, @atlaskit/onboarding—the ‘purple box’—was Atlassian’s onboarding component. It was failing: 75% dismissal rate, teams building custom workarounds, and technically impossible to modernize. Rather than patch it, we built new. I embedded directly with ADS for a sprint. We aligned on governance early—shared design commitment, clear documentation, owned pilots. That foundation shaped everything.",
        images: [shots.postOfficeOnboarding, shots.postOfficeHome],
      },
      {
        label: "Our rigor",
        body:
          "We built @atlaskit/spotlight with composability at its core and encoded accessibility into the foundation. The design was intentional: it encouraged single-step messages by default, kept tours short, and pushed teams toward more disciplined usage patterns. Controlled rollouts let us measure impact in real products—and when Trello’s metrics dipped, they were able to customize the component without needing workarounds. That composability proved the design thesis: a well-architected component enables teams to adapt without abandoning consistency.",
        images: [
          shots.postOfficeAcrossApps,
          shots.postOfficeFigma,
          shots.postOfficeUsage,
        ],
      },
      {
        label: "The outcome",
        body:
          "Spotlight shipped with real adoption across Atlassian. Controlled rollouts let teams measure impact—Trello even customized the composable architecture when metrics shifted. Spotlight proved Courier’s thesis: a well-designed pattern library with strong governance and smart tooling can unify messaging, reduce design friction, and scale adoption at Atlassian’s size.",
      },
    ],
  },
  {
    slug: "campaign-manager",
    title: "Campaign Manager",
    cardTitle: "Campaign manager",
    meta: "Instacart • Staff Product Designer • 2024",
    summary:
      "A self-serve campaign builder for Instacart retailers that grew to $192M in gross merchandising value with 100% retailer adoption.",
    image: "/images/campaign-manager-hero.webp",
    mark: CampaignManagerMark,
    tint: "bg-tile-campaign",
    palette: "palette-campaign-manager",
    previous: "strategy-collection",
    next: "post-office",
    hero: shots.campaignHero,
    sections: [
      {
        label: "The problem",
        body:
          "Before, Instacart’s marketing tooling was limited and not self-serve. Retailers who wanted to run campaigns had to rely on managed services or manual processes—slow, expensive, and inflexible.",
        images: [
          shots.campaignOffers,
          shots.campaignModel,
          shots.campaignFramework,
          shots.campaignTablet,
        ],
      },
      {
        label: "Why it mattered",
        body:
          "Retailers couldn’t move fast on seasonal moments or test ideas. We were leaving money on the table and blocking a major revenue stream for the business.",
        images: [shots.campaignName, shots.campaignTargeting],
      },
      {
        label: "Our approach",
        body:
          "We designed a self-serve campaign builder that let retailers create and launch campaigns directly on their Marketplace storefront or white-label site—no middleman, no delays.",
        images: [shots.campaignStorefront, shots.campaignBanner, shots.campaignPromote],
      },
      {
        label: "The solution",
        body:
          "The tool surfaces key business goals (acquire customers, win back lapsed shoppers, drive category adoption) and guides retailers through building, targeting, and tracking campaigns. Embedded insights show performance metrics in real time.",
        images: [shots.campaignOffer, shots.campaignInsights],
      },
      {
        label: "The outcome",
        body:
          "Launched as the self-serve tier of Instacart Marketing Solutions, the tool generated $192M in Gross Merchandising Value with 100% retailer adoption—shifting the company’s go-to-market from managed-only services to a three-tier platform that now drives a major revenue stream.",
      },
    ],
  },
];

export function caseStudyHref(slug: CaseStudySlug) {
  return `/work/${slug}` as const;
}

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

/** Document order, including repeats, so the lightbox walks the page. */
function flattenImages(images: CaseStudySection["images"]) {
  return (images ?? []).flatMap((item) =>
    Array.isArray(item) ? item : [item],
  );
}

export function caseStudyShots(study: CaseStudy) {
  return [
    ...(study.hero ? [study.hero] : []),
    ...(study.heroClip ? [study.heroClip] : []),
    ...study.sections.flatMap((section) => flattenImages(section.images)),
  ];
}
