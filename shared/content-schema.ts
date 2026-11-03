import { z } from "zod";

/**
 * One schema drives the public types, the API validation, and the dashboard forms.
 * `title` is the label in the dashboard. `widget` picks a special input:
 * textarea, image, file, color, icon. Field order here is the order in the form.
 */

const text = (title: string, description?: string) => z.string().meta({ title, description });
const long = (title: string, description?: string) => z.string().meta({ title, description, widget: "textarea" });
const image = (title: string, description?: string) => z.string().meta({ title, description, widget: "image" });
const file = (title: string, description?: string) => z.string().meta({ title, description, widget: "file" });
const color = (title: string) => z.string().meta({ title, widget: "color" });
const list = <T extends z.ZodType>(item: T, title: string, description?: string) =>
  z.array(item).meta({ title, description });

export const moduleIds = [
  "marquee",
  "about",
  "services",
  "work",
  "achievements",
  "testimonials",
  "cases",
  "videos",
  "contact",
] as const;

const ModuleIdSchema = z.enum(moduleIds).meta({ title: "Section" });

export const IconSchema = z
  .union([
    z
      .object({
        kind: z.literal("svg"),
        name: z.string(),
        viewBox: z.string(),
        body: z.string(),
        mode: z.enum(["fill", "stroke"]),
      })
      .meta({ title: "Library icon" }),
    z.object({ kind: z.literal("image"), name: z.string(), src: z.string() }).meta({ title: "Uploaded icon" }),
  ])
  .nullable()
  .meta({ title: "Icon", widget: "icon", description: "Leave empty to use the built-in icon for the platform." });

const NavLinkSchema = z.union([
  z
    .object({ label: text("Label"), id: z.enum([...moduleIds, "content"]).meta({ title: "Scroll to section" }) })
    .meta({ title: "Section link" }),
  z.object({ label: text("Label"), href: text("Link", "A page like /courses or a full URL.") }).meta({ title: "Page link" }),
]);

const StatSchema = z.object({
  value: z.number().meta({ title: "Number" }),
  prefix: text("Before the number").optional(),
  suffix: text("After the number").optional(),
  decimals: z.number().int().min(0).max(3).optional().meta({ title: "Decimals" }),
  label: text("Label"),
});

const BlockSchema = z.object({ label: text("Heading").optional(), text: long("Text") });

const CaseStudySchema = z.object({
  slug: text("Slug", "Short id, lowercase, no spaces."),
  client: text("Client"),
  title: text("Title"),
  year: text("Year"),
  summary: long("Summary"),
  services: list(text("Service"), "Services"),
  metric: text("Headline number"),
  metricLabel: text("Number label"),
  background: color("Card background"),
  foreground: color("Card text color"),
  image: image("Photo", "Wide, 3:2."),
  imageAlt: text("Photo description (alt text)"),
  story: list(z.object({ label: text("Heading"), text: long("Text") }), "Story"),
});

const ServiceSchema = z.object({
  title: text("Title"),
  text: long("Short text"),
  detail: z
    .object({
      meta: text("Subtitle"),
      tags: list(text("Tag"), "Tags"),
      blocks: list(BlockSchema, "Detail blocks"),
    })
    .meta({ title: "Detail view" }),
});

const SocialSchema = z.object({
  platform: text("Platform key", "linkedin, facebook, instagram, youtube, tiktok, x, whatsapp, email, or any new name."),
  label: text("Label"),
  href: text("Link"),
  enabled: z.boolean().meta({ title: "Show" }),
  icon: IconSchema,
}).meta({ title: "Social link" });

const PageSeoSchema = z.object({
  title: text("Page title"),
  description: long("Meta description", "Around 150 characters."),
});

