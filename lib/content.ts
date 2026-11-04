/**
 * Public content types. The data itself is managed from the dashboard (/admin)
 * and stored in Postgres through the Express API. shared/default-content.ts is the
 * seed and the fallback when the API is unreachable.
 * Image paths are either files in public/ or uploads served at /uploads.
 */

export type {
  BlogPost,
  BrandLogo,
  CaseStudy,
  Icon,
  ModuleId,
  NavLink,
  ServiceItem,
  SiteContent,
  SiteModule,
  SocialLink,
  Stat,
  VideoItem,
} from "@/shared/content-schema";

import type { ModuleId, SiteContent } from "@/shared/content-schema";

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

export function moduleEnabled(site: SiteContent, id: ModuleId) {
  return site.modules.some((module) => module.id === id && module.enabled);
}
