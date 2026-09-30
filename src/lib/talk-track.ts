export type TalkCue = {
  /** Gallery image this beat is read against. */
  src: string;
  title: string;
  onScreen: string;
  paragraphs: string[];
};

const campaignManager: TalkCue[] = [
  {
    src: "/images/campaign-manager-desk.webp",
    title: "Brand overview on the laptop",
    onScreen: "the hero shot, a laptop showing the retailer's brand overview.",
    paragraphs: [
      "This next one is from my time at Instacart, and it's the story of how retailer marketing went from something we did for retailers to something they could do themselves. This is where it ended up, with a retailer looking at their own brand overview, with spend and sales over the last 90 days. That view didn't exist when I started. By the end, the product behind it had driven $192 million in GMV against a goal of $136 million. I was the Staff Product Designer and design lead, from late 2022 through 2024, working with about six PMs, more than 30 engineers, and four other designers.",
    ],
  },
  {
    src: "/images/campaign-manager-offers.webp",
    title: "The old Unata offers admin",
    onScreen: "the legacy offers admin, a table of draft offers above a free-delivery form.",
    paragraphs: [
      "This is what retailers had before. It's the old Unata offers admin, and most retailers never saw it, because our own ops team set up campaigns on their behalf. So the first problem was that nothing was self-serve. The second is that it was disconnected. You'd set up an offer here, then jump to other tools to promote it, and none of it fed the data pipeline we were building. And the third, which was the easiest to understand, is that there was no reporting. Retailers had no idea whether their spend was working, so they didn't trust promotions.",
      "Grocery prices were up almost 11% year over year, and cost was the number one reason customers left Instacart. Retailers needed a way to help shoppers save, and Instacart needed retailers to fund those savings themselves. If we got it right, shoppers saved money and retailers paid for the savings.",
    ],
  },
  {
    src: "/images/campaign-manager-model.webp",
    title: "The campaign system model",
    onScreen:
      "retailer inputs on one side, shopper outputs on the other, connected by data, action, and experience.",
    paragraphs: [
      "When I dug in, the bigger problem was that retailers were cut off from the results of their own decisions. They couldn't see what a campaign would look like on their storefront, they couldn't see its impact in data, and they couldn't customize anything. So this diagram became how I framed the whole project. On the left are the decisions a retailer makes. On the right is what shoppers experience. The job was to connect the two, so every choice showed up for shoppers and came back as data the retailer could act on.",
      "Beyond leading design end to end, I shaped the roadmap from MVP to platform, and I worked across four adjacent product teams to keep it all moving together.",
    ],
  },
  {
    src: "/images/campaign-manager-create.webp",
    title: "The create step",
    onScreen:
      "the campaign builder's create step, with acquire, grow basket, and win-back cards and a phone preview.",
    paragraphs: [
      "We shared our direction with Fidji and the C-suite in late 2022, and the review went well enough that they asked us to ship by January. That left design about two weeks for the entire end-to-end experience.",
      "So I scoped hard. Research and data from the old tooling showed three campaign types retailers used most: acquiring new customers, growing basket size, and winning back lapsed shoppers. That's what you see here. We launched with just those three templates, limited editing, and basic reporting. We also had to cut live previews, because rendering them was too heavy a technical lift. That pushed us to find other ways to give retailers confidence, like the phone preview on the right. We hit the January deadline, and piloted with four retailers across three regions.",
    ],
  },
  {
    src: "/images/campaign-manager-capabilities.webp",
    title: "Research on merchandising vs. ads",
    onScreen:
      "three cards on merchandising vs. ads, different outcomes, and overlapping capabilities, with the recommendation.",
    paragraphs: [
      "The biggest debate early on was where to build this. The ads team and our org leader wanted to fold it into Ads Manager. It was a fair instinct, since one tool is more efficient than two. But I wasn't convinced retailers would see it that way.",
      "So with my researcher, we talked to about 20 merchandisers, marketers, and eComm managers across five retailers. They told us merchandising and advertising are different jobs, done by different people, with different goals and different ways of measuring success. Folding them into an ads tool would have served neither well. At the same time, when we mapped the underlying capabilities, things like targeting, incentives, budgeting, and billing, there was a lot of overlap with ads.",
      "So retailers got their own front end, built for how they actually work, and we powered it with the ads backend. That kept the efficiency the ads team cared about, it let us hit the timeline, and it changed the conversation from efficiency to user needs.",
      "Before launch, when the first build came back, it didn't match the design, and I didn't think it was shippable. The engineering team was stretched, so I aligned our cross-functional partners on the quality bar, then paired with our best front-end engineers and got into code reviews, right down to the CSS. We didn't delay the launch, and we shipped something retailers could trust on first impression.",
    ],
  },
  {
    src: "/images/campaign-manager-vision.webp",
    title: "The vision sprint",
    onScreen:
      "a Mother's Day campaign in the storefront builder, with a mobile preview of every page it touches.",
    paragraphs: [
      "While engineering built the MVP, I stepped back to think about where we were going. I ran a two-week vision sprint, fueled by the generative research our team had been doing, and I told it as a story. A merchandising manager wants to run a Mother's Day campaign. Instacart suggests a template, he previews exactly what his storefront will look like, checks a calendar to avoid clashing with other campaigns, and brings in a teammate to tune the offer before his director approves it.",
      "What you're seeing is that full preview, every page the campaign touches, from the load screen to search results. It wasn't airtight, but it pushed our thinking and gave the team a backlog it kept building from for a long time. Its biggest outcome was that it became the foundation for our white-label storefront builder.",
    ],
  },
  {
    src: "/images/campaign-manager-framework.webp",
    title: "The campaign framework",
    onScreen:
      "objective, setup, targeting, offer, and promote, with the questions each step answers.",
    paragraphs: [
      "Now let's get into the shipped product. The hardest design problem was serving two very different retailers. One wants a one-click template because they're busy. The other wants full control. We called the goal \"low floor, high ceiling.\"",
      "Every campaign moves through the same five steps: what's your objective, how is it set up, who are you targeting, what's the offer, and how will you promote it. Each step answers one question. We started a bit backwards. We designed exact solutions for each template before unpacking all the custom features retailers would eventually want. So a lot of the real work happened as we built. Every template and every round of feedback showed us which pieces needed to stretch. We also mapped how each step depends on the ones before it, so the system could nudge retailers away from weak choices and block the harmful ones.",
    ],
  },
  {
    src: "/images/campaign-manager-name.webp",
    title: "Naming the campaign and setting the goal",
    onScreen:
      "the builder naming a draft campaign and setting its goal, schedule, targeting, and offer.",
    paragraphs: [
      "Here's that framework in the product. A retailer names the campaign, sets the goal, and picks a schedule. On the left, you can see every step laid out, so they always know where they are and what's left. If they started from a template, most of this is already filled in. If they started from scratch, it's the same flow, just with more to decide.",
    ],
  },
  {
    src: "/images/campaign-manager-targeting.webp",
    title: "Targeting a segment",
    onScreen: "targeting open, showing a non-loyalty segment covering 50% of shoppers.",
    paragraphs: [
      "Targeting is where retailers used to be flying blind. Now they can pick a segment, like shoppers who aren't in their loyalty program yet, and immediately see how much of their customer base that covers. Here it's half their shoppers. They see the consequence of a targeting choice before they commit to it.",
    ],
  },
  {
    src: "/images/campaign-manager-offer.webp",
    title: "The offer step",
    onScreen:
      "the offer step, with shortcut rewards, earning conditions, and redemption rules for a loyalty campaign.",
    paragraphs: [
      "The offer step is where \"low floor, high ceiling\" shows up most. At the top are shortcuts, common rewards a retailer can pick in one click. Below that, if they want, they can go deep into earning conditions and redemption rules. Progressive disclosure is what holds it together. Everyone starts simple, and you only see the complexity when you need it. That pattern ended up being adopted by Ads Manager too.",
      "This is also where our design system got tested hardest. It was new, and it was built mostly for the consumer app, not for dense tools like this. So I used its foundation where I could, pushed for new patterns where I couldn't, and pressure-tested our flows and components as the system matured alongside us.",
    ],
  },
  {
    src: "/images/campaign-manager-storefront.webp",
    title: "The storefront builder",
    onScreen: "the live storefront editor, with the mobile preview open and an Add Section menu.",
    paragraphs: [
      "This is the piece I'm proudest of, because it's where the vision sprint became real. It's the storefront builder. Retailers edit their white-label or marketplace storefront visually, and they see exactly what shoppers will see. They can add sections like categories, collections, banners, and display units right on the page. I set the vision for it and mentored the senior designer who executed it.",
    ],
  },
  {
    src: "/images/campaign-manager-banner.webp",
    title: "Editing a banner in place",
    onScreen: "a banner selected on the mobile preview, with its settings in the side panel.",
    paragraphs: [
      "Here's a closer look. A retailer selects a banner on the preview, and its settings open on the side: the image, the type, and where it links. They never leave the page to make a change, and they see the change as they make it.",
    ],
  },
  {
    src: "/images/campaign-manager-promote.webp",
    title: "Promotion placements",
    onScreen:
      "a collage of promotion placements, grocery ads, offer setup, targeting rules, and customer-match summaries.",
    paragraphs: [
      "The same framework powers everything from a storefront banner to a push notification to an ad placement, with the offer and targeting rules carried through. A retailer builds the campaign once, and it shows up everywhere their shoppers are.",
    ],
  },
  {
    src: "/images/campaign-manager-insights.webp",
    title: "Brand overview insights",
    onScreen:
      "insights showing performance, category mix, products in active campaigns, and page metrics.",
    paragraphs: [
      "At the start, retailers had no idea whether their spend was working. Now reporting lives in the flow. They can see performance, category mix, and which products are in active campaigns, then adjust.",
      "What started as a four-retailer pilot became the self-serve tier of Instacart Marketing Solutions, alongside managed and strategic partnership tiers. It drove $192 million in GMV against a $136 million goal, with a 7.9x return on ad spend. 277 retailers ran offers, over half ran more than one, and 2.2 million orders used an offer, saving customers $24 million. Retailers saw up to 10% higher retention and 70% more first-time customers.",
      "If I did it again, I'd push harder on the design system earlier. We landed in a good place as it matured, but some of what we inherited was clunky, and I'd rather have closed those gaps sooner.",
    ],
  },
];

const tracks: Record<string, TalkCue[]> = {
  "campaign-manager": campaignManager,
};

export function hasTalkTrack(slug: string) {
  return Object.prototype.hasOwnProperty.call(tracks, slug);
}

export function talkCueFor(slug: string, src: string) {
  return tracks[slug]?.find((cue) => cue.src === src) ?? null;
}
