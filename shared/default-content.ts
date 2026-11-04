import type { SiteContent } from "./content-schema";

export const defaultContent: SiteContent = {
  seo: {
    siteUrl: "http://localhost:3000",
    siteName: "Atik",
    titleTemplate: "%s · Atik",
    keywords: [
      "digital marketer",
      "performance marketing",
      "paid media",
      "SEO",
      "GA4",
      "marketing consultant",
    ],
    ogImage: "/images/Cinematic%20Portrait%20on%20Black.png",
    twitterHandle: "",
    googleVerification: "",
    indexing: true,
    pages: {
      home: {
        title: "Atik · Senior Digital Marketer",
        description:
          "Strategy, media, lifecycle, and measurement for brands that want growth with a point of view.",
      },
      cases: {
        title: "Case studies",
        description: "Every engagement, from the brief to the number that moved.",
      },
      clients: {
        title: "Clients",
        description: "Notes from the founders and marketing leads Atik has worked with.",
      },
      courses: {
        title: "Courses",
        description: "Practical programs on paid media, measurement, and growth systems. The first cohort opens soon.",
      },
      blog: {
        title: "Journal",
        description: "Notes on paid media, measurement, offers, and the weekly habits that make growth repeatable.",
      },
    },
  },
  profile: {
    name: "Atik",
    role: "Senior Digital Marketer",
    email: "hello@atik.studio",
    location: "Working worldwide",
    availability: "Open for a few retainers",
    year: "2026",
    mark: "Atik",
    cv: {
      label: "Download CV",
      href: "/cv/atik-cv.pdf",
      fileName: "Atik-CV.pdf",
      meta: "PDF · Updated 2026",
    },
  },
  loader: {
    words: ["Strategy", "Media", "Measurement", "Revenue"],
    tag: "Portfolio",
    loading: "Loading",
  },
  nav: {
    links: [
      { label: "Home", id: "content" },
      { label: "Work", id: "work" },
      { label: "Expertise", id: "services" },
      { label: "About", id: "about" },
      { label: "Case studies", id: "cases" },
      { label: "Journal", href: "/blog" },
      { label: "Courses", href: "/courses" },
    ],
    cta: "Start a project",
    ctaTarget: "contact",
    menu: "Menu",
    close: "Close",
  },
  hero: {
    lines: [
      { text: "I turn" },
      { text: "attention" },
      { text: "into revenue.", accent: true },
    ],
    lede: "Strategy, media, and measurement for brands that are done guessing.",
    primaryCta: "Start a project",
    primaryTarget: "contact",
    secondaryCta: "See the work",
    secondaryTarget: "work",
    scroll: "Scroll",
    stats: [
      { value: 11, label: "Years in market" },
      { value: 60, suffix: "+", label: "Campaigns led" },
      { value: 3.4, decimals: 1, suffix: "×", label: "Typical return" },
      { value: 18, prefix: "$", suffix: "M", label: "Spend steered" },
    ],
  },
  marquee: {
    label: "Worked with",
    items: [
      { name: "Northline", logo: "/logos/northline.svg" },
      { name: "Lumen", logo: "/logos/lumen.svg" },
      { name: "Velour", logo: "/logos/velour.svg" },
      { name: "Kite", logo: "/logos/kite.svg" },
      { name: "Fieldnote", logo: "/logos/fieldnote.svg" },
      { name: "Halve", logo: "/logos/halve.svg" },
      { name: "Northwind", logo: "/logos/northwind.svg" },
    ],
  },
  about: {
    index: "01",
    label: "About",
    statement: "Marketing should get clearer before it gets louder.",
    paragraphs: [
      "I lead digital marketing for brands that already have demand, and for the ones still trying to name it. The work sits between the deck and the dashboard: what we say, where we spend, and whether the number moved for a real reason.",
      "Teams hire me when the channels have multiplied and the story has not. I stay close to the work. Briefs, creative, media, and the weekly review.",
    ],
    principlesTitle: "How the work runs",
    principles: [
      {
        title: "One number",
        text: "Pick the metric that pays for the rest. Report on that, not on activity.",
      },
      {
        title: "Creative is media",
        text: "The ad, the page, and the offer are one system. They get tested as one system.",
      },
      {
        title: "Measure, then scale",
        text: "Tracking is part of the launch, not a cleanup project for next quarter.",
      },
    ],
    toolsTitle: "Tools I actually open",
    tools: [
      "Google Ads",
      "Meta",
      "GA4",
      "GTM",
      "Looker Studio",
      "HubSpot",
      "Klaviyo",
      "Search Console",
    ],
    portrait: {
      image: "/images/Cinematic%20Portrait%20on%20Black.png",
      alt: "Portrait of Atik",
      position: "center 42%",
      mark: "A.",
      caption: "Strategy, media, and the measurement between them.",
      since: "In market since 2014",
    },
  },
  services: {
    index: "02",
    label: "Expertise",
    intro: "Open any line. The short version is here. The longer version is one tap away.",
    items: [
      {
        title: "Performance media",
        text: "Search, paid social, and the account structure underneath. Offers, audiences, and a creative test that someone owns.",
        detail: {
          meta: "Search, paid social, creative testing",
          tags: ["Google Ads", "Meta", "Offer tests", "Account structure"],
          blocks: [
            {
              label: "The work",
              text: "Paid media only pays when the offer, the audience, and the account agree. I rebuild that stack so every dollar has a job, and the campaigns that do not have one get turned off.",
            },
            {
              label: "How a month runs",
              text: "Week one is the account, the tracking, and the offer in plain language. After that, a creative test with a named owner, a weekly read of the number that matters, and a kill list for everything else.",
            },
            {
              label: "What you leave with",
              text: "A cleaner account, a test log you can hand to the next person, and a view of return that does not need a translator on Monday morning.",
            },
          ],
        },
      },
      {
        title: "SEO and content",
        text: "Pages that deserve to rank, and a publishing rhythm a small team can keep after I step back.",
        detail: {
          meta: "Search, content, technical basics",
          tags: ["Search Console", "Content", "Internal links", "Briefs"],
          blocks: [
            {
              label: "The work",
              text: "Rankings follow pages that answer a real query and a site that does not fight itself. I pick the few topics that can pay, then make the pages, the links, and the publishing rhythm match.",
            },
            {
              label: "How a month runs",
              text: "We start with the queries you already almost win, and the pages that should own them. Then a small calendar a team of two can keep: one strong page, the updates around it, and a look at what actually earned the click.",
            },
            {
              label: "What you leave with",
              text: "A short list of pages worth defending, briefs the writers can use without me in the room, and a Search Console habit that is about revenue, not a traffic screenshot.",
            },
          ],
        },
      },
      {
        title: "Lifecycle",
        text: "Email and CRM that pick up the demand paid media starts, instead of a separate calendar of blasts.",
        detail: {
          meta: "Email, CRM, retention",
          tags: ["Klaviyo", "HubSpot", "Flows", "Offers"],
          blocks: [
            {
              label: "The work",
              text: "Most lifecycle programs are a second marketing team with a different calendar. I connect them to the demand you already paid for, so the email finishes the job the ad started.",
            },
            {
              label: "How a month runs",
              text: "We map the few moments that change the number: the first reply, the abandoned step, the customer who went quiet. Each one gets one flow, one offer, and a reason to stop sending when it is done.",
            },
            {
              label: "What you leave with",
              text: "A small set of flows you can explain out loud, segments that match how people actually buy, and a calendar that does not compete with the paid plan.",
            },
          ],
        },
      },
      {
        title: "Conversion",
        text: "Landing pages, pricing, and the friction between the click and the customer.",
        detail: {
          meta: "Landing pages, offers, friction",
          tags: ["CRO", "Offers", "Pricing", "Forms"],
          blocks: [
            {
              label: "The work",
              text: "A click is not a customer. I work on the page, the offer, and the form until the path from the ad to the yes is short enough to trust.",
            },
            {
              label: "How a month runs",
              text: "We watch where people stall, then change one thing at a time: the promise, the proof, the price, or the number of fields. The test is tied to the same number the media is judged on.",
            },
            {
              label: "What you leave with",
              text: "A page that says one thing, a form that asks for less, and a record of what you tried so the next change is not a guess.",
            },
          ],
        },
      },
      {
        title: "Measurement",
        text: "GA4, tagging, and a dashboard a founder will actually open on Monday.",
        detail: {
          meta: "GA4, tagging, reporting",
          tags: ["GA4", "GTM", "Looker Studio", "Events"],
          blocks: [
            {
              label: "The work",
              text: "If the number cannot be defended, the budget cannot be defended. I set up the events, the consent, and the one dashboard that answers whether the work paid.",
            },
            {
              label: "How a month runs",
              text: "First we name the conversion that counts, and the ones that are only activity. Then the tags, a check that the ad platforms and the analytics agree, and a weekly page with room for a sentence, not forty charts.",
            },
            {
              label: "What you leave with",
              text: "A tagging plan, a dashboard someone opens, and a shared definition of the number so media, finance, and the founder are arguing about the work, not the spreadsheet.",
            },
          ],
        },
      },
      {
        title: "Marketing leadership",
        text: "The operating cadence: briefs, reviews, and a team pointed at one number.",
        detail: {
          meta: "Cadence, briefs, team",
          tags: ["Weekly review", "Briefs", "Hiring", "Priorities"],
          blocks: [
            {
              label: "The work",
              text: "Channels multiply faster than the story. I install the cadence that keeps a team pointed at one number: the brief, the review, and the decision about what stops.",
            },
            {
              label: "How a month runs",
              text: "A weekly hour on the number, the tests in flight, and the work that is late. A monthly look at what to fund, what to fix, and what to drop. I sit in the work, not above it.",
            },
            {
              label: "What you leave with",
              text: "A review people show up to, briefs that fit on a page, and a team that can tell you what they are not doing, which is usually the useful part.",
            },
          ],
        },
      },
    ],
  },
  work: {
    index: "03",
    label: "Selected work",
    intro: "A few engagements, told through the number that mattered.",
    scrollHint: "Scroll to move",
    items: [
      {
        slug: "northline",
        client: "Northline",
        title: "Fewer campaigns. A clearer offer.",
        year: "2025",
        summary:
          "An apparel brand was spending across fourteen live campaigns and could not explain which one paid the rent.",
        services: ["Paid social", "Offer", "Lifecycle"],
        metric: "6.1×",
        metricLabel: "Return on ad spend",
        background: "#f3efe6",
        foreground: "#16140f",
        image: "/images/northline.jpg",
        imageAlt: "Apparel store floor for the Northline campaign",
        story: [
          {
            label: "The brief",
            text: "Revenue was flat, creative volume was up, and the team was tired. They wanted a media plan. The account needed an offer first.",
          },
          {
            label: "The move",
            text: "We cut the live set down to three, rewrote the hero product story, and tied Klaviyo flows to the same promise the ads were making.",
          },
          {
            label: "The result",
            text: "Blended return moved from 3.8× to 6.1× over two quarters. The team ships less creative now, and more of it is allowed to win.",
          },
        ],
      },
      {
        slug: "lumen",
        client: "Lumen Clinic Group",
        title: "Leads the front desk can trust.",
        year: "2024",
        summary:
          "A multi-location clinic was buying leads that never became appointments. The form was doing too much of the selling.",
        services: ["Search", "CRO", "Tracking"],
        metric: "−42%",
        metricLabel: "Cost per booked visit",
        background: "#ffd9cc",
        foreground: "#2a120c",
        image: "/images/lumen.jpg",
        imageAlt: "Clinic reception for Lumen Clinic Group",
        story: [
          {
            label: "The brief",
            text: "Cost per lead looked fine in the agency report. The clinics were still quiet on Tuesdays.",
          },
          {
            label: "The move",
            text: "We changed the goal to booked visits, rebuilt the landing pages around one condition each, and fixed the call tracking that had been double counting.",
          },
          {
            label: "The result",
            text: "Cost per booked visit fell 42%. The weekly review finally matched what the front desk was seeing.",
          },
        ],
      },
      {
        slug: "velour",
        client: "Velour Atelier",
        title: "Search that sounds like the brand.",
        year: "2024",
        summary:
          "A beauty label had an audience and almost no organic revenue. The content was pretty, and hard to find.",
        services: ["SEO", "Content", "Analytics"],
        metric: "+128%",
        metricLabel: "Organic revenue",
        background: "#dff25a",
        foreground: "#14160a",
        image: "/images/velour.jpg",
        imageAlt: "Beauty products for Velour Atelier",
        story: [
          {
            label: "The brief",
            text: "They did not want a blog that felt like a different company. They wanted the journal they already believed in to earn its keep.",
          },
          {
            label: "The move",
            text: "We rebuilt the information architecture, wrote a small set of pages around real search demand, and measured assisted revenue instead of sessions.",
          },
          {
            label: "The result",
            text: "Organic revenue was up 128% in nine months. The journal still sounds like them.",
          },
        ],
      },
      {
        slug: "kite",
        client: "Kite Pay",
        title: "Trial users who meant it.",
        year: "2023",
        summary:
          "A payments product was celebrating signups. Activation was the quiet problem in the second tab of the sheet.",
        services: ["Lifecycle", "Paid", "CRO"],
        metric: "+37%",
        metricLabel: "Trial to paid",
        background: "#1c1e1a",
        foreground: "#f4f0e6",
        image: "/images/kite.jpg",
        imageAlt: "A customer paying by phone at the counter",
        story: [
          {
            label: "The brief",
            text: "Paid acquisition was working just well enough to hide a leak. People started trials and never sent their first invoice.",
          },
          {
            label: "The move",
            text: "We rebuilt onboarding around that first invoice, rewrote the trial emails, and stopped optimizing ads for the cheapest signup.",
          },
          {
            label: "The result",
            text: "Trial-to-paid rose 37%. Cost per activated account became the number in the Monday meeting.",
          },
        ],
      },
    ],
  },
  achievements: {
    index: "04",
    label: "Achievements",
    intro: "Proof from the rooms that kept the work.",
    items: [
      {
        figure: "37%",
        title: "Trial to paid",
        detail: "Kite Pay stopped buying the cheapest signup. Activation became the number in the Monday meeting.",
      },
      {
        figure: "One",
        title: "Offer, then the rest",
        detail: "Northline dropped fourteen campaigns and fixed the offer that was actually selling. Revenue followed.",
      },
      {
        figure: "A buyer",
        title: "A system, not a channel",
        detail: "Fieldnote’s paid, lifecycle, and analytics stack became something a buyer could underwrite.",
      },
      {
        figure: "Weekly",
        title: "A review people keep",
        detail: "Reports operators would argue with. That is when the numbers started to change the work.",
      },
    ],
  },
  testimonials: {
    index: "05",
    label: "Clients",
    intro: "Short notes from the brands in the work.",
    seeAll: "See all",
    pageIntro: "Every note, in one place. The same voices, without the rotation.",
    items: [
      {
        quote:
          "Atik was the first person to tell us to stop running fourteen campaigns and fix the one offer. Revenue followed.",
        name: "Mira Sen",
        role: "Founder, Northline",
        image: "/images/mira.jpg",
        imageAlt: "Mira Sen",
      },
      {
        quote:
          "We finally trust the numbers. Media, the landing pages, and the front desk stopped arguing with each other.",
        name: "Julian Peck",
        role: "Director of Growth, Lumen Clinic Group",
        image: "/images/julian.jpg",
        imageAlt: "Julian Peck",
      },
      {
        quote:
          "Sharp taste, calmer meetings, and a return we can explain to the board without a footnote.",
        name: "Lena Ortiz",
        role: "CMO, Velour Atelier",
        image: "/images/lena.jpg",
        imageAlt: "Lena Ortiz",
      },
      {
        quote:
          "He treats creative as a media variable, not a decoration. That changed how our paid social gets made.",
        name: "Chris Adeyemi",
        role: "VP Marketing, Kite Pay",
        image: "/images/chris.jpg",
        imageAlt: "Chris Adeyemi",
      },
      {
        quote:
          "The weekly review got shorter and the decisions got cleaner. We stopped presenting and started choosing.",
        name: "Priya Raman",
        role: "Head of Brand, Halve",
        image: "",
        imageAlt: "",
      },
      {
        quote:
          "He made the front desk, the ads, and the landing page tell the same story. Bookings stopped feeling accidental.",
        name: "Noah Berg",
        role: "Founder, Fieldnote",
        image: "",
        imageAlt: "",
      },
    ],
  },
  cases: {
    index: "06",
    label: "Case studies",
    intro: "Four engagements, from the brief to the number that moved.",
    seeAll: "See all",
    pageIntro: "Every engagement, from the brief to the number that moved.",
  },
  videos: {
    index: "07",
    label: "Videos",
    intro: "Talks and breakdowns worth the watch. Press play, the rest of the page waits.",
    playLabel: "Play",
    channelLabel: "YouTube channel",
    channelHref: "https://www.youtube.com",
    items: [
      {
        youtubeId: "qp0HIF3SfI4",
        title: "How great leaders inspire action",
        meta: "Talk · 18 min",
      },
      {
        youtubeId: "xBIVlM435Zg",
        title: "How to get your ideas to spread",
        meta: "Talk · 17 min",
      },
      {
        youtubeId: "fW8amMCVAJQ",
        title: "First follower: leadership lessons",
        meta: "Short · 3 min",
      },
      {
        youtubeId: "Ks-_Mh1QhMc",
        title: "Your body language may shape who you are",
        meta: "Talk · 21 min",
      },
      {
        youtubeId: "iueVZJVEmEs",
        title: "Perspective is everything",
        meta: "Talk · 18 min",
      },
      {
        youtubeId: "rrkrvAUbU9Y",
        title: "The puzzle of motivation",
        meta: "Talk · 18 min",
      },
      {
        youtubeId: "arj7oStGLkU",
        title: "Inside the mind of a master procrastinator",
        meta: "Talk · 14 min",
      },
      {
        youtubeId: "H14bBuluwB8",
        title: "Grit: the power of passion and perseverance",
        meta: "Talk · 6 min",
      },
    ],
  },
  courses: {
    label: "Courses",
    status: "Upcoming",
    title: "Courses are on the way.",
    intro:
      "Practical programs on paid media, measurement, and building a growth system a small team can run. The first cohort opens soon.",
    topics: ["Performance media", "GA4 and tracking", "Offer and landing pages", "Weekly growth review"],
    cta: "Get notified",
    ctaHref: "mailto:hello@atik.studio?subject=Course%20updates",
  },
  blog: {
    index: "08",
    label: "Journal",
    title: "Field notes from the work.",
    intro: "What I test, what I keep, and what I stop doing. Short reads for people who run the numbers.",
    seeAll: "All articles",
    pageTitle: "Journal",
    pageIntro: "Notes on paid media, measurement, offers, and the weekly habits that make growth repeatable.",
    readLabel: "Read article",
    featuredLabel: "Featured",
    moreTitle: "Keep reading",
    newerLabel: "Newer",
    olderLabel: "Older",
    articlesLabel: "Articles",
    topicsLabel: "Topics",
    pageLabel: "Page",
    shareLabel: "Share",
    writtenBy: "Written by",
    ctaTitle: "Want this kind of thinking on your numbers?",
    ctaButton: "Start a project",
    perPage: 6,
    posts: [
      {
        title: "Fourteen campaigns, one question: which one pays?",
        slug: "which-campaign-pays",
        category: "Paid media",
        date: "2026-10-28",
        readTime: "7 min read",
        excerpt:
          "Most accounts do not have a budget problem. They have a sorting problem. Here is the simple audit I run before touching a single bid.",
        cover: "/images/northline.jpg",
        coverAlt: "Apparel store floor with racks of clothing",
        featured: true,
        tags: ["Meta ads", "Audit", "Budget"],
        body: [
          {
            text: "When a brand tells me paid social stopped working, I almost never find a broken platform. I find fourteen live campaigns, six audiences that overlap, and nobody who can say which one brought in last month's revenue.\n\nThe fix is not a new creative or a new agency. It is a sorting exercise, and it takes about an afternoon.",
          },
          {
            heading: "Start with the money, not the dashboard",
            text: "Export ninety days of orders from the store, not from the ad platform. Match them to the last paid touch you can trust. You will see that two or three campaigns carry almost all of the real revenue.\n\nEverything else is either testing, retargeting the same people, or spending because nobody turned it off.",
            quote: "If you cannot explain why a campaign exists in one sentence, it should not have a budget.",
            images: [
              {
                src: "/images/velour.jpg",
                alt: "A small, focused set of beauty products laid out on a table",
                caption: "Two or three campaigns usually carry the real revenue. The rest is shelf space.",
                link: "/blog/landing-page-cheapest-ad",
              },
            ],
          },
          {
            heading: "Collapse, then rebuild",
            text: "Merge the overlapping audiences. Keep one prospecting campaign, one retargeting campaign, and one clear test. Give each a single job and a single number it is judged by.\n\nFewer campaigns means more data per campaign, which means the algorithm learns faster and your [weekly review](/blog/weekly-growth-review) takes ten minutes instead of an hour.",
          },
          {
            heading: "What usually happens next",
            text: "Spend goes down for two weeks while learning resets. Then cost per purchase drops, and for the first time the team can answer the question every founder asks: what happens if we add another thousand a day?",
          },
        ],
      },
      {
        title: "The GA4 setup I give every new client",
        slug: "ga4-setup-every-client",
        category: "Measurement",
        date: "2026-10-14",
        readTime: "9 min read",
        excerpt:
          "Five events, two audiences, one report. A small, boring GA4 setup that answers the questions people actually ask on Monday morning.",
        cover: "",
        coverAlt: "",
        featured: false,
        tags: ["GA4", "Tracking", "Reporting"],
        body: [
          {
            text: "GA4 can track almost anything, which is exactly why most setups end up tracking nothing useful. Before adding a single custom event, I write down the five questions the team asks every week.",
          },
          {
            heading: "Five events are enough",
            text: "View item, add to cart, begin checkout, purchase, and one lead event. Name them the way [GA4's recommended events](https://support.google.com/analytics/answer/9267735) expect so the built-in reports work without extra mapping.\n\nEverything else can wait until someone asks a question these five cannot answer.",
          },
          {
            heading: "One report for the whole team",
            text: "Build a single exploration with sessions, conversion rate, and revenue by channel group. Pin it. Delete the rest. A report people open every week beats ten reports nobody trusts.",
            quote: "Good measurement is not more data. It is fewer arguments.",
          },
        ],
      },
      {
        title: "Your landing page is the cheapest ad you will ever buy",
        slug: "landing-page-cheapest-ad",
        category: "Conversion",
        date: "2026-09-30",
        readTime: "6 min read",
        excerpt:
          "Doubling conversion rate halves your cost per lead, and it does not need a bigger budget. Three changes I test before raising spend.",
        cover: "/images/lumen.jpg",
        coverAlt: "Calm workspace with soft daylight",
        featured: false,
        tags: ["Landing pages", "CRO", "Offer"],
        body: [
          {
            text: "Every extra point of conversion rate makes every ad you run cheaper. Yet most teams spend weeks on new creative and minutes on the page the click lands on.",
          },
          {
            heading: "Say the offer in the first screen",
            text: "Who it is for, what they get, and what happens after they click. If a stranger cannot repeat it back in five seconds, the headline is doing too much.",
          },
          {
            heading: "Remove one field",
            text: "Every form field is a small reason to leave. Ask for what you need to reply, nothing more. You can learn the rest on the first call.",
            quote: "The best form is the one people finish.",
          },
          {
            heading: "Show proof near the button",
            text: "A number, a logo, or one short quote placed right above the call to action does more than a testimonial wall at the bottom of the page.",
            images: [
              { src: "/images/kite.jpg", alt: "Customer paying with a phone at a shop counter", caption: "Before: proof sat below the fold." },
              { src: "/images/lumen.jpg", alt: "Calm reception area", caption: "After: one number right above the button." },
            ],
          },
        ],
      },
      {
        title: "A weekly growth review that takes 30 minutes",
        slug: "weekly-growth-review",
        category: "Systems",
        date: "2026-09-16",
        readTime: "5 min read",
        excerpt:
          "The meeting that replaced three status calls. One page, four numbers, and a rule about what we are allowed to change.",
        cover: "",
        coverAlt: "",
        featured: false,
        tags: ["Process", "Team", "Reporting"],
        body: [
          {
            text: "Growth rarely stalls because of one bad decision. It stalls because nobody looks at the same numbers at the same time, so small problems get a month to grow.",
          },
          {
            heading: "Four numbers, same order, every week",
            text: "Spend, cost per result, conversion rate, and revenue. Compare to last week and to the four-week average. Anything that moved more than fifteen percent gets one sentence of explanation.",
          },
          {
            heading: "One change per channel",
            text: "Each channel owner picks a single change for the coming week and writes down what they expect to happen. Next week we check. That is the whole system.",
            quote: "A review without a written prediction is just a meeting.",
          },
        ],
      },
      {
        title: "Why your best audience is the one you already paid for",
        slug: "best-audience-already-paid-for",
        category: "Lifecycle",
        date: "2026-09-02",
        readTime: "6 min read",
        excerpt:
          "Retention is the growth channel most teams ignore because it is quiet. A simple email and offer plan that lifted repeat orders by a third.",
        cover: "/images/velour.jpg",
        coverAlt: "Close-up of a premium product on a soft background",
        featured: false,
        tags: ["Email", "Retention", "Offer"],
        body: [
          {
            text: "Acquisition gets the budget and the meetings. Retention gets whatever time is left on Friday. Yet the people who already bought from you are the cheapest sale you will ever make.",
          },
          {
            heading: "Three emails, not thirty",
            text: "A thank-you that sets expectations, a how-to that helps them get value, and a well-timed second offer based on when people usually reorder. Get those right before building anything bigger.",
          },
          {
            heading: "Time the second offer",
            text: "Look at your own data for the median days between first and second order. Send the offer a few days before that point, not on a random calendar schedule.",
          },
        ],
      },
      {
        title: "How I brief creative so it does not come back wrong",
        slug: "brief-creative-right",
        category: "Creative",
        date: "2026-08-19",
        readTime: "5 min read",
        excerpt:
          "Most weak ads start as weak briefs. The one-page template I use with designers and video editors, and why it starts with the customer's words.",
        cover: "",
        coverAlt: "",
        featured: false,
        tags: ["Creative", "Briefing", "Ads"],
        body: [
          {
            text: "When creative misses, the team blames the designer. Usually the brief asked for everything and decided nothing.",
          },
          {
            heading: "Start with a real customer sentence",
            text: "Pull one line from a review, a sales call, or a support ticket. Put it at the top of the brief. It tells the designer who the ad is for better than any persona document.",
            quote: "Your customer already wrote your best headline. You just have to find it.",
          },
          {
            heading: "One job per ad",
            text: "Stop the scroll, explain the offer, or handle an objection. Pick one. Ads that try to do all three end up doing none of them well.",
          },
        ],
      },
      {
        title: "Local search that sounds like the brand",
        slug: "local-search-brand-voice",
        category: "SEO",
        date: "2026-08-05",
        readTime: "8 min read",
        excerpt:
          "Ranking for the right local terms without filling the site with copy nobody would say out loud. What worked for a multi-location clinic.",
        cover: "/images/kite.jpg",
        coverAlt: "City street with shopfronts at dusk",
        featured: false,
        tags: ["SEO", "Local", "Content"],
        body: [
          {
            text: "Local SEO advice often ends with pages that read like they were written for a robot. They might rank for a while, but they do not convert, and the brand team hates them.",
          },
          {
            heading: "One strong page per location",
            text: "Real photos, real staff names, opening hours, parking, and the three questions people ask on the phone. That page will outrank a dozen thin ones.",
          },
          {
            heading: "Write the way the front desk talks",
            text: "Ask the people who answer the phone how patients describe their problem. Use those words in headings. It helps rankings and it sounds like a human wrote it, because one did.",
          },
        ],
      },
      {
        title: "The trial users who meant it",
        slug: "trial-users-who-meant-it",
        category: "SaaS",
        date: "2026-07-22",
        readTime: "7 min read",
        excerpt:
          "More sign-ups made the numbers look good and the sales team miserable. How we traded volume for intent and grew paid conversions.",
        cover: "",
        coverAlt: "",
        featured: false,
        tags: ["SaaS", "Trials", "Qualification"],
        body: [
          {
            text: "Cheap trial sign-ups are easy to buy. The question is how many of them ever open the product a second time.",
          },
          {
            heading: "Optimize for the second session",
            text: "We changed the conversion event from sign-up to a meaningful action inside the product. Volume dropped by a third. Paid conversions went up.",
            quote: "The platform will find you exactly what you ask for. Ask for the right thing.",
          },
          {
            heading: "Add one honest question",
            text: "A single question on the sign-up form about team size let sales focus on the accounts that could actually buy, and let the product handle the rest.",
          },
        ],
      },
    ],
  },
  contact: {
    index: "09",
    label: "Contact",
    title: "Tell me what you want to grow.",
    lede: "A short note is enough. I read every one and reply myself.",
    notes: [
      "The number you actually care about",
      "The channel that feels noisy",
      "How soon you want to move",
    ],
    submit: "Send the note",
    successTitle: "Received.",
    successBody: "Thank you. I’ll read this and reply personally.",
    failure: "The note did not go through. Try again, or email me directly.",
    fields: {
      name: { label: "Name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "you@company.com" },
      company: { label: "Company", placeholder: "Optional" },
      phone: { label: "Mobile number", placeholder: "+1 000 000 0000" },
      message: {
        label: "What should change?",
        placeholder: "The offer, the channel, the number.",
      },
    },
    errors: {
      name: "Add your name.",
      email: "Add a real email.",
      message: "Tell me a little about the work.",
    },
  },
  footer: {
    line: "The next quarter can look different.",
    rights: "All rights reserved.",
  },
  socials: [
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com", enabled: true, icon: null },
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com", enabled: true, icon: null },
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com", enabled: true, icon: null },
    { platform: "youtube", label: "YouTube", href: "https://www.youtube.com", enabled: true, icon: null },
    { platform: "tiktok", label: "TikTok", href: "https://www.tiktok.com", enabled: true, icon: null },
    { platform: "x", label: "X", href: "https://x.com", enabled: true, icon: null },
    { platform: "whatsapp", label: "WhatsApp", href: "https://wa.me/10000000000", enabled: true, icon: null },
    { platform: "email", label: "Email", href: "mailto:hello@atik.studio", enabled: true, icon: null },
  ],
  ui: {
    skip: "Skip to content",
    close: "Close",
    back: "Back",
    cursorView: "View",
    cursorRead: "Read",
    cursorDrag: "Drag",
  },
  modules: [
    { id: "marquee", enabled: true },
    { id: "about", enabled: true },
    { id: "services", enabled: true },
    { id: "work", enabled: true },
    { id: "achievements", enabled: true },
    { id: "testimonials", enabled: true },
    { id: "cases", enabled: true },
    { id: "videos", enabled: true },
    { id: "blog", enabled: true },
    { id: "contact", enabled: true },
  ],
};
