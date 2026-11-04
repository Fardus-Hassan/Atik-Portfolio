import Link from "next/link";
import type { SiteContent } from "@/lib/content";
import { formatDate, orderedPosts } from "@/lib/blog";
import { BlogRow } from "@/components/blog-card";
import { BlogCover } from "@/components/blog-cover";
import { Arrow, SectionLabel } from "@/components/ui";
import { gutter } from "@/lib/layout";

export function Blog({ blog }: { blog: SiteContent["blog"] }) {
  const [lead, ...rest] = orderedPosts(blog);
  if (!lead) return null;

  return (
    <section id="blog" className="scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className={`${gutter} mb-8 flex flex-col gap-6 sm:mb-10 md:mb-14 md:flex-row md:items-end md:justify-between`}>
        <div className="max-w-xl">
          <SectionLabel index={blog.index} label={blog.label} />
          <h2 className="mt-5 font-serif text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[0.95] tracking-[-0.035em]">{blog.title}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{blog.intro}</p>
        </div>
        <Link
          href="/blog"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-paper/30 pb-0.5 text-sm tracking-wide"
        >
          {blog.seeAll}
          <Arrow />
        </Link>
      </div>

      <div className={`${gutter} grid gap-8 lg:grid-cols-12 lg:gap-12`}>
        <Link
          href={`/blog/${lead.slug}`}
          data-cursor="read"
          className="group relative flex min-h-[26rem] overflow-hidden rounded-[1.4rem] sm:min-h-[30rem] lg:col-span-7 lg:min-h-[36rem]"
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
            <BlogCover post={lead} sizes="(min-width: 1024px) 58vw, 100vw" size="lg" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
          <div className="relative mt-auto flex w-full flex-col p-5 text-white sm:p-7 lg:p-9">
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-white/75">
              <span className="rounded-full bg-lime px-3 py-1 text-ink">{lead.category}</span>
              <time dateTime={lead.date}>{formatDate(lead.date)}</time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
              <span>{lead.readTime}</span>
            </p>
            <h3 className="mt-5 max-w-[20ch] font-serif text-[clamp(2rem,4vw,3.3rem)] leading-[0.98] tracking-[-0.035em]">
              {lead.title}
            </h3>
            <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{lead.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime">
              {blog.readLabel}
              <Arrow />
            </span>
          </div>
        </Link>

        <div className="flex flex-col lg:col-span-5">
          {rest.slice(0, 3).map((post, index) => (
            <BlogRow key={post.slug} post={post} index={index + 2} />
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  );
}
