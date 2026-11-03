import { sectionSchema, type SectionKey } from "@/shared/content-schema";

export const sectionGroups: { title: string; keys: SectionKey[] }[] = [
  { title: "Site", keys: ["seo", "profile", "nav", "socials", "footer", "loader", "modules", "ui"] },
  {
    title: "Home page",
    keys: ["hero", "marquee", "about", "services", "work", "achievements", "testimonials", "cases", "videos", "contact"],
  },
  { title: "Other pages", keys: ["courses"] },
];

export const sectionNotes: Partial<Record<SectionKey, string>> = {
  seo: "Page titles, descriptions, share image, and search engine settings.",
  profile: "Name, role, email, and the CV file.",
  nav: "Menu links and the main button.",
  socials: "Footer social links and their icons.",
  modules: "Turn home page sections on or off.",
  ui: "Small labels like Back, Close, and cursor text.",
  hero: "Headline, intro, buttons, and stats.",
  marquee: "Brand logos on the moving band.",
  work: "Case studies shown on the home page and the cases page.",
  testimonials: "Client reviews.",
  videos: "YouTube videos.",
  contact: "Contact section text and form labels.",
};

export function sectionTitle(key: SectionKey) {
  const meta = sectionSchema(key).meta() as { title?: string } | undefined;
  return meta?.title ?? key;
}
