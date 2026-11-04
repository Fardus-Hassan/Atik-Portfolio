import type { BlogPost, SiteContent } from "@/shared/content-schema";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : dateFormat.format(parsed);
}

/** Newest featured post first, then everything else from newest to oldest. */
export function orderedPosts(blog: SiteContent["blog"]): BlogPost[] {
  const byDate = [...blog.posts].sort((a, b) => b.date.localeCompare(a.date));
  const lead = byDate.find((post) => post.featured) ?? byDate[0];
  return lead ? [lead, ...byDate.filter((post) => post !== lead)] : [];
}

export function pageCount(blog: SiteContent["blog"]) {
  return Math.max(1, Math.ceil(blog.posts.length / blog.perPage));
}

export function postsForPage(blog: SiteContent["blog"], page: number) {
  const start = (page - 1) * blog.perPage;
  return orderedPosts(blog).slice(start, start + blog.perPage);
}

export function pageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

export function findPost(blog: SiteContent["blog"], slug: string) {
  return blog.posts.find((post) => post.slug === slug);
}

export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Only web, mail, phone, and on-site links are rendered, so a saved `javascript:` URL can never run. */
export function safeHref(href: string) {
  const value = href.trim();
  if (/^(https?:|mailto:|tel:)/i.test(value) || /^[/#]/.test(value)) return value;
  if (/^www\./i.test(value)) return `https://${value}`;
  return null;
}

export function isExternal(href: string) {
  return /^https?:/i.test(href);
}

export function topicCount(blog: SiteContent["blog"]) {
  return new Set(blog.posts.map((post) => post.category.trim().toLowerCase())).size;
}
