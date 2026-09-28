import { AtlassianMark, CampaignManagerMark } from "@/components/brand";
import { canonicalWorkSlug } from "@/lib/gated-work";

export type CaseStudySlug =
  | "strategic-intelligence"
  | "post-office"
  | "campaign-manager";

export type CaseStudyShot = {
  src: string;
  /** Written here rather than taken from the design, which carries no alt text. */
  alt: string;
  width?: number;
  height?: number;
  kind?: "image" | "video" | "placeholder";
  /** Small line under the shot. A href makes it a credit that opens in a new tab. */
  caption?: {
    label: string;
    href?: string;
  };
  /** Caps the inline frame; the photo is cover-cropped inside it. */
  maxHeight?: number;
  /** Cover crop origin. Defaults to center. Use `bottom` to take height off the top. */
  objectPosition?: string;
};

export type CaseStudyFact = {
  label: string;
  value: string;
};

export type CaseStudyParagraph =
  | string
  | {
      /** Bold line that sits above the rest of the paragraph. */
      lead: string;
      rest: string;
    };

export type CaseStudySection = {
  label?: string;
  body?: string | CaseStudyParagraph[];
  /** Spec-sheet lines, used when a section is a brief rather than a paragraph. */
  facts?: CaseStudyFact[];
  /** Bullet list. Can sit on its own or under body. */
  list?: CaseStudyParagraph[];
  /** Copy that follows the list in the same section. */
  after?: string | CaseStudyParagraph[];
  /** A second bullet list, after `after`. */
  afterList?: CaseStudyParagraph[];
  /** Sit the copy between the hero still and the hero clip. Shots stay after. */
  beforeClip?: boolean;
  /** Screenshots below the copy. A nested array is a row of shots. */
  images?: Array<CaseStudyShot | CaseStudyShot[]>;
};

export type CaseStudyGuideBlock =
  | { kind: "heading"; text: string }
  | { kind: "copy"; lead?: string; rest: string }
  | {
      kind: "bullets";
      items: Array<string | { lead: string; rest: string }>;
    }
  | { kind: "caption"; text: string; shotIndex: number };

export type CaseStudyGuide = {
  title: string;
  meta: string;
  tags: string[];
  blocks: CaseStudyGuideBlock[];
};

/** Named separately because a case study reuses its shots across sections. */
function placeholderShot(alt: string, caption: string): CaseStudyShot {
  return {
    src: `placeholder:${caption}`,
    alt,
    width: 1600,
    height: 1000,
    kind: "placeholder",
    caption: { label: caption },
  };
}