export const SiteContentSchema = z.object({
  seo: z
    .object({
      siteUrl: text("Site URL", "The live domain, like https://atik.studio. Used for sitemap and share links."),
      siteName: text("Site name"),
      titleTemplate: text("Title template", "%s is replaced by the page title."),
      keywords: list(text("Keyword"), "Keywords"),
      ogImage: image("Share image", "1200×630. Shown when the site is shared on social media."),
      twitterHandle: text("X / Twitter handle", "Like @atik. Optional."),
      googleVerification: text("Google Search Console verification code", "Optional."),
      indexing: z.boolean().meta({ title: "Allow search engines to index the site" }),
      pages: z
        .object({
          home: PageSeoSchema.meta({ title: "Home" }),
          cases: PageSeoSchema.meta({ title: "Case studies page" }),
          clients: PageSeoSchema.meta({ title: "Clients page" }),
          courses: PageSeoSchema.meta({ title: "Courses page" }),
        })
        .meta({ title: "Pages" }),
    })
    .meta({ title: "SEO" }),
  profile: z
    .object({
      name: text("Name"),
      role: text("Role"),
      email: text("Email"),
      location: text("Location"),
      availability: text("Availability"),
      year: text("Year"),
      mark: text("Logo text"),
      cv: z
        .object({
          label: text("Button label"),
          href: file("CV file"),
          fileName: text("Download file name"),
          meta: text("Small note"),
        })
        .nullable()
        .meta({ title: "CV download", description: "Turn off to hide every CV button." }),
    })
    .meta({ title: "Profile" }),
  loader: z
    .object({
      words: list(text("Word"), "Rotating words"),
      tag: text("Top label"),
      loading: text("Loading label"),
    })
    .meta({ title: "Loading screen" }),
  nav: z
    .object({
      links: list(NavLinkSchema, "Menu links"),
      cta: text("Button label"),
      ctaTarget: ModuleIdSchema,
      menu: text("Menu label (mobile)"),
      close: text("Close label (mobile)"),
    })
    .meta({ title: "Menu" }),
  hero: z
    .object({
      lines: list(
        z.object({ text: text("Line"), accent: z.boolean().optional().meta({ title: "Highlight" }) }),
        "Headline lines",
      ),
      lede: long("Intro"),
      primaryCta: text("Main button"),
      primaryTarget: ModuleIdSchema,
      secondaryCta: text("Second button"),
      secondaryTarget: ModuleIdSchema,
      scroll: text("Scroll label"),
      stats: list(StatSchema, "Stats"),
    })
    .meta({ title: "Hero" }),
  marquee: z
    .object({
      label: text("Label"),
      items: list(z.object({ name: text("Brand"), logo: image("Logo", "Wide, transparent background.") }), "Logos"),
    })
    .meta({ title: "Brand logos" }),
  about: z
    .object({
      index: text("Number"),
      label: text("Label"),
      statement: long("Statement"),
      paragraphs: list(long("Paragraph"), "Paragraphs"),
      principlesTitle: text("Principles title"),
      principles: list(z.object({ title: text("Title"), text: long("Text") }), "Principles"),
      toolsTitle: text("Tools title"),
      tools: list(text("Tool"), "Tools"),
      portrait: z
        .object({
          image: image("Portrait", "Tall, 4:5. Used in the hero and here.").nullable(),
          alt: text("Portrait description (alt text)"),
          position: text("Crop position", "CSS object-position, like center 42%.").optional(),
          mark: text("Mark"),
          caption: text("Caption"),
          since: text("Since"),
        })
        .meta({ title: "Portrait" }),
    })
    .meta({ title: "About" }),
  services: z
    .object({
      index: text("Number"),
      label: text("Label"),
      intro: long("Intro"),
      items: list(ServiceSchema, "Services"),
    })
    .meta({ title: "Expertise" }),
  work: z
    .object({
      index: text("Number"),
      label: text("Label"),
      intro: long("Intro"),
      scrollHint: text("Scroll hint"),
      items: list(CaseStudySchema, "Case studies"),
    })
    .meta({ title: "Work & case studies" }),
  achievements: z
    .object({
      index: text("Number"),
      label: text("Label"),
      intro: long("Intro"),
      items: list(z.object({ figure: text("Figure"), title: text("Title"), detail: long("Detail") }), "Achievements"),
    })
    .meta({ title: "Achievements" }),
  testimonials: z
    .object({
      index: text("Number"),
      label: text("Label"),
      intro: long("Intro"),
      seeAll: text("See all label"),
      pageIntro: long("Clients page intro"),
      items: list(
        z.object({
          quote: long("Quote"),
          name: text("Name"),
          role: text("Role"),
          image: image("Photo", "Square. Optional."),
          imageAlt: text("Photo description (alt text)"),
        }),
        "Reviews",
      ),
    })
    .meta({ title: "Clients" }),
  cases: z
    .object({
      index: text("Number"),
      label: text("Label"),
      intro: long("Intro"),
      seeAll: text("See all label"),
      pageIntro: long("Case studies page intro"),
    })
    .meta({ title: "Case studies section" }),
  videos: z
    .object({
      index: text("Number"),
      label: text("Label"),
      intro: long("Intro"),
      playLabel: text("Play label"),
      channelLabel: text("Channel link label"),
      channelHref: text("Channel link"),
      items: list(
        z.object({
          youtubeId: text("YouTube id", "The part after watch?v= in the link."),
          title: text("Title"),
          meta: text("Small note", "Like Talk · 18 min."),
        }),
        "Videos",
      ),
    })
    .meta({ title: "Videos" }),
  courses: z
    .object({
      label: text("Label"),
      status: text("Status"),
      title: text("Title"),
      intro: long("Intro"),
      topics: list(text("Topic"), "Topics"),
      cta: text("Button label"),
      ctaHref: text("Button link"),
    })
    .meta({ title: "Courses page" }),
  contact: z
    .object({
      index: text("Number"),
      label: text("Label"),
      title: text("Title"),
      lede: long("Intro"),
      notes: list(text("Note"), "Notes"),
      submit: text("Submit button"),
      successTitle: text("Success title"),
      successBody: long("Success message"),
      failure: long("Error message", "Shown when the message could not be sent."),
      fields: z
        .object({
          name: z.object({ label: text("Label"), placeholder: text("Placeholder") }).meta({ title: "Name field" }),
          email: z.object({ label: text("Label"), placeholder: text("Placeholder") }).meta({ title: "Email field" }),
          company: z.object({ label: text("Label"), placeholder: text("Placeholder") }).meta({ title: "Company field" }),
          phone: z.object({ label: text("Label"), placeholder: text("Placeholder") }).meta({ title: "Phone field" }),
          message: z.object({ label: text("Label"), placeholder: text("Placeholder") }).meta({ title: "Message field" }),
        })
        .meta({ title: "Form fields" }),
      errors: z
        .object({ name: text("Missing name"), email: text("Bad email"), message: text("Missing message") })
        .meta({ title: "Form errors" }),
    })
    .meta({ title: "Contact" }),
  footer: z.object({ line: text("Closing line"), rights: text("Rights text") }).meta({ title: "Footer" }),
  socials: list(SocialSchema, "Social links").meta({ title: "Social links" }),
  ui: z
    .object({
      skip: text("Skip link"),
      close: text("Close"),
      back: text("Back"),
      cursorView: text("Cursor: view"),
      cursorRead: text("Cursor: read"),
      cursorDrag: text("Cursor: drag"),
    })
    .meta({ title: "Small labels" }),
  modules: list(
    z.object({ id: ModuleIdSchema, enabled: z.boolean().meta({ title: "Show" }) }),
    "Home sections",
    "Turn sections on or off.",
  ).meta({ title: "Home sections" }),
});

export type SiteContent = z.infer<typeof SiteContentSchema>;
export type SectionKey = keyof SiteContent;
export type ModuleId = (typeof moduleIds)[number];
export type Icon = z.infer<typeof IconSchema>;
export type NavLink = SiteContent["nav"]["links"][number];
export type VideoItem = SiteContent["videos"]["items"][number];
export type CaseStudy = SiteContent["work"]["items"][number];
export type ServiceItem = SiteContent["services"]["items"][number];
export type BrandLogo = SiteContent["marquee"]["items"][number];
export type SocialLink = SiteContent["socials"][number];
export type Stat = SiteContent["hero"]["stats"][number];
export type SiteModule = SiteContent["modules"][number];

export const sectionKeys = Object.keys(SiteContentSchema.shape) as SectionKey[];

export function sectionSchema(key: SectionKey) {
  return SiteContentSchema.shape[key];
}

export function isSectionKey(key: string): key is SectionKey {
  return (sectionKeys as string[]).includes(key);
}
