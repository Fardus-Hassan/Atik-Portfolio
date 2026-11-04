import type { MetadataRoute } from "next";
import { pageCount, pageHref } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const url = siteUrl(content);
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/cases", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/clients", priority: 0.6 },
    { path: "/courses", priority: 0.5 },
  ];
  for (let page = 2; page <= pageCount(content.blog); page++) pages.push({ path: pageHref(page), priority: 0.4 });

  return [
    ...pages.map((page) => ({
      url: `${url}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...content.blog.posts.map((post) => ({
      url: `${url}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