const shots = {
  strategyTablet: {
    src: "/images/strategy-collection-tablet.webp",
    alt: "A tablet on a wooden desk showing a Strategic Intelligence briefing, with a keyboard and pencil beside it.",
    width: 3272,
    height: 2454,
    maxHeight: 1100,
    objectPosition: "bottom",
    caption: { label: "The briefing, as it would sit with a leader." },
  },
  strategyBriefingStand: {
    src: "/images/strategy-collection-briefing-stand.webp",
    alt: "A Strategic Intelligence briefing for Veronica, with a Rovo summary of lagging focus areas, insight cards, and stacked dashboards.",
    width: 3272,
    height: 4192,
    caption: {
      label: "Exploration 1: More AI summary centric",
    },
  },
  strategyBriefingHeadline: {
    src: "/images/strategy-collection-briefing-headline.webp",
    alt: "A briefing titled ARR on track, three areas behind, with insights, latest updates, and a What’s next list.",
    width: 3272,
    height: 3368,
    caption: { label: "Exploration 2: Tighten up the page content w/ stacked cards" },
  },
  strategyBriefingWeekly: {
    src: "/images/strategy-collection-briefing-weekly.webp",
    alt: "A weekly briefing with a yellow header, insight cards, dashboard tiles, and a What’s next timeline.",
    width: 3272,
    height: 4192,
    caption: {
      label:
        "Exploration 3: Inject more color from the brand + add more common components",
    },
  },
  strategyAgentSplit: {
    src: "/images/strategy-collection-agent-split.webp",
    alt: "An agent-first briefing with a large ARR on track headline, suggested prompts, and insight cards with charts.",
    width: 3272,
    height: 2256,
    caption: { label: "First exploration won — dual-panel layout" },
  },
  strategyAgentDark: {
    src: "/images/strategy-collection-agent-dark.webp",
    alt: "A dark briefing canvas with floating cards for new insights, items to pick back up, updated dashboards, and recent updates.",
    width: 3272,
    height: 2256,
    caption: {
      label: "Inject more brand expression — deep dive to each section",
    },
  },
  strategyAgentBoard: {
    src: "/images/strategy-collection-agent-board.webp",
    alt: "A light briefing board with cards for Insights, Updates, and Dashboards around the ARR on track headline.",
    width: 3272,
    height: 2256,
    caption: {
      label: "Stacked card + brand expression w/ Rovo",
    },
  },
  strategyBriefingStable: {
    src: "/images/strategy-collection-briefing-stable.mp4",
    alt: "A film of a curated briefing for Olivia, titled Fill 12 open positions to unblock two focus areas, with insight cards and a Rovo prompt.",
    width: 3432,
    height: 2160,
    kind: "video",
    caption: { label: "Rovo trust, discovery, and action" },
  },
  strategyMcp: {
    src: "/images/strategy-collection-mcp.mp4",
    alt: "A film of a Cursor session writing a weekly briefing prompt with Atlassian Rovo MCP tools.",
    width: 3424,
    height: 2160,
    kind: "video",
    caption: {
      label: "Headless expression of the briefing with our MCP",
    },
  },
  strategyViews: {
    src: "/images/strategy-collection-views.mp4",
    alt: "A film of creating a view in the briefing, rolling up everything at risk across Strategy Collection and Talent.",
    width: 3428,
    height: 2160,
    kind: "video",
    caption: {
      label: "Extension of the experience to create custom views of data",
    },
  },
  strategyWorkInsight: placeholderShot(
    "Placeholder for the insight-card hierarchy.",
    "Insight cards: Cause-first hierarchy and progressive disclosure, so leaders see why before what.",
  ),
  strategyWorkSurfaces: placeholderShot(
    "Placeholder for the three-surface architecture: Inbox, Dashboard, and Report.",
    "Three-surface architecture: Inbox to act, Dashboard to review, Report to share.",
  ),
  strategyWorkViz: placeholderShot(
    "Placeholder for the three data-visualization primitives: sparkline, progress bar, and donut.",
    "Data visualization system: Collapsed to three primitives (sparkline, progress bar, donut) with deterministic rules engineers could build without ambiguity.",
  ),
  strategyWorkVerify: placeholderShot(
    "Placeholder for human-in-the-loop verification.",
    "Human-in-the-loop verification: Owner-gated and open verification models, so AI output earns trust before it reaches an executive.",
  ),
  strategyWorkSkills: placeholderShot(
    "Placeholder for briefing skills that generate executive summaries.",
    "Briefing skills: I wrote and designed the skills that generate summaries in an executive’s voice.",
  ),
  strategyForYou: {
    src: "/images/strategy-collection-for-you.webp",
    alt: "The Strategic Intelligence For you page, with focus-area status cards, an activity feed, and critique notes around the layout.",
    width: 3272,
    height: 1449,
    caption: {
      label: "V0’s For you page, showing the issues.",
    },
  },
  strategyPersonas: {
    src: "/images/strategy-collection-personas.webp",
    alt: "Three audience cards for Bradley the beneficiary, Brian the buyer, and Olivia the contributor, each with a sticky-note job statement.",
    width: 3272,
    height: 2130,
    caption: {
      label:
        "Three audiences: the executive who decides, the buyer who funds, the operator who delivers.",
    },
  },
  strategyJob: {
    src: "/images/strategy-collection-job.webp",
    alt: "A What’s the job to be done slide with Bradley’s card: capture an accurate pulse of execution so he can make high-confidence decisions.",
    width: 3272,
    height: 1390,
    caption: {
      label: "Bradley’s job to be done: an accurate pulse of execution.",
    },
  },
  strategyMoodboard: {
    src: "/images/strategy-collection-moodboard.webp",
    alt: "A moodboard of dashboards, product launches, sleep tracking, JARVIS-style overlays, and other interfaces that informed the early direction.",
    width: 3272,
    height: 1756,
    caption: { label: "The moodboard that informed the early direction." },
  },
  strategyPhones: {
    src: "/images/strategy-collection-phones.webp",
    alt: "Four phone screens for an AI Experience portfolio: a score of 54, a weekly trend, a Rovo chat, and a generated briefing.",
    width: 3272,
    height: 1686,
    caption: {
      label:
        "An AI Experience prototype: score, trend, chat, and a generated briefing.",
    },
  },
  strategySnapshot: {
    src: "/images/strategy-collection-snapshot.webp",
    alt: "A strategic snapshot for Olivia, with 29 of 40 focus areas needing attention, status bars, and latest updates on Model Lifecycle and AI Platform.",
    width: 3272,
    height: 2990,
    caption: {
      label: "V1’s snapshot: 29 of 40 focus areas needing attention.",
    },
  },
  postOfficeHero: {
    src: "/images/post-office-desk.webp",
    alt: "A laptop on a wooden cabinet showing Atlassian Home, with Getting started cards, Frequently visited, and a vase beside it.",
    width: 3272,
    height: 2454,
    maxHeight: 900,
    caption: { label: "A friendly spotlight welcoming you home." },
  },
  postOfficeNoise: {
    src: "/images/post-office-noise.webp",
    alt: "A Confluence page crowded with overlapping purple onboarding boxes, flags, and spotlights competing for attention.",
    width: 3272,
    height: 1664,
    caption: { label: "The purple-box pile-up: too many messages, no system." },
  },
  postOfficeCourier: {
    src: "/images/post-office-courier.webp",
    alt: "Courier’s messaging principles, four intensity levels from Subtle to Notable, and Confluence pages for Message Maker Guidance and the pattern library.",
    width: 3272,
    height: 3342,
    caption: {
      label: "Courier: principles, intensity levels, and the pattern library.",
    },
  },
  postOfficeSpotlight: {
    src: "/images/post-office-spotlight.webp",
    alt: "Spotlight in Confluence on a Strategy Planning page, with an inline comment prompt and a notifications panel of comments and requests.",
    width: 3272,
    height: 1788,
    caption: { label: "Experiment: Drive comment replies on docs with flags." },
  },
  postOfficeOnboarding: {
    src: "/images/post-office-onboarding.webp",
    alt: "Confluence Home with the old purple Welcome box versus Atlassian Home with Spotlight’s dark Welcome Home tooltip.",
    width: 3272,
    height: 1396,
    caption: { label: "The old purple box versus Spotlight on Home." },
  },
  postOfficeHome: {
    src: "/images/post-office-home.mp4",
    alt: "Atlassian Home with a Connect your work across Atlassian banner, Getting started cards for Jira, Confluence, Loom, and Rovo, and Frequently visited.",
    width: 2880,
    height: 1800,
    kind: "video",
    caption: { label: "Spotlight solution in action with motion." },
  },
  postOfficeFlags: {
    src: "/images/post-office-flags.webp",
    alt: "A set of composable in-product messages: comments, reactions, published-page flags, replies, and a first-project tour.",
    width: 3272,
    height: 1760,
    caption: {
      label: "Experiments: Flag replies, flag reacts, and next best actions.",
    },
  },
  postOfficeChannels: {
    src: "/images/post-office-channels.webp",
    alt: "The same messaging system across channels: in-product flags, a Confluence page, and an email digest of what the team is reading.",
    width: 3272,
    height: 1788,
    caption: { label: "Experiments: Side panel banners, media flags, and email." },
  },
  postOfficeAttention: {
    src: "/images/post-office-attention.webp",
    alt: "The level of attention framework on a Jira Product Discovery overlay: notable attention, overlay with blanket, major brand moment, and rare frequency.",
    width: 3272,
    height: 1872,
    caption: {
      label: "Level of attention: notable, overlay, major brand moment, rare.",
    },
  },
  postOfficeMoments: {
    src: "/images/post-office-moments.webp",
    alt: "A grid of branded moment overlays across Confluence, Teams, Jira Product Discovery, and Jira Service Management.",
    width: 3272,
    height: 1886,
    caption: {
      label: "Courier example: Modals as a system",
    },
  },
  postOfficeAcrossApps: {
    src: "/images/post-office-across-apps.webp",
    alt: "Spotlight across Atlassian surfaces—Home, Teamwork, Focus, Bitbucket, Jira Service Management, and Discovery—around a Coherent across apps & collections title.",
    width: 3272,
    height: 1883,
    caption: { label: "Extensible spotlight across collections." },
  },
  postOfficeFigma: {
    src: "/images/post-office-figma.webp",
    alt: "The Spotlight Figma kit: ready-made examples in light and dark, component variants by caret position, and purple code parts.",
    width: 3272,
    height: 2454,
    caption: {
      label: "The Spotlight Figma kit: examples, variants, and code parts.",
    },
  },
  postOfficeUsage: {
    src: "/images/post-office-usage.webp",
    alt: "The Atlassian Design System Spotlight usage page, with guidance for a single-step spotlight on a Jira board.",
    width: 3272,
    height: 1696,
    caption: {
      label: "Spotlight design guidance + usage rules.",
      href: "https://atlassian.design/components/spotlight/usage",
    },
  },
  campaignHero: {
    src: "/images/campaign-manager-desk.webp",
    alt: "A laptop on a wooden cabinet showing Instacart Brand overview, with spend and sales performance over the last 90 days.",
    width: 3272,
    height: 2454,
    maxHeight: 900,
    caption: { label: "Brand overview, as a retailer would see it." },
  },
  campaignOffers: {
    src: "/images/campaign-manager-offers.webp",
    alt: "The old Unata offers admin: a table of draft offers above a form for a free-delivery offer, with dates, conditions, and a customer list.",
    width: 3272,
    height: 1670,
    caption: {
      label: "Every campaign went through an ops team, and no one could see the results.",
    },
  },
  campaignModel: {
    src: "/images/campaign-manager-model.webp",
    alt: "A system diagram of campaign inputs on the retailer side and campaign outputs on the consumer side, connected by data, action, and experience.",
    width: 3272,
    height: 1897,
    caption: { label: "Campaign inputs on one side, outputs on the other." },
  },
  campaignFramework: {
    src: "/images/campaign-manager-framework.webp",
    alt: "A campaign framework stacked as objective, setup, targeting, offer, and promote, with the questions each step has to answer.",
    width: 3272,
    height: 1430,
    caption: { label: "Objective, setup, targeting, offer, promote." },
  },
  campaignTablet: {
    src: "/images/campaign-manager-create.webp",
    alt: "The Instacart campaign builder on the create step, with cards for acquire, grow basket, and win-back objectives, and a phone preview of the storefront.",
    width: 3272,
    height: 1732,
    caption: { label: "Create: acquire, grow basket, or win-back." },
  },
  campaignMvp: {
    src: "/images/campaign-manager-capabilities.webp",
    alt: "Three cards on merchandising versus ads, different outcomes, and overlapping capabilities, with a recommendation for a custom frontend on the ads backend.",
    width: 3272,
    height: 1460,
    caption: {
      label: "Different users up front, shared capabilities underneath.",
    },
  },
  campaignVision: {
    src: "/images/campaign-manager-vision.webp",
    alt: "A Mother’s Day campaign in the storefront builder, with a mobile Preview Overview of load screen, home, landing page, search results, and product detail.",
    width: 3272,
    height: 1684,
    caption: {
      label: "Vision sprint: a merchandising manager building a Mother’s Day campaign.",
    },
  },
  campaignName: {
    src: "/images/campaign-manager-name.webp",
    alt: "The Instacart campaign builder naming a draft campaign and setting its goal, schedule, targeting, and offer.",
    width: 3272,
    height: 3026,
    caption: { label: "Naming a campaign and setting the goal." },
  },
  campaignTargeting: {
    src: "/images/campaign-manager-targeting.webp",
    alt: "The Instacart campaign builder with targeting open, showing a non-loyalty customer segment covering 50% of shoppers.",
    width: 3272,
    height: 2774,
    caption: {
      label: "Targeting a non-loyalty segment covering 50% of shoppers.",
    },
  },
  campaignStorefront: {
    src: "/images/campaign-manager-storefront.webp",
    alt: "A live storefront editor with the mobile preview open and an Add Section menu for categories, collection, banner, and display unit.",
    width: 3272,
    height: 1788,
    caption: { label: "Retailers see the result of every decision." },
  },
  campaignBanner: {
    src: "/images/campaign-manager-banner.webp",
    alt: "The storefront editor with a banner selected on the mobile preview and its image, type, and lookup settings in the side panel.",
    width: 3272,
    height: 1788,
    caption: { label: "A banner on the storefront, edited in place." },
  },
  campaignPromote: {
    src: "/images/campaign-manager-promote.webp",
    alt: "A collage of campaign promotion placements, grocery ads, offer setup, targeting rules, and customer-match summaries.",
    width: 3272,
    height: 3476,
    caption: { label: "Promotion placements, ads, offers, and targeting." },
  },
  campaignOffer: {
    src: "/images/campaign-manager-offer.webp",
    alt: "The campaign builder Offer step, with shortcut rewards, earning conditions, and redemption rules for a loyalty campaign.",
    width: 3272,
    height: 3602,
    caption: { label: "Start simple, go deep when you need to." },
  },
  campaignInsights: {
    src: "/images/campaign-manager-insights.webp",
    alt: "Brand overview insights showing Instacart performance, category mix, products in active campaigns, and page metrics.",
    width: 3272,
    height: 4510,
    caption: {
      label: "Closing the loop on every campaign.",
    },
  },
} satisfies Record<string, CaseStudyShot>;

