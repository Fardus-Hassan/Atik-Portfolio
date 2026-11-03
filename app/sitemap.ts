import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const url = siteUrl(content);
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/cases", priority: 0.8 },
    { path: "/clients", priority: 0.6 },
    { path: "/courses", priority: 0.5 },
  ];

  return pages.map((page) => ({
    url: `${url}${page.path}`,
    changeFrequency: "monthly",
    priority: page.priority,
  }));
}
