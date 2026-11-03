/**
 * Every public string and image path on the site lives here.
 * Swap a photo by replacing the file in public/images, or by changing `src`.
 * Keep the same shape: portrait is tall (4:5), case-study photos are wide (3:2),
 * client photos are square. object-cover crops them, so a new photo still fills the frame.
 * The same portrait is used in the hero and the about section.
 * Videos only need the YouTube id (the part after watch?v=). The thumbnail comes from YouTube.
 * The CV file lives in public/cv. Set `cv` to null to hide every download button.
 * Brand logos are wide and short, on a transparent background.
 * The marquee shows them at one height on the light band, so a new file still sits on the line.
 * When Express + Postgres are connected, keep this shape and replace getSiteContent() with a fetch.
 */

export type ModuleId =
  | "marquee"
  | "about"
  | "services"
  | "work"
  | "achievements"
  | "testimonials"
  | "cases"
  | "videos"
  | "contact";

export type NavLink =
  | { label: string; id: ModuleId | "content" }
  | { label: string; href: string };

export type VideoItem = {
  youtubeId: string;
  title: string;
  meta: string;
};

export type SiteModule = {
  id: ModuleId;
  enabled: boolean;
};

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  year: string;
  summary: string;
  services: string[];
  metric: string;
  metricLabel: string;
  background: string;
  foreground: string;
  image: string;
  imageAlt: string;
  story: { label: string; text: string }[];
};

export type ServiceItem = {
  title: string;
  text: string;
  detail: {
    meta: string;
    tags: string[];
    blocks: { label?: string; text: string }[];
  };
};

export type BrandLogo = {
  name: string;
  logo: string;
};

export type DetailView = {
  eyebrow: string;
  title: string;
  meta: string;
  metric?: string;
  metricLabel?: string;
  image?: string;
  imageAlt?: string;
  background: string;
  foreground: string;
  tags: string[];
  blocks: { label?: string; text: string }[];
};

export type SocialPlatform =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "x"
  | "whatsapp"
  | "email";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
  enabled: boolean;
};

export type SiteContent = {
  meta: { title: string; description: string };
  profile: {
    name: string;
    role: string;
    email: string;
    location: string;
    availability: string;
    year: string;
    mark: string;
    cv: { label: string; href: string; fileName: string; meta: string } | null;
  };
  loader: { words: string[]; tag: string; loading: string };
  nav: {
    links: NavLink[];
    cta: string;
    ctaTarget: ModuleId;
    menu: string;
    close: string;
  };
  hero: {
    lines: { text: string; accent?: boolean }[];
    lede: string;
    primaryCta: string;
    primaryTarget: ModuleId;
    secondaryCta: string;
    secondaryTarget: ModuleId;
    scroll: string;
    stats: Stat[];
  };
  marquee: {
    label: string;
    items: BrandLogo[];
  };
  about: {
    index: string;
    label: string;
    statement: string;
    paragraphs: string[];
    principlesTitle: string;
    principles: { title: string; text: string }[];
    toolsTitle: string;
    tools: string[];
    portrait: {
      image: string | null;
      alt: string;
      position?: string;
      mark: string;
      caption: string;
      since: string;
    };
  };
  services: {
    index: string;
    label: string;
    intro: string;
    items: ServiceItem[];
  };
  work: {
    index: string;
    label: string;
    intro: string;
    scrollHint: string;
    items: CaseStudy[];
  };
  achievements: {
    index: string;
    label: string;
    intro: string;
    items: { figure: string; title: string; detail: string }[];
  };
  testimonials: {
    index: string;
    label: string;
    intro: string;
    seeAll: string;
    pageIntro: string;
    items: { quote: string; name: string; role: string; image: string; imageAlt: string }[];
  };
  cases: {
    index: string;
    label: string;
    intro: string;
    seeAll: string;
    pageIntro: string;
  };
  videos: {
    index: string;
    label: string;
    intro: string;
    playLabel: string;
    channelLabel: string;
    channelHref: string;
    items: VideoItem[];
  };
  courses: {
    label: string;
    status: string;
    title: string;
    intro: string;
    topics: string[];
    cta: string;
    ctaHref: string;
  };
  contact: {
    index: string;
    label: string;
    title: string;
    lede: string;
    notes: string[];
    submit: string;
    successTitle: string;
    successBody: string;
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      company: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
    };
    errors: { name: string; email: string; message: string };
  };
  footer: { line: string; rights: string };
  socials: SocialLink[];
  ui: { skip: string; close: string; back: string; cursorView: string; cursorRead: string; cursorDrag: string };
  modules: SiteModule[];
};

const siteContent: SiteContent = {
  meta: {
    title: "Atik · Senior Digital Marketer",
    description:
      "Strategy, media, lifecycle, and measurement for brands that want growth with a point of view.",
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
  contact: {
    index: "08",
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
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com", enabled: true },
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com", enabled: true },
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com", enabled: true },
    { platform: "youtube", label: "YouTube", href: "https://www.youtube.com", enabled: true },
    { platform: "tiktok", label: "TikTok", href: "https://www.tiktok.com", enabled: true },
    { platform: "x", label: "X", href: "https://x.com", enabled: true },
    { platform: "whatsapp", label: "WhatsApp", href: "https://wa.me/10000000000", enabled: true },
    { platform: "email", label: "Email", href: "mailto:hello@atik.studio", enabled: true },
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
    { id: "contact", enabled: true },
  ],
};

export function getSiteContent(): SiteContent {
  return siteContent;
}

export function moduleEnabled(site: SiteContent, id: ModuleId) {
  return site.modules.some((module) => module.id === id && module.enabled);
}
