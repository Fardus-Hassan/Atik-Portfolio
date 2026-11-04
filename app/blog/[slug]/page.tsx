import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog-article";
import { findPost, orderedPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

/** Unknown slugs must answer with a real 404, so the page may block instead of streaming a fallback. */
export const instant = false;

export async function generateStaticParams() {
  const { posts } = (await getSiteContent()).blog;
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const post = findPost(content.blog, slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  const image = post.cover || content.seo.ogImage;
  const images = image ? [{ url: image, alt: post.coverAlt || post.title }] : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: path,
      publishedTime: post.date,
      authors: [content.profile.name],
      tags: post.tags,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title: post.title, description: post.excerpt, images: images?.map((item) => item.url) },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const content = await getSiteContent();
  const post = findPost(content.blog, slug);
  if (!post) notFound();

  const byDate = [...content.blog.posts].sort((a, b) => b.date.localeCompare(a.date));
  const position = byDate.indexOf(post);
  const newer = byDate[position - 1];
  const older = byDate[position + 1];
  const sameTopic = (item: typeof post) => item.category === post.category;
  const more = orderedPosts(content.blog)
    .filter((item) => item !== post)
    .sort((a, b) => Number(sameTopic(b)) - Number(sameTopic(a)))
    .slice(0, 3);

  const base = siteUrl(content);
  const url = `${base}/blog/${post.slug}`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.cover ? new URL(post.cover, base).toString() : undefined,
    keywords: post.tags.join(", "),
    articleSection: post.category,
    mainEntityOfPage: url,
    author: { "@type": "Person", "@id": `${base}/#person`, name: content.profile.name },
    publisher: { "@id": `${base}/#person` },
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <BlogArticle content={content} post={post} newer={newer} older={older} more={more} url={url} />
    </>
  );
}
