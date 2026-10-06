export type TalkCue = {
  /** Gallery image this beat is read against. */
  src: string;
  title: string;
  onScreen: string;
  paragraphs: string[];
};

const campaignManager: TalkCue[] = [
  {
    src: "/images/campaign-manager-hero.png",
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

const postOffice: TalkCue[] = [
  {
    src: "/images/post-office-hero.png",
    title: "A spotlight on Atlassian Home",
    onScreen: "a laptop showing Atlassian Home, with a spotlight welcoming you in.",
    paragraphs: [
      "This one is from my time at Atlassian, on a team called Post Office. Post Office is the platform that orchestrates messaging across Atlassian's products, so in-product messages, email, push, and chat. I was the lead product designer from May to September 2025, working with three designers, a content designer, a PM, about 20 engineers, and five partners on the Atlassian Design System team.",
      "This is where we ended up, with a quiet, friendly spotlight welcoming someone to Atlassian Home. It's a small moment, but getting there took a system that 16 teams across Atlassian now use.",
    ],
  },
  {
    src: "/images/post-office-noise.webp",
    title: "The purple-box pile-up",
    onScreen: "a Confluence page crowded with overlapping purple boxes, flags, and spotlights.",
    paragraphs: [
      "This is where we started. Every team at Atlassian built its own messages, and nobody coordinated them, so a single Confluence page could end up looking like this. Customers got popovers from different teams fighting for the same screen, and so many messages that they opted out and stopped trusting them. Product teams, meanwhile, kept rebuilding the same patterns from scratch.",
      "The hard part was that no single team owned messaging end to end. Any fix had to work across dozens of product teams without slowing down their roadmaps.",
    ],
  },
  {
    src: "/images/post-office-courier.webp",
    title: "Courier's principles and intensity levels",
    onScreen:
      "Courier's messaging principles, four intensity levels from subtle to notable, and the guidance pages in Confluence.",
    paragraphs: [
      "I decided to go after the system that produces messages, because without shared rules for when, where, and how loudly to message, every fix would fragment the same way.",
      "I started by auditing messages across Atlassian, then ran a workshop with designers from across the company. Out of that came our messaging guidelines, built on four principles. Target precisely, so only people who can act on a message see it. Don't derail users, so routine messages stay quiet and loud patterns are saved for moments that matter. Give users control, with clear dismissal, snooze, and a \"why am I seeing this\" explanation. And work together, by routing everything through Post Office so teams don't collide.",
      "The intensity levels you see here come from our Level of Attention framework. A team stops asking which component to use and starts asking how much attention a message deserves. A second framework mapped each goal, like onboarding or upsell, to approved components. Research showed upsells land better out of flow, for example, so those go to side-nav banners or email instead of interrupting someone's work.",
    ],
  },
  {
    src: "/images/post-office-spotlight.webp",
    title: "Experiment: comment replies from a flag",
    onScreen:
      "a Confluence page with an inline comment prompt and a notifications panel of comments and requests.",
    paragraphs: [
      "While I was writing those guidelines, I was also running growth experiments in Confluence with my cross-functional team. The whole org had one goal, which was to grow monthly active users.",
      "This was one of them. If someone lingered on a page for a while, we surfaced a comment on one of their docs. They could read it in context, then reply inline or from the notification. It moved MAU, but only a little.",
    ],
  },
  {
    src: "/images/post-office-flags.webp",
    title: "Experiment: flag replies, reacts, and next best actions",
    onScreen:
      "a set of in-product messages, including comments, reactions, published-page flags, replies, and a first-project tour.",
    paragraphs: [
      "We kept going. Here are a few more we tried: replying to a comment straight from a flag, reacting from a flag, and nudging people toward a next best action at key moments, like after they publish a page.",
    ],
  },
  {
    src: "/images/post-office-channels.webp",
    title: "Experiment: side panel banners, media flags, and email",
    onScreen:
      "the same messaging system across channels, with in-product flags, a Confluence page, and an email digest.",
    paragraphs: [
      "And we took it beyond the product, into side panel banners, flags with media, and an email digest of what your team is reading.",
      "This is where it got uncomfortable. We were under pressure to grow MAU, and at the same time I was writing rules meant to push back on exactly these tactics. If my team was chasing MAU this hard, every other growth team at Atlassian was too.",
      "Running these experiments ourselves showed me what growth teams were up against, and the guidelines got much stronger for it, because we wrote them as a team chasing the same number as everyone else. Jira and Confluence became our closest partners. They now check every experiment against the guidelines before it ships, and adoption grew to 16 teams across Atlassian.",
    ],
  },
  {
    src: "/images/post-office-attention.webp",
    title: "Level of attention on a real overlay",
    onScreen:
      "a Jira Product Discovery overlay labeled with its level of attention: notable, overlay with a blanket, major brand moment, rare frequency.",
    paragraphs: [
      "Here's the framework applied to a real message. This is a Jira Product Discovery overlay, one of the loudest things we can put in front of someone. It's a notable level of attention, it's an overlay that dims the page behind it, it's reserved for a major brand moment, and it should be rare. Every message gets that same check, so a team has to justify the volume before they turn it up.",
    ],
  },
  {
    src: "/images/post-office-moments.webp",
    title: "Modals as a system",
    onScreen:
      "a grid of branded moment overlays across Confluence, Teams, Jira Product Discovery, and Jira Service Management.",
    paragraphs: [
      "Courier turned the guidelines into components teams could pick up directly. It's the Post Office pattern library, and every pattern in it is built on the Atlassian Design System. It covers popovers like modals, spotlights, flags, and Rovo nudges, plus embedded patterns like side-nav banners and onboarding modules.",
      "This grid shows modals treated as one system across four products. They share structure and behavior, and each one still carries its product's brand. Fatigue controls are built into all of them, with cooldowns, frequency caps, and expiration rules, so people stop seeing messages they've already dismissed or that have gone stale.",
    ],
  },
  {
    src: "/images/post-office-onboarding.webp",
    title: "The purple box vs. Spotlight",
    onScreen:
      "Confluence Home with the old purple Welcome box, next to Atlassian Home with Spotlight's dark Welcome Home tooltip.",
    paragraphs: [
      "Of everything in Courier, Spotlight needed the most work, so we fast-tracked it. On the left is what we started with. Internally we called it the purple box. It had been Atlassian's onboarding spotlight for more than ten years, across more than 1,100 usages in hundreds of variants. It blocked people until they clicked through or dismissed it, and three in four users dismissed it. It broke almost every principle we had just written.",
      "On the right is the new Spotlight on Home. It's smaller, it points at one thing, and it doesn't stop you from working.",
    ],
  },
  {
    src: "/images/post-office-home.mp4",
    title: "Spotlight in motion",
    onScreen:
      "a film of Atlassian Home, with a Connect your work banner, Getting started cards, and Frequently visited.",
    paragraphs: [
      "Here it is in motion. The spotlight appears, points at what's new, and gets out of the way when you move on. Getting it here took three big decisions.",
    ],
  },
  {
    src: "/images/post-office-across-apps.webp",
    title: "Spotlight across apps and collections",
    onScreen:
      "Spotlight across Home, Teamwork, Focus, Bitbucket, Jira Service Management, and Discovery.",
    paragraphs: [
      "The first decision was how to migrate. Hundreds of variants meant we couldn't swap everything at once without breaking things nobody fully understood. So we audited every instance with engineering first, then moved teams over in waves. My engineering partner built AI-assisted tooling that sped up the audit and handled 20 to 30 percent of migrations without contacting the owning teams. An EngHealth campaign drove 70 percent completion by the deadline.",
      "The result is one Spotlight that stays consistent across apps and collections, from Home to Bitbucket to Jira Service Management.",
    ],
  },
  {
    src: "/images/post-office-figma.webp",
    title: "The Spotlight Figma kit",
    onScreen:
      "the Spotlight Figma kit, with light and dark examples, variants by caret position, and code parts.",
    paragraphs: [
      "The second decision was who should own it. Design could drive adoption, but a change this wide needed platform engineering behind it. So Jenny Lou and I embedded with the Atlassian Design System team for a sprint, and we agreed on a clear split up front. ADS would own the component long term, and Post Office would bring the design, the guidelines, and the adoption push. It meant waiting on their bandwidth, so it missed Team '25.",
      "ADS ships this kit to designers. It has ready-made examples in light and dark, variants for each caret position, and the code parts engineers build with. The parts are composable, and focus management, dialog semantics, and keyboard dismissal are built into the foundation.",
    ],
  },
  {
    src: "/images/post-office-usage.webp",
    title: "Spotlight usage guidance",
    onScreen:
      "the ADS Spotlight usage page, with guidance for a single-step spotlight on a Jira board.",
    paragraphs: [
      "The third decision was the hardest. The old spotlight converted well, but only because it trapped people. We removed that blocking layer, knowing the numbers would drop, and they did. Dismissals went up once people could scroll past.",
      "We wrote those rules into this usage page. We stayed flexible on form and firm on behavior. When Trello wanted a different button color, we said yes. When they wanted to block dismissal again, we pushed back. Rolling research showed users were seeing fewer, better-targeted spotlights, and customer sentiment went up.",
      "In the end, 16 teams adopted the guidelines and pattern library. Spotlight reached 100 percent adoption across more than 1,100 usages, and ADS owns it now. Experiments run on the system drove a statistically significant 1.16 percent lift in 28-day MAU, about 15,900 additional users a year.",
      "If I did it again, I'd bring qualitative research in from the start. We led with quantitative data, and when dismissals rose, the numbers looked worse even though users' needs were being met. We only measured sentiment later. Running both from day one would have let the team see the whole trade-off as it happened.",
    ],
  },
];

const strategicIntelligence: TalkCue[] = [
  {
    src: "/images/strategy-collection-tablet-1.mp4",
    title: "The briefing on a tablet",
    onScreen:
      "a film of a tablet on a desk showing a Strategic Intelligence briefing.",
    paragraphs: [
      "This is what I’m working on right now at Atlassian. It’s called Strategic Intelligence, and what you’re watching is the briefing as it would sit with a leader at the start of their day. It tells them what’s off track, what’s going well, and where to go next.",
      "I’m the lead product designer, and the only designer on it. I own the design direction and execution, and I co-wrote the product strategy with our Head of Product. I work with a PM, engineering leadership, six engineers, and our strategy and business ops team, and the CEO sees this work directly. We started in January 2026, shared V1 at TEAM ’26 in May, and V2 is ready for TEAM EU in October.",
    ],
  },
  {
    src: "/images/strategy-collection-clip.mp4",
    title: "What is the Strategy Collection?",
    onScreen: "the Strategy Collection film, opening on a chess pawn and rook.",
    paragraphs: [
      "Strategic Intelligence lives in Atlassian’s Strategy Collection, alongside Focus, Talent, and Align. The collection is how Atlassian moves up from the tools teams use every day to the decisions leaders make about where to invest.",
      "When we started in January, the collection was in trouble. The product was pre-product-market fit, the founder had serious doubts about the direction, and without a breakthrough, the collection was on life support.",
    ],
  },
  {
    src: "/images/strategy-collection-personas.webp",
    title: "Three audiences",
    onScreen:
      "three persona cards for Bradley, Brian, and Olivia, each with a sticky-note job statement.",
    paragraphs: [
      "Strategic Intelligence serves three people. Bradley is the executive who makes the call. Brian is the buyer who signs the check. Olivia is the operations leader who does the work in the tool every day. Each one wants something different, from a trustworthy pulse on the portfolio to a unified platform to a way to connect daily work back to strategy.",
    ],
  },
  {
    src: "/images/strategy-collection-job.webp",
    title: "Bradley’s job to be done",
    onScreen: "Bradley’s card with his job to be done.",
    paragraphs: [
      "We designed for Bradley first. His job is to continuously capture an accurate pulse of how the business is executing, so he can make confident decisions and change course without waiting on outdated slide decks or manual updates.",
      "Executives were steering on stale decks, while the real signal sat in Jira and Confluence. Traditional portfolio tools like Planview and ServiceNow run on manual entry and PMO overhead, and turning thousands of issues into an executive view took analyst teams weeks. By the time it reached a leader, it was already out of date.",
    ],
  },
  {
    src: "/images/strategy-collection-moodboard.webp",
    title: "The moodboard",
    onScreen:
      "a moodboard of dashboards, product launches, sleep tracking, JARVIS-style overlays, and other interfaces.",
    paragraphs: [
      "The timing was right for a few reasons. Atlassian already owns the execution layer, since more than 300,000 organizations run their work in Jira and Confluence, and the Teamwork Graph connects all of it. Generative AI had collapsed weeks of synthesis into seconds, as long as it had the right context. And customers were ready. By late 2025, nearly a third of our top 200 Cloud customers had passed 25 percent AI adoption.",
      "This moodboard is where I started. I pulled from dashboards, product launches, sleep trackers, and sci-fi overlays, anything that took a lot of data and made it feel personal and easy to read. Early on, I also drafted requirements with our PM in tandem with these explorations, so the strategy and the design moved together.",
    ],
  },
  {
    src: "/images/strategy-collection-for-you.webp",
    title: "V0’s For you page",
    onScreen:
      "the V0 For you page, with focus-area status cards, an activity feed, and critique notes around it.",
    paragraphs: [
      "This is V0, with my critique notes around it. It was an activity feed. It told you what happened across your focus areas, but it gave you no insight and no next step. A leader had to do all the interpreting themselves.",
    ],
  },
  {
    src: "/images/strategy-collection-phones.webp",
    title: "An AI-native prototype",
    onScreen:
      "four phone screens showing a score of 54, a weekly trend, a Rovo chat, and a generated briefing.",
    paragraphs: [
      "At the same time, the industry was moving toward AI-generated briefings that don’t depend on a dashboard at all. Nobody asked me to chase that, but I thought we had to. So I prototyped what it could look like: a single score for your portfolio, a weekly trend, a chat with Rovo, and a briefing written for you. It was rough, but it showed where I wanted us to go.",
    ],
  },
  {
    src: "/images/strategy-collection-snapshot.webp",
    title: "V1’s snapshot",
    onScreen:
      "a strategic snapshot for Olivia, with 29 of 40 focus areas needing attention.",
    paragraphs: [
      "V1 moved part of the way there. It was a smarter landing page that led with an AI summary of focus-area health and sprinkled more summaries through a traditional layout. We shared it at TEAM ’26 in May.",
      "Then we listened. Customers found it overwhelming, and they doubted where the data came from. Internal users said the same thing, and gaps in the data made it worse. Here, 29 of 40 focus areas need attention, and nothing tells a leader which ones matter.",
      "So I reframed the problem. Leaders needed a briefing that tells them what matters, why it matters, and where to go next.",
    ],
  },
  {
    src: "/images/strategy-collection-briefing-stand.webp",
    title: "Round one, exploration 1: AI summary first",
    onScreen:
      "a briefing for Veronica, with a Rovo summary of lagging focus areas, insight cards, and stacked dashboards.",
    paragraphs: [
      "This led to the first big decision. With the CEO watching this closely, a second miss would have cost far more than a week. So instead of polishing V1, I asked for one week to rethink the whole experience. That made people across the org nervous, so I took it to our Head of Design, who backed the time.",
      "I ran two rounds of explorations in that time, each one followed by critique with the team and design leadership. The first round pulled on one thread: what if Rovo was the engine that summarized everything? In this first exploration, the AI summary leads the page, and the insights and dashboards stack beneath it.",
    ],
  },
  {
    src: "/images/strategy-collection-briefing-headline.webp",
    title: "Round one, exploration 2: tighter content with stacked cards",
    onScreen:
      "a briefing titled “ARR on track, three areas behind,” with insights, latest updates, and a What’s next list.",
    paragraphs: [
      "In the second, I tightened the content. The headline does the work, “ARR on track, three areas behind,” and stacked cards carry the insights, updates, and what’s next.",
    ],
  },
  {
    src: "/images/strategy-collection-briefing-weekly.webp",
    title: "Round one, exploration 3: more brand and common components",
    onScreen:
      "a weekly briefing with a yellow header, insight cards, dashboard tiles, and a What’s next timeline.",
    paragraphs: [
      "In the third, I brought in more color from the new brand and leaned on components teams already knew. We were going through a rebrand at the same time, so every exploration had to work with a brand that was still taking shape.",
      "We critiqued all three with the team and design leadership, and I took what we learned into a second round.",
    ],
  },
  {
    src: "/images/strategy-collection-agent-split.webp",
    title: "Round two, exploration 1: the dual-panel layout",
    onScreen:
      "an agent-first briefing with a large ARR on track headline, suggested prompts, and insight cards with charts.",
    paragraphs: [
      "The second round had three directions too. The first split the page into two columns. The AI briefing sits on the left, with a big headline and suggested prompts for Rovo. The evidence sits on the right: insights, updates, dashboards, and recent activity.",
    ],
  },
  {
    src: "/images/strategy-collection-agent-dark.webp",
    title: "Round two, exploration 2: more brand expression",
    onScreen:
      "a dark briefing canvas with floating cards for new insights, items to pick back up, updated dashboards, and recent updates.",
    paragraphs: [
      "The second pushed the brand much further, on a dark canvas, and explored deeper views for each section, like new insights, things to pick back up, and dashboards that changed since you last looked.",
    ],
  },
  {
    src: "/images/strategy-collection-agent-board.webp",
    title: "Round two, exploration 3: stacked cards with Rovo",
    onScreen:
      "a light briefing board with cards for insights, updates, and dashboards around the ARR on track headline.",
    paragraphs: [
      "The third combined the stacked cards from round one with the brand expression, and built Rovo into the page.",
      "After another round of critique with the team and design leadership, we chose the dual-panel layout. It answered both of V1’s problems. Leaders read one clear story first, which fixed the overload. And when they doubt it, the source sits right next to it, which addressed the trust problem. The trade-off was density. Putting the summary front and center replaced V1’s item-by-item health readout with something more editorial. This was the direction that changed the founder’s mind.",
    ],
  },
  {
    src: "/images/strategy-collection-briefing-stable.mp4",
    title: "Where we landed",
    onScreen:
      "a film of a curated briefing for Olivia, titled “Fill 12 open positions to unblock two focus areas,” with insight cards and a Rovo prompt.",
    paragraphs: [
      "This is where we landed. The briefing leads on the left with one clear headline, here “Fill 12 open positions to unblock two focus areas,” and the feed on the right backs it up.",
      "The third big decision was to make Rovo the way into all of it. Each insight card opens a conversation with Rovo, with actions a leader can take right away, like “Message [Name] about [topic].” Insights only matter if leaders act on them. And since Atlassian moved to usage-based pricing, more Rovo use also means more revenue, which gave leadership a business reason to back the design. The trade-off was that AI output isn’t predictable, so we gave leaders controls to adjust their insights.",
    ],
  },
  {
    src: "/images/strategy-collection-mcp-1.mp4",
    title: "The briefing without our interface",
    onScreen:
      "a film of a Cursor session writing a weekly briefing prompt with Atlassian Rovo MCP tools.",
    paragraphs: [
      "We also shipped a headless version, following the shift I mentioned earlier toward briefings that don’t depend on a dashboard. This is the same briefing running through our MCP, inside Cursor. A leader can pull it into whatever tool they already work in, without opening our product.",
    ],
  },
  {
    src: "/images/strategy-collection-mcp-2.mp4",
    title: "The headless briefing, continued",
    onScreen: "the same Cursor session, continuing.",
    paragraphs: [
      "Here the briefing comes back. A skill I wrote shapes it, so it follows the same structure leaders see in the product. Whether a leader opens our page or asks from their own tools, they get the same story about their portfolio.",
    ],
  },
  {
    src: "/images/strategy-collection-for-you-page.png",
    title: "Inside the For you page",
    onScreen:
      "the Focus For you page, with a curated briefing across eight focus areas and insight cards.",
    paragraphs: [
      "Let’s go through the experience in more detail, starting on the left with the AI summary. It’s a daily pulse on what’s off track and what’s going well, with an explanation and evidence behind each point, so a leader can use Rovo to dig into an issue and decide what to do about it. I worked with content design to build the skills that structure each summary, and leaders can pick a format we provide or create their own.",
      "On the right is the feed. It mixes our insights with ones leaders create themselves. Skills structure each insight so it’s easy to scan, even when the AI output varies. Every insight has a Rovo action that leaders can change, or they can ask their own question about it. This was a new pattern at Atlassian, and I drove it across our product space and to other teams.",
      "The feed also distills organization updates into a few lines, with the raw update and the updates it was built from one click away. As design lead, I set the direction for updates, then guided three designers to refine and build it. Below that, leaders see the latest changes in their dashboards and open work from across the Teamwork Collection.",
      "Most recently, I designed a way to create an insight from a single prompt. A leader names it, sets its goal, chooses the sources it pulls from, and previews it before adding it to the feed. It refreshes daily, updates within a session when the data changes, and keeps monitoring until they turn it off. I drove this as a core pattern for teams across the collection.",
      "The CEO and Head of Product signed off, and both versions were featured in the founder’s keynotes, V1 at TEAM ’26 and V2 at TEAM EU. We have six pilot customers, a deliberately small group at this stage. This is now the direction for the whole Strategy Collection, and design leadership is pushing the format to other collections. They called it “pure magic.”",
    ],
  },
  {
    src: "/images/strategy-collection-cursor.png",
    title: "My AI workflow",
    onScreen:
      "a Cursor window with the Focus For you prototype open beside a chat.",
    paragraphs: [
      "Cursor is where most of this product got designed. I started prototyping in Replit, onboarded other designers onto it, then moved to Cursor two months later and did the same. I used Claude Code and Rovo for early product definition, ideation, and the briefing skills themselves. I ran prototypes on Teamwork Graph data, with mock data where we didn’t have it, so reviews felt like the real product. I still used Figma for polish and structure. It changed how I work. In a morning I can build out an entire feature set and its logic to get feedback on, then scaffold and build the prototype that afternoon.",
      "If I did it again, I’d push to get real data into the design sooner. I designed for content I couldn’t predict, but real data surprises you in ways mock data doesn’t. A brittle backend and no Teamwork Graph access in V1 made that hard, but I’d still push harder to test with real scenarios earlier.",
    ],
  },
];

const tracks: Record<string, TalkCue[]> = {
  "campaign-manager": campaignManager,
  "post-office": postOffice,
  "strategic-intelligence": strategicIntelligence,
};

export function hasTalkTrack(slug: string) {
  return Object.prototype.hasOwnProperty.call(tracks, slug);
}

export function talkCueFor(slug: string, src: string) {
  return tracks[slug]?.find((cue) => cue.src === src) ?? null;
}
