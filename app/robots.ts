import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const content = await getSiteContent();
  const url = siteUrl(content);

  if (!content.seo.indexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