export type CaseStudy = {
  slug: CaseStudySlug;
  title: string;
  /** Company, role, and year, on the line under the title. */
  meta: string;
  /** Ghost chips on the home card and under the case-study meta line. */
  tags: string[];
  /** The mark on the home card. Hovering it names the company. */
  company: string;
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
  /** Neighbors in `caseStudies` order, wrapping around. */
  previous: CaseStudySlug;
  next: CaseStudySlug;
};

/** Home page, carousel arrows, and project nav all walk this order. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "strategic-intelligence",
    title: "Strategic Intelligence",
    meta: "Turning founder doubt into the direction for Atlassian’s Strategy Collection",
    tags: ["Pre-PMF", "AI-native", "Leadership vision"],
    company: "Atlassian",
    summary:
      "Setting design direction on Strategic Intelligence at Atlassian: an agent-first decision partner grounded in the teamwork graph.",
    image: "/images/strategy-collection-hero.webp",
    mark: AtlassianMark,
    tint: "bg-tile-strategy",
    palette: "palette-strategy-collection",
    previous: "campaign-manager",
    next: "post-office",
    hero: shots.strategyTablet,
    heroClip: {
      src: "/images/strategy-collection-clip.mp4",
      alt: "A Strategic Intelligence film, opening on a chess pawn and rook.",
      width: 1920,
      height: 1080,
      kind: "video",
      caption: {
        label: "What is Strategy Collection?",
      },
    },
    sections: [
      {
        label: "At a glance",
        beforeClip: true,
        facts: [
          {
            label: "Company & product",
            value:
              "Atlassian, Strategic Intelligence in the Strategy Collection (Focus, Talent, Align)",
          },
          {
            label: "My role",
            value:
              "Lead Product Designer and sole designer. Owned design direction and execution; co-wrote the product strategy with the Head of Product.",
          },
          {
            label: "Team",
            value:
              "Head of Product, PM, engineering leadership + 6 engineers, Strategy & Business Ops. Direct CEO visibility.",
          },
          {
            label: "Timeline",
            value:
              "Started January 2026. V1 shared at TEAM ’26 in May; V2 ready for TEAM EU in October 2026.",
          },
          {
            label: "Outcome",
            value:
              "CEO and Head of Product sign-off, six pilot customers, featured in the founder’s keynotes at TEAM ’26 and TEAM EU, and now the direction for the whole collection.",
          },
          {
            label: "What I’m proudest of",
            value:
              "Asking for a week to pivot when the org wanted speed, and coming back with the direction that won the founder over.",
          },
        ],
      },
      {
        label: "The bet",
        body: [
          "Executives were steering on stale slide decks while the real signal sat in Jira and Confluence.",
          "Strategic Intelligence serves three people. The executive makes the call, the portfolio leader signs the check, and operations leaders do the work day to day. The executive’s job to be done: continuously capture an accurate pulse of execution, so they can make confident decisions and course corrections without outdated decks or manual updates.",
        ],
        images: [shots.strategyPersonas, shots.strategyJob],
      },
      {
        label: "Why now",
        list: [
          {
            lead: "Atlassian already owns the execution layer.",
            rest: "Over 300,000 organizations run their work in Jira and Confluence. The Teamwork Graph connects strategy to real-time execution without duplicate tracking.",
          },
          {
            lead: "GenAI collapsed synthesis from weeks to seconds, but only with the right context.",
            rest: "Pairing Rovo with the Teamwork Graph turns passive dashboards into proactive signals.",
          },
          {
            lead: "Customers were ready.",
            rest: "By late 2025, nearly a third of Atlassian’s top 200 Cloud customers had passed 25% AI adoption.",
          },
          {
            lead: "Strategy is the roof of the System of Work.",
            rest: "It is Atlassian’s path from collaboration vendor to executive strategy platform.",
          },
          {
            lead: "The constraint:",
            rest: "A pre-PMF product with a skeptical founder, a brittle backend, and no Teamwork Graph access in V1. Without a breakthrough, the collection was on life support.",
          },
        ],
        images: [shots.strategyMoodboard],
      },
      {
        label: "My role and leverage",
        list: [
          "Sole designer; owned design direction and execution end to end",
          "Co-wrote the product strategy with the Head of Product",
          "Drafted requirements with the PM in tandem with early explorations",
          "Wrote and designed the Rovo skills that generate executive summaries, aligned to content standards",
          "Directed other designers on local layout problems so I could hold breadth across the collection",
          "Escalated to the Head of Design to secure time for the pivot",
        ],
        images: [shots.strategyForYou],
      },
      {
        label: "Reframing",
        body: "Leaders didn’t need a better dashboard. They needed a briefing.",
        list: [
          {
            lead: "V0: An activity feed.",
            rest: "It showed what happened but offered no insight or next step.",
          },
          {
            lead: "V1: A smarter landing page.",
            rest: "It led with an AI summary of focus-area health and sprinkled summaries through a traditional layout.",
          },
          {
            lead: "What V1 taught us:",
            rest: "Customers found it overwhelming and doubted where the data came from. Internal users said the same, and visible data gaps eroded trust further. At the same time, the industry was moving toward headless, AI-generated briefings. I pushed us to follow that shift on my own initiative; no one asked for it.",
          },
          {
            lead: "Reframed as:",
            rest: "A personalized, AI-powered briefing that helps leaders quickly understand what matters, why it matters, and where to go next.",
          },
        ],
        images: [shots.strategyPhones, shots.strategySnapshot],
      },
      {
        label: "Pivotal decisions",
        body: [
          {
            lead: "1. Buy a week to get the pivot right",
            rest: "Under CEO scrutiny, a second miss would have cost far more than a week.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Pause and take one week to rethink the experience instead of iterating on V1.",
          },
          {
            lead: "Options on the table:",
            rest: "Polish V1 and hold the schedule; layer more AI into V1; pivot fully.",
          },
          {
            lead: "What I chose and why:",
            rest: "A time-boxed full pivot. V1’s problems were trust and overload, and incremental fixes wouldn’t solve either.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "A week of schedule, and real nervousness across the org.",
          },
          {
            lead: "How I got buy-in:",
            rest: "Given the stakes, I took it to the Head of Design, who backed the time.",
          },
        ],
        images: [
          [
            shots.strategyBriefingStand,
            shots.strategyBriefingHeadline,
            shots.strategyBriefingWeekly,
          ],
        ],
      },
      {
        body: [
          {
            lead: "2. Lead with the briefing, back it with evidence",
            rest: "The summary answers what matters; the right column proves it.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "A two-column layout. The AI briefing sits on the left; insights, updates, dashboard, and recent activity sit on the right. All of it shipped mid-rebrand.",
          },
          {
            lead: "Options on the table:",
            rest: "Keep V1’s dashboard with AI sprinkled in; go chat-only; pair the briefing with evidence.",
          },
          {
            lead: "What I chose and why:",
            rest: "Pairing answered both V1 complaints. Leaders read one clear story first, and can check it against the source when they doubt it.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "Less density. Putting the AI summary front and center replaced the item-by-item health readout with a more editorial read.",
          },
          {
            lead: "How I got buy-in:",
            rest: "This was the direction that changed the founder’s mind.",
          },
        ],
        images: [
          [
            shots.strategyAgentSplit,
            shots.strategyAgentDark,
            shots.strategyAgentBoard,
          ],
        ],
      },
      {
        body: [
          {
            lead: "3. Make Rovo the way in, everywhere",
            rest: "Every insight became a conversation leaders could act on.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Recast each insight card as Rovo’s first message in a thread, with delegation actions like “Message [Name] about [topic].” Ship a headless MCP version, shaped by a skill, so the briefing reaches leaders outside the product.",
          },
          {
            lead: "Options on the table:",
            rest: "Static insight cards; Rovo as a side panel.",
          },
          {
            lead: "What I chose and why:",
            rest: "Insights are only useful if leaders act on them. Under Atlassian’s usage-based pricing, more Rovo usage also means more revenue.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "Non-deterministic output. We accepted that insights would vary, and gave leaders controls to adjust them.",
          },
          {
            lead: "How I got buy-in:",
            rest: "Tying the design to the business model gave leadership a reason to back it beyond the UX.",
          },
        ],
        images: [shots.strategyBriefingStable, shots.strategyMcp],
      },
      {
        label: "The work",
        images: [
          shots.strategyWorkInsight,
          shots.strategyWorkSurfaces,
          shots.strategyWorkViz,
          shots.strategyWorkVerify,
          shots.strategyWorkSkills,
        ],
      },
      {
        label: "How I built it",
        list: [
          {
            lead: "Code prototypes from the start:",
            rest: "I was an early adopter of Replit and onboarded other designers with best practices. Two months later I moved to Cursor and did the same.",
          },
          {
            lead: "AI for definition and ideation:",
            rest: "Claude Code and Rovo shaped early product definition, ideation, visual exploration, and the briefing skills themselves.",
          },
          {
            lead: "Prototypes that felt alive:",
            rest: "Teamwork Graph data, plus mock data where it wasn’t available, made reviews feel like the real product.",
          },
          {
            lead: "Figma where craft counts:",
            rest: "I still used Figma for polish and structure. Clear structure kept the craft high and helped agents interpret the experience correctly.",
          },
          {
            lead: "Motion:",
            rest: "I created new motion patterns and extended them across the collection.",
          },
          {
            lead: "It changed how I work:",
            rest: "In a morning I can build out entire feature sets and logic to get feedback on, then scaffold and build the prototype that afternoon. Figma is saved for the moments that need a steady hand.",
          },
        ],
        images: [shots.strategyViews],
      },
      {
        label: "Outcomes",
        body: {
          lead: "The work gave the founder a direction to believe in.",
          rest: "",
        },
        list: [
          {
            lead: "Users:",
            rest: "Six pilot customers, a deliberately small group at the pre-PMF stage.",
          },
          {
            lead: "Business:",
            rest: "Head of Product and CEO sign-off. Featured in the founder’s keynotes: V1 at Team ’26, V2 at Team EU. Built to drive Rovo usage under usage-based pricing.",
          },
          {
            lead: "Org:",
            rest: "Now the direction for the whole Strategy Collection: insight patterns, data viz, updates, brand extension, and skill creation. Design leadership is pushing the format to other Atlassian collections. Design leadership called it “pure magic,” praising the editorial two-column layout, charts that beat what’s in production today, and the restraint of cutting controls that didn’t matter.",
          },
          {
            lead: "Reflection:",
            rest: "Get real data into the design earlier. I designed for extensibility and non-deterministic content, but real data is unpredictable in ways mocks aren’t. A brittle backend and no Teamwork Graph access in V1 made earlier access impossible. Next time, I’d push harder to pressure-test with real scenarios sooner.",
          },
        ],
      },
    ],
  },
  {
    slug: "post-office",
    title: "Post Office",
    meta: "Redesigning how Atlassian talks to its users",
    tags: ["Platform", "Design system", "Adopted company-wide"],
    company: "Atlassian",
    summary:
      "Leading Courier, Post Office’s pattern library at Atlassian, and shipping @atlaskit/spotlight to unify in-product messaging.",
    image: "/images/post-office-hero.webp",
    mark: AtlassianMark,
    tint: "bg-tile-post-office",
    palette: "palette-post-office",
    previous: "strategic-intelligence",
    next: "campaign-manager",
    hero: shots.postOfficeHero,
    sections: [
      {
        label: "At a glance",
        facts: [
          {
            label: "Company / product:",
            value:
              "Atlassian, Post Office, the platform that orchestrates messaging across in-product, email, push, and chat",
          },
          {
            label: "My role:",
            value:
              "Lead Product Designer for Post Office. Drove messaging guidance alignment across Atlassian, which led to the Courier pattern library.",
          },
          {
            label: "Team:",
            value:
              "3 designers, a PM, a content designer, 20 engineers, 5 Atlassian Design System partners, and 8 design advocates across Atlassian",
          },
          {
            label: "Timeline:",
            value: "May 2025 to September 2025",
          },
          {
            label: "Outcome:",
            value:
              "16 teams adopted the guidelines and pattern library. Spotlight replaced a decade-old component across 1,100+ usages. Experiments drove a +1.16% lift in D28 MAU.",
          },
          {
            label: "What I’m proudest of:",
            value:
              "Holding the line on respecting users’ flow even when the short-term metrics dipped",
          },
        ],
        images: [shots.postOfficeNoise],
      },
      {
        label: "The bet",
        body: [
          {
            lead: "Every team was building its own messages, and customers paid for it.",
            rest: "",
          },
          "Atlassian sends messages across in-product surfaces, email, push, and chat, but each team built its own. Customers got fragmented designs, competing popovers, and message fatigue that led to opt-outs and eroded trust. Product teams kept rebuilding the same patterns from scratch.",
        ],
        list: [
          {
            lead: "The constraint:",
            rest: "No single team owned messaging end to end. Any fix had to work across dozens of product teams without stalling their roadmaps.",
          },
        ],
      },
      {
        label: "My role and leverage",
        body: {
          lead: "I led design for Post Office, the platform other teams build messages on.",
          rest: "",
        },
        list: [
          "Lead Product Designer, working alongside 3 designers and a content designer",
          "Drove alignment on messaging guidance across Atlassian, which became the foundation for the Courier pattern library",
          "Ran growth experiments in Confluence with my cross-functional team",
          "Kicked off and co-led the Spotlight redesign with the Atlassian Design System (ADS) team",
          "Partnered with 8 design advocates across Atlassian, with weekly office hours reviewing partner teams’ messaging and experiment designs",
        ],
        images: [shots.postOfficeCourier],
      },
      {
        label: "Reframing",
        body: {
          lead: "Stop fixing messages one at a time. Fix the system that makes them.",
          rest: "",
        },
        list: [
          {
            lead: "As briefed:",
            rest: "Clean up messaging problems as teams ran into them.",
          },
          {
            lead: "What I saw:",
            rest: "Without shared rules for when, where, and how loudly to message, every fix would fragment the same way.",
          },
          {
            lead: "Reframed as:",
            rest: "A system of guidelines, frameworks, and components that makes the right message the easiest one to build.",
          },
        ],
      },
      {
        label: "Setting the rules",
        body: [
          {
            lead: "Guidelines first, components second.",
            rest: "",
          },
          "I audited messages across Atlassian, then ran a workshop with designers from across the company. The result was the Messaging Guidelines (Message Maker Guidance), built on four principles:",
        ],
        list: [
          {
            lead: "Target precisely:",
            rest: "Reach only users who can act, based on role, lifecycle stage, and usage.",
          },
          {
            lead: "Don’t derail users:",
            rest: "Keep non-critical messages quiet and save high-attention patterns for critical moments.",
          },
          {
            lead: "Give users control:",
            rest: "Clear dismissal, snooze and opt-out, and “Why am I seeing this?” context.",
          },
          {
            lead: "Work together:",
            rest: "Route messages through Post Office so teams don’t collide.",
          },
        ],
        after: "Two frameworks turned principles into decisions:",
        afterList: [
          {
            lead: "Level of Attention framework:",
            rest: "Matches channel and visual intensity to urgency, impact, and context.",
          },
          {
            lead: "Objective-to-Component matrix:",
            rest: "Maps each goal (onboarding, feature discovery, upsell, transactional) to approved components. Research showed upsells land better out of flow, so they go to side-nav banners or email rather than interrupting work.",
          },
        ],
        images: [shots.postOfficeSpotlight],
      },
      {
        label: "Testing the rules on ourselves",
        body: [
          {
            lead: "If we were chasing MAU this hard, imagine what every other growth team was doing.",
            rest: "",
          },
          "While writing the guidelines, I was also running growth experiments in Confluence with my cross-functional team, toward the org-wide goal of increasing MAU.",
        ],
        list: [
          {
            lead: "Comment reply flag:",
            rest: "When a user lingered on a page, a flag surfaced a comment on one of their docs. They could review it in context, then reply inline or from the notification. It produced only a minimal MAU lift.",
          },
          {
            lead: "Next best action:",
            rest: "At key moments, we promoted a suggested next step to turn engagement into action.",
          },
          {
            lead: "More tests:",
            rest: "We ran several other ideas against the same goal.",
          },
        ],
        images: [shots.postOfficeFlags],
      },
      {
        body: [
          {
            lead: "The tension:",
            rest: "We were pushed to grow MAU while writing rules meant to push back on exactly these tactics. Running the experiments ourselves showed us what growth teams across Atlassian were up against, and made the guidance far stronger for it.",
          },
          {
            lead: "The result:",
            rest: "Jira and Confluence became our closest partners, applying the guidelines to every experiment before it ships. Adoption grew to 16 teams across Atlassian.",
          },
        ],
        images: [
          shots.postOfficeChannels,
          shots.postOfficeAttention,
        ],
      },
      {
        label: "Building Courier",
        body: [
          {
            lead: "Turning the rules into components any team could pick up.",
            rest: "",
          },
          "The guidelines became Courier, the Post Office pattern library of ADS-compliant popovers (modals, spotlights, flags, Rovo nudges) and embedded patterns (side-nav banners, onboarding modules). Fatigue controls like cooldowns, frequency caps, and expiration are built in, so users stop seeing dismissed or stale messages.",
        ],
        images: [shots.postOfficeMoments],
      },
      {
        label: "The Spotlight challenge",
        body: [
          {
            lead: "Spotlight was where the rules met their hardest test.",
            rest: "",
          },
          "Of all the components in Courier, Spotlight needed the most work, so we fast-tracked it. The “purple box” had been Atlassian’s onboarding spotlight for more than 10 years. It ran across 1,100+ usages in hundreds of variants, blocked users until they clicked through or dismissed it, and three in four users dismissed it. It broke nearly every principle we had just written.",
        ],
        images: [shots.postOfficeOnboarding, shots.postOfficeHome],
      },
      {
        label: "Rebuilding Spotlight: pivotal decisions",
        body: [
          {
            lead: "1. Graduate teams over time instead of converting everything at once",
            rest: "Hundreds of variants couldn’t be fixed in one move.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Audit every Spotlight instance with engineering, then move teams onto the new component in waves.",
          },
          {
            lead: "Options on the table:",
            rest: "Convert every instance at once; leave the old component and only use the new one going forward; audit and migrate team by team.",
          },
          {
            lead: "What I chose and why:",
            rest: "A wholesale swap was too risky across hundreds of variants no one fully understood. An audit first made the scope visible and the migration safe.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "A longer tail, with old and new running side by side for a while.",
          },
          {
            lead: "How it scaled:",
            rest: "My engineering partner led AI-assisted tooling that sped up the audit and handled 20–30% of migrations without contacting owning teams. An EngHealth campaign drove 70% completion by the deadline.",
          },
        ],
        images: [shots.postOfficeAcrossApps],
      },
      {
        body: [
          {
            lead: "2. Let the design system team own the component",
            rest: "Design could drive adoption, but only a platform team could assemble it.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Build Spotlight inside ADS instead of shipping it from Post Office.",
          },
          {
            lead: "Options on the table:",
            rest: "Post Office builds and maintains it; ADS owns it with Post Office driving design and adoption.",
          },
          {
            lead: "What I chose and why:",
            rest: "A cross-cutting change across hundreds of instances needed platform engineering behind it. Jenny Lou and I embedded with the ADS team for a sprint and aligned on shared governance up front.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "Waiting on ADS bandwidth. It couldn’t ship in time for Team ’25.",
          },
          {
            lead: "How I got buy-in:",
            rest: "Proposing a clear split: ADS owns the component long term; we bring design, guidelines, and adoption.",
          },
        ],
        images: [shots.postOfficeFigma],
      },
      {
        body: [
          {
            lead: "3. Flexible on form, firm on behavior",
            rest: "The old spotlight converted because it trapped people.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Remove the blocking layer that forced users to click through or dismiss, even though conversion numbers would drop.",
          },
          {
            lead: "Options on the table:",
            rest: "Keep blocking to protect metrics; make everything configurable; hold the principles and flex on the rest.",
          },
          {
            lead: "What I chose and why:",
            rest: "The legacy component’s conversion was an artifact of blocking, not user intent. We welcomed changes like Trello’s new button color when testing and metrics showed a need, but pushed back when they wanted to block dismissal again.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "Dismissals rose once users could scroll past.",
          },
          {
            lead: "How it paid off:",
            rest: "Users saw fewer, better-targeted spotlights, and customer sentiment improved in rolling research.",
          },
        ],
        images: [shots.postOfficeUsage],
      },
      {
        label: "Outcomes",
        body: {
          lead: "Other teams build on it now.",
          rest: "",
        },
        list: [
          {
            lead: "Users:",
            rest: "Customer sentiment improved in rolling research after the non-blocking Spotlight launched.",
          },
          {
            lead: "Business:",
            rest: "Experiments run on the system drove a statistically significant +1.16% lift in D28 MAU, about 15,900 annualized incremental users.",
          },
          {
            lead: "Org:",
            rest: "16 teams across Atlassian adopted the guidelines and pattern library, with Jira and Confluence applying them before every experiment ships. Spotlight reached 100% adoption across 1,100+ usages, and ADS owns it long term.",
          },
        ],
      },
      {
        label: "Reflection",
        body: [
          {
            lead: "Pair the numbers with qualitative research from the start.",
            rest: "",
          },
          "We started from quantitative data, which told only half the story. When dismissals rose, the metrics looked worse, even though users’ needs were being met. We only captured sentiment later. Next time, I’d run qualitative testing from day one so the team could see both sides of the trade-off as it happened.",
        ],
      },
    ],
  },
  {
    slug: "campaign-manager",
    title: "Campaign Manager",
    meta: "Turning retailer marketing into a $192M self-serve business",
    tags: ["0-to-1", "Marketplace platform", "$192M attributed GMV"],
    company: "Instacart",
    summary:
      "A self-serve campaign builder for Instacart retailers that grew to $192M in gross merchandising value with 100% retailer adoption.",
    image: "/images/campaign-manager-hero.webp",
    mark: CampaignManagerMark,
    tint: "bg-tile-campaign",
    palette: "palette-campaign-manager",
    previous: "post-office",
    next: "strategic-intelligence",
    hero: shots.campaignHero,
    sections: [
      {
        label: "At a glance",
        facts: [
          {
            label: "Company / product:",
            value:
              "Instacart, Campaign Manager (now the self-serve tier of Instacart Marketing Solutions)",
          },
          {
            label: "My role:",
            value:
              "Staff Product Designer and design lead. Owned the end-to-end experience, set the vision, and shaped the roadmap from MVP to platform.",
          },
          {
            label: "Team:",
            value:
              "About 6 PMs, a handful of engineering managers, 30+ engineers including data science, 4 designers, plus UX research and content design",
          },
          {
            label: "Partners:",
            value:
              "CEO Fidji Simo and the C-suite, retailer ops, and 4 adjacent product teams",
          },
          {
            label: "Timeline:",
            value: "Late 2022 to 2024, about 1.5 years",
          },
          {
            label: "Outcome:",
            value: "$192M in GMV against a $136M goal",
          },
          {
            label: "What I’m proudest of:",
            value:
              "Using research to give retailers a front end of their own, built on the ads backend",
          },
        ],
        images: [shots.campaignOffers],
      },
      {
        label: "The bet",
        body: [
          {
            lead: "Customers were leaving over price, and retailers had no way to respond on their own.",
            rest: "",
          },
          "Grocery prices were up 10.9% year over year, and cost was the top reason customers left Instacart. Retailers needed ways to help shoppers save and keep them coming back. Instacart needed retailers to fund their own campaigns. Done right, both sides would win.",
          "The legacy Unata tooling stood in the way:",
        ],
        list: [
          {
            lead: "Manual:",
            rest: "An ops team set up campaigns on each retailer’s behalf, through a multi-step process that overwhelmed everyone.",
          },
          {
            lead: "Disconnected:",
            rest: "Retailers jumped between tools, and the backend wasn’t connected to the new data pipeline.",
          },
          {
            lead: "No reporting:",
            rest: "Retailers couldn’t tell whether their spend was working, so they didn’t trust promotions.",
          },
          {
            lead: "The constraint:",
            rest: "After a strong C-suite review in late 2022, the CEO asked us to ship by January 2023. That left design about two weeks for the end-to-end experience, on a design system built mostly for the consumer app, amid a debate over whether to build inside the existing ads tool.",
          },
        ],
      },
      {
        label: "My role and leverage",
        body: {
          lead: "I shaped the roadmap, not just the screens.",
          rest: "",
        },
        list: [
          "Led design end to end, from MVP through the full platform",
          "Used research to settle where to build, and shaped the roadmap from MVP to platform",
          "Ran a two-week vision sprint that set the direction for the storefront builder",
          "Mentored the senior designer who executed the storefront builder",
          "Coordinated with 4 adjacent product teams, with designers across the space meeting almost daily",
          "Carried patterns across the platform org, alongside data visualization and navigation updates",
        ],
        images: [shots.campaignModel],
      },
      {
        label: "Reframing",
        body: {
          lead: "The tools were archaic, but that wasn’t the real problem. Retailers were cut off from the results of their own decisions.",
          rest: "",
        },
        list: [
          {
            lead: "As briefed:",
            rest: "Replace the legacy campaign tooling.",
          },
          {
            lead: "What I saw:",
            rest: "Retailers couldn’t see what a campaign would look like on their storefront, couldn’t understand its impact through data, and couldn’t customize it at all.",
          },
          {
            lead: "Reframed as:",
            rest: "Connect every retailer decision to what shoppers see and what it earns, from setup to storefront to results.",
          },
        ],
        images: [shots.campaignTablet],
      },
      {
        label: "Pivotal decisions",
        body: [
          {
            lead: "1. Ship three templates in two weeks",
            rest: "Nail the core use cases before scaling.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Launch the MVP with 3 curated templates, constrained editing, and basic reporting.",
          },
          {
            lead: "Options on the table:",
            rest: "A broad feature set at launch; a narrow, research-backed MVP.",
          },
          {
            lead: "What I chose and why:",
            rest: "Research and data from the old tooling pointed to three campaign types retailers used most. Getting those right would prove the model before we scaled.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "No live previews, since rendering them was too heavy a technical lift. That pushed design to find other ways to give retailers confidence before launch.",
          },
          {
            lead: "How it played out:",
            rest: "The MVP met the CEO’s January 2023 deadline as a pilot with 4 retailers across 3 regions.",
          },
        ],
        images: [shots.campaignMvp],
      },
      {
        body: [
          {
            lead: "2. Give retailers their own front end, on the ads backend",
            rest: "Research showed retailers were a different user, but the plumbing was the same.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Build the retailer experience on the new retailer platform, powered by the existing ads backend.",
          },
          {
            lead: "Options on the table:",
            rest: "Consolidate into Ads Manager, which the ads team and org leader favored for efficiency; build everything separately; a new front end on shared backend capabilities.",
          },
          {
            lead: "What I chose and why:",
            rest: "Interviews with about 20 merchandisers, marketers, and eComm managers across 5 retailers showed merchandising isn’t advertising. Different people run it, with different goals and outcomes. But mapping the underlying capabilities, like targeting, incentives, budgeting, and billing, showed heavy overlap with ads. So we married both worlds.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "Coordinating front-end and backend work across two teams.",
          },
          {
            lead: "How I got buy-in:",
            rest: "With my researcher and cross-functional partners, I shifted the conversation from efficiency to user needs. Reusing the backend kept the efficiency the ads team wanted and let us hit the timeline.",
          },
        ],
      },
      {
        body: [
          {
            lead: "3. Hold the quality bar before launch",
            rest: "What was built didn’t match what was designed.",
          },
        ],
        list: [
          {
            lead: "The decision:",
            rest: "Flag the build as not shippable and lead a major QA effort before launch.",
          },
          {
            lead: "Options on the table:",
            rest: "Ship and fix later; close the gap before launch.",
          },
          {
            lead: "What I chose and why:",
            rest: "Retailers would judge a brand-new product on its first impression.",
          },
          {
            lead: "Trade-off accepted:",
            rest: "No launch delay, but it took cross-functional alignment and time from an engineering team that was already stretched.",
          },
          {
            lead: "How I got buy-in:",
            rest: "I aligned cross-functional partners on the bar, then paired with our best front-end engineers, joining code reviews down to the CSS until the build met it.",
          },
        ],
        images: [shots.campaignVision],
      },
      {
        label: "Setting the vision",
        body: [
          {
            lead: "While engineering built the MVP, I stepped back to design where we were going.",
            rest: "",
          },
          "I ran a two-week vision sprint fueled by our team’s generative research, and told it as a story: a merchandising manager building a Mother’s Day campaign. It imagined one hub for marketing and merchandising campaigns, live storefront previews, a campaign calendar to avoid conflicts, and collaboration with comments and approvals. It wasn’t airtight, but it pushed creative boundaries and gave the team a backlog it kept building from. Its biggest outcome was the foundation for our white-label storefront builder.",
        ],
      },
      {
        label: "The work",
        body: [
          {
            lead: "Low floor, high ceiling.",
            rest: "",
          },
          "The hardest design problem was serving both ends: a one-click template for a busy retailer, and full control for a sophisticated one. We started backwards, designing exact solutions for each template before unpacking the custom features retailers would eventually want. So the real work happened as we built: each template and each round of feedback showed which features needed to extend. We mapped how each campaign step depends on the ones before it, so the system could nudge retailers away from weak choices or block harmful ones. Progressive disclosure tied it together, letting every retailer start simple and go deeper only when they needed to.",
          {
            lead: "Campaign flow:",
            rest: "Objective, setup, targeting, offer, promote, insights. One path from idea to results.",
          },
          {
            lead: "Guardrails:",
            rest: "Hard and soft dependencies between steps.",
          },
        ],
        images: [shots.campaignFramework],
      },
      {
        label: "Templates to custom",
        body:
          "Start from a template, customize a campaign, or build creative from scratch.",
        images: [
          shots.campaignName,
          shots.campaignTargeting,
        ],
      },
      {
        label: "Adapt design system",
        body:
          "While this was happening, our design system was maturing, and we pressure tested our flows and components.",
        images: [shots.campaignOffer],
      },
      {
        label: "Storefront builder",
        body:
          "A visual editor showing campaigns on white-label and marketplace storefronts, so retailers see what shoppers will see.",
        images: [
          shots.campaignStorefront,
          shots.campaignBanner,
          shots.campaignPromote,
        ],
      },
      {
        label: "Insights",
        body:
          "Reporting built into the flow, so retailers know whether their spend works.",
        images: [shots.campaignInsights],
      },
      {
        label: "Outcomes",
        body: {
          lead: "From a 4-retailer pilot to an official product line.",
          rest: "",
        },
        list: [
          {
            lead: "Retailers:",
            rest: "277 retailers ran offers, 223 offers were created with self-serve tooling, and 56% of retailers ran more than one. Up to 10% higher retention and 70% more first-time customers.",
          },
          {
            lead: "Shoppers:",
            rest: "2.2M orders used offers, saving customers $24M.",
          },
          {
            lead: "Business:",
            rest: "$192M in GMV against a $136M goal, a 7.9x return on ad spend, and $6M in retailer funding.",
          },
          {
            lead: "Org:",
            rest: "Campaign Manager became the self-serve tier of Instacart Marketing Solutions, alongside managed and strategic partnership tiers. The vision sprint became the foundation for the storefront builder, and Ads Manager adopted the progressive disclosure patterns.",
          },
        ],
      },
      {
        label: "Reflection",
        body: [
          {
            lead: "Push harder on the design system earlier.",
            rest: "",
          },
          "The design system was new and built mostly for the consumer app. I used its foundation while pushing for new patterns, and some of what we inherited felt clunky. We landed in a good place as the system matured for the platform, but I’d push on those gaps sooner.",
        ],
      },
    ],
  },
];

export function caseStudyHref(slug: CaseStudySlug) {
  return `/work/${slug}` as const;
}

export function getCaseStudy(slug: string) {
  const canonical = canonicalWorkSlug(slug);
  return caseStudies.find((study) => study.slug === canonical);
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

function appendSectionCopy(
  blocks: CaseStudyGuideBlock[],
  section: CaseStudySection,
) {
  if (section.label) {
    blocks.push({ kind: "heading", text: section.label });
  }
  if (section.facts) {
    blocks.push({
      kind: "bullets",
      items: section.facts.map((fact) => ({
        lead: fact.label,
        rest: fact.value,
      })),
    });
  }
  const paragraphs = Array.isArray(section.body)
    ? section.body
    : section.body
      ? [section.body]
      : [];
  for (const paragraph of paragraphs) {
    if (typeof paragraph === "string") {
      blocks.push({ kind: "copy", rest: paragraph });
    } else {
      blocks.push({ kind: "copy", lead: paragraph.lead, rest: paragraph.rest });
    }
  }
  if (section.list) {
    blocks.push({ kind: "bullets", items: section.list });
  }
  const after = Array.isArray(section.after)
    ? section.after
    : section.after
      ? [section.after]
      : [];
  for (const paragraph of after) {
    if (typeof paragraph === "string") {
      blocks.push({ kind: "copy", rest: paragraph });
    } else {
      blocks.push({ kind: "copy", lead: paragraph.lead, rest: paragraph.rest });
    }
  }
  if (section.afterList) {
    blocks.push({ kind: "bullets", items: section.afterList });
  }
}

function appendImageCaptions(
  blocks: CaseStudyGuideBlock[],
  images: CaseStudySection["images"],
  shotIndex: number,
) {
  for (const shot of flattenImages(images)) {
    if (shot.caption?.label) {
      blocks.push({
        kind: "caption",
        text: shot.caption.label,
        shotIndex,
      });
    }
    shotIndex += 1;
  }
  return shotIndex;
}

/** Page copy in reading order, so the lightbox notes panel can follow along. */
export function caseStudyGuide(study: CaseStudy): CaseStudyGuide {
  const blocks: CaseStudyGuideBlock[] = [];
  let shotIndex = 0;

  if (study.hero) {
    if (study.hero.caption?.label) {
      blocks.push({
        kind: "caption",
        text: study.hero.caption.label,
        shotIndex,
      });
    }
    shotIndex += 1;
  }

  for (const section of study.sections) {
    if (section.beforeClip) appendSectionCopy(blocks, section);
  }

  if (study.heroClip) {
    if (study.heroClip.caption?.label) {
      blocks.push({
        kind: "caption",
        text: study.heroClip.caption.label,
        shotIndex,
      });
    }
    shotIndex += 1;
  }

  for (const section of study.sections) {
    if (!section.beforeClip) appendSectionCopy(blocks, section);
    shotIndex = appendImageCaptions(blocks, section.images, shotIndex);
  }

  return {
    title: study.title,
    meta: study.meta,
    tags: study.tags,
    blocks,
  };
}
