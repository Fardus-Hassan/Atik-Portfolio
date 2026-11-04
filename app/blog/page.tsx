import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog-index";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getSiteContent(), "blog", "/blog");
}

export default async function BlogPage() {
  return <BlogIndex content={await getSiteContent()} page={1} />;
}
