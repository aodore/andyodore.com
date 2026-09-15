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
};

export type CaseStudySection = {
  label: string;
  body: string;
  /** Screenshots below the copy. The closing section has none, by design. */
  images?: CaseStudyShot[];
};

/** Named separately because a case study reuses its shots across sections. */
const shots = {
  strategyTablet: {
    src: "/images/strategy-collection-tablet.webp",
    alt: "Strategy Collection on a tablet, showing a portfolio summary alongside budget, cross-product, and OKR panels.",
  },
  strategyPhone: {
    src: "/images/strategy-collection-phone.webp",
    alt: "Strategy Collection on a phone, showing the portfolio summary and a queue of suggested actions.",
  },
  postOfficeLaptop: {
    src: "/images/post-office-laptop.webp",
    alt: "An Atlassian home screen on a laptop, with a Spotlight message introducing work across Atlassian.",
  },
  postOfficeTablet: {
    src: "/images/post-office-tablet.webp",
    alt: "The same Spotlight onboarding message on a tablet, stepping through getting started.",
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
    image: "/images/strategy-collection.webp",
    mark: AtlassianMark,
    tint: "bg-tile-strategy",
    palette: "palette-strategy-collection",
    previous: "post-office",
    next: "campaign-manager",
    sections: [
      {
        label: "The initial direction",
        body:
          "Before Strategic Intelligence, leaders had no actionable, intelligent way to sense and steer their business. We started with a ‘For You’ page with three layers—Portfolio Health, Execution Feed, Active Tasks—each surfacing signals for Executives who need visibility, Buyers who own the operating cadence, and Contributors who input the signals. We embedded Rovo throughout, treating AI as intelligence woven into the insight layer.",
        images: [shots.strategyTablet],
      },
      {
        label: "The insight",
        body:
          "But the early signals revealed the real problem: leaders don’t need more data, they need better questions. A dashboard—even an AI-informed one—still asks users to hunt. That gap led us to pivot.",
        images: [shots.strategyPhone],
      },
      {
        label: "The new direction",
        body:
          "We rebuilt as an agent-first, chat-led interface where Rovo becomes the decision partner—surfacing the right signals to the right person at the right moment. Critically, we grounded intelligence in our teamwork graph data and built pathways for users to understand how signals were gathered, ensuring trust over black-box AI. For Executives: faster sensemaking. For Buyers: a trusted compass for running business rhythm. For Contributors: their inputs become visible impact.",
        images: [shots.strategyTablet],
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
    image: "/images/post-office.webp",
    mark: AtlassianMark,
    tint: "bg-tile-post-office",
    palette: "palette-post-office",
    previous: "campaign-manager",
    next: "strategy-collection",
    sections: [
      {
        label: "The opportunity",
        body:
          "Atlassian sends millions of in-product messages across its system of work, but with no coherent strategy. Teams built messaging from scratch, resulting in fragmented designs, message fatigue, and inconsistent experiences. Post Office was created to fix this: a centralized platform for orchestrating messaging across all channels (in-product, email, chat, push). My role was to lead Courier, Post Office’s pattern library—the foundational components and guidance that would enable teams to send the right message at the right time.",
        images: [shots.postOfficeLaptop],
      },
      {
        label: "The spotlight challenge",
        body:
          "For 10+ years, @atlaskit/onboarding—the ‘purple box’—was Atlassian’s onboarding component. It was failing: 75% dismissal rate, teams building custom workarounds, and technically impossible to modernize. Rather than patch it, we built new. I embedded directly with ADS for a sprint. We aligned on governance early—shared design commitment, clear documentation, owned pilots. That foundation shaped everything.",
        images: [shots.postOfficeTablet],
      },
      {
        label: "Our rigor",
        body:
          "We built @atlaskit/spotlight with composability at its core and encoded accessibility into the foundation. The design was intentional: it encouraged single-step messages by default, kept tours short, and pushed teams toward more disciplined usage patterns. Controlled rollouts let us measure impact in real products—and when Trello’s metrics dipped, they were able to customize the component without needing workarounds. That composability proved the design thesis: a well-architected component enables teams to adapt without abandoning consistency.",
        images: [shots.postOfficeLaptop],
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
    image: "/images/campaign-manager.webp",
    mark: CampaignManagerMark,
    tint: "bg-tile-campaign",
    palette: "palette-campaign-manager",
    previous: "strategy-collection",
    next: "post-office",
    sections: [
      {
        label: "The problem",
        body:
          "Before, Instacart’s marketing tooling was limited and not self-serve. Retailers who wanted to run campaigns had to rely on managed services or manual processes—slow, expensive, and inflexible.",
        images: [shots.campaignTablet],
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
