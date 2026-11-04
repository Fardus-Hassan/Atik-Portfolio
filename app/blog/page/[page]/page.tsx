import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogIndex } from "@/components/blog-index";
import { pageCount } from "@/lib/blog";
import { getSiteContent } from "@/lib/site";

/** Out-of-range pages must answer with a real 404 or redirect, so the page may block instead of streaming a fallback. */
export const instant = false;

export async function generateStaticParams() {
  const total = pageCount((await getSiteContent()).blog);
  const pages = Array.from({ length: total - 1 }, (_, index) => ({ page: String(index + 2) }));
  return pages.length ? pages : [{ page: "2" }];
}

function parsePage(value: string) {
  return /^\d+$/.test(value) ? Number(value) : NaN;
}

export async function generateMetadata({ params }: PageProps<"/blog/page/[page]">): Promise<Metadata> {
  const page = parsePage((await params).page);
  const { title, description } = (await getSiteContent()).seo.pages.blog;
  const pageTitle = `${title} · Page ${page}`;
  const path = `/blog/page/${page}`;
  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    openGraph: { title: pageTitle, description, url: path },
    twitter: { title: pageTitle, description },
  };
}

export default async function BlogListPage({ params }: PageProps<"/blog/page/[page]">) {
  const page = parsePage((await params).page);
  const content = await getSiteContent();
  if (page === 1) permanentRedirect("/blog");
  if (!Number.isInteger(page) || page < 1 || page > pageCount(content.blog)) notFound();
  return <BlogIndex content={content} page={page} />;
}
