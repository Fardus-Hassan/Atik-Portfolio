import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import { pageCount, postsForPage, topicCount } from "@/lib/blog";
import { BackButton } from "@/components/back-button";
import { BlogCard, BlogFeature } from "@/components/blog-card";
import { BlogPagination } from "@/components/blog-pagination";
import { Footer } from "@/components/footer";
import { SectionLabel } from "@/components/ui";

const pad = "px-4 sm:px-6 md:px-10 lg:px-14";
const count = (value: number) => String(value).padStart(2, "0");

export function BlogIndex({ content, page }: { content: SiteContent; page: number }) {
  const { blog, profile, ui } = content;
  const total = pageCount(blog);
  const posts = postsForPage(blog, page);
  const [lead, ...rest] = page === 1 ? posts : [undefined, ...posts];

  return (
    <main className="min-h-screen bg-ink text-paper">
      <header
        className={`${pad} page-fade sticky top-0 z-20 flex items-center justify-between border-b border-line bg-ink/90 py-4 backdrop-blur-md`}
      >
        <Link href="/" className="min-h-11 text-sm font-medium tracking-tight">
          {profile.name}
        </Link>
        <BackButton label={ui.back} />
      </header>

      <div className={`${pad} pb-16 pt-14 sm:pt-20`}>
        <div className="page-rise grid gap-8 border-b border-line pb-12 sm:pb-16 lg:grid-cols-12 lg:items-end" style={{ animationDelay: "60ms" }}>
          <div className="lg:col-span-7">
            <SectionLabel index={blog.index} label={blog.label} />
            <h1 className="mt-6 font-serif text-[clamp(3.6rem,13vw,10rem)] leading-[0.85] tracking-[-0.05em]">
              {blog.pageTitle}
              <span className="text-lime">.</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-paper/70">{blog.pageIntro}</p>
            <dl className="mt-8 flex gap-10">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">{blog.articlesLabel}</dt>
                <dd className="mt-1 font-serif text-4xl tabular-nums">{count(blog.posts.length)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">{blog.topicsLabel}</dt>
                <dd className="mt-1 font-serif text-4xl tabular-nums">{count(topicCount(blog))}</dd>
              </div>
              {total > 1 ? (
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-muted">{blog.pageLabel}</dt>
                  <dd className="mt-1 font-serif text-4xl tabular-nums">
                    {count(page)}
                    <span className="text-paper/35">/{count(total)}</span>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        {lead ? (
          <div className="page-rise mt-12 sm:mt-16" style={{ animationDelay: "140ms" }}>
            <BlogFeature post={lead} readLabel={blog.readLabel} featuredLabel={blog.featuredLabel} priority />
          </div>
        ) : null}

        {rest.length ? (
          <ul className="mt-14 grid gap-x-6 gap-y-14 sm:mt-20 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            {rest.map((post, index) =>
              post ? (
                <li key={post.slug} className="page-rise" style={{ animationDelay: `${200 + index * 70}ms` }}>
                  <BlogCard post={post} readLabel={blog.readLabel} />
                </li>
              ) : null,
            )}
          </ul>
        ) : null}

        <BlogPagination current={page} total={total} newerLabel={blog.newerLabel} olderLabel={blog.olderLabel} />
      </div>

      <Footer content={content} />
    </main>
  );
}
