import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatDate } from "@/lib/blog";
import { BlogCover } from "@/components/blog-cover";
import { Arrow } from "@/components/ui";

type Tone = "dark" | "light";

function Meta({ post, tone }: { post: BlogPost; tone: Tone }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.18em] ${tone === "light" ? "text-ink/55" : "text-muted"}`}>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden className={`h-1 w-1 rounded-full ${tone === "light" ? "bg-ink/30" : "bg-paper/30"}`} />
      <span>{post.readTime}</span>
    </p>
  );
}

function Category({ post }: { post: BlogPost }) {
  return (
    <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-paper backdrop-blur-md sm:left-5 sm:top-5">
      {post.category}
    </span>
  );
}

export function BlogCard({ post, readLabel, tone = "dark" }: { post: BlogPost; readLabel: string; tone?: Tone }) {
  const light = tone === "light";
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="read"
      className="group flex h-full flex-col focus-visible:outline-offset-8"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-white/[0.04]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.05]">
          <BlogCover post={post} sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" />
        </div>
        <Category post={post} />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <Meta post={post} tone={tone} />
        <h3 className="mt-3 font-serif text-[clamp(1.55rem,2.4vw,1.95rem)] leading-[1.06] tracking-[-0.025em]">
          <span
            className={`bg-gradient-to-r bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] ${
              light ? "from-ink to-ink" : "from-paper to-paper"
            }`}
          >
            {post.title}
          </span>
        </h3>
        <p className={`mt-3 line-clamp-2 text-[15px] leading-relaxed ${light ? "text-ink/60" : "text-muted"}`}>{post.excerpt}</p>
        <span
          className={`mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium ${light ? "text-ink" : "text-lime"}`}
        >
          {readLabel}
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

export function BlogFeature({
  post,
  readLabel,
  featuredLabel,
  priority = false,
}: {
  post: BlogPost;
  readLabel: string;
  featuredLabel: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="read"
      className="group grid overflow-hidden rounded-[1.6rem] border border-line bg-white/[0.02] transition-colors duration-500 hover:border-paper/25 lg:grid-cols-12"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[30rem]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
          <BlogCover post={post} sizes="(min-width: 1024px) 58vw, 100vw" priority={priority} size="lg" />
        </div>
        <Category post={post} />
      </div>
      <div className="flex flex-col justify-between gap-10 p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <div>
          <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] text-lime">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" />
            {featuredLabel}
          </p>
          <h2 className="mt-5 font-serif text-[clamp(2.1rem,4vw,3.4rem)] leading-[0.98] tracking-[-0.035em]">{post.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-paper/70 sm:text-lg">{post.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5 border-t border-line pt-6">
          <Meta post={post} tone="dark" />
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-medium text-ink transition-colors duration-300 group-hover:bg-paper">
            {readLabel}
            <Arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogRow({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="read"
      className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 border-t border-line py-6 sm:gap-6 sm:py-7"
    >
      <span className="pt-1 text-sm tabular-nums text-lime">{String(index).padStart(2, "0")}</span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="text-paper/80">{post.category}</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-paper/30" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
        <span className="mt-2.5 block font-serif text-[clamp(1.45rem,2.3vw,1.85rem)] leading-[1.08] tracking-[-0.02em] transition-colors duration-300 group-hover:text-lime">
          {post.title}
        </span>
        <span className="mt-2 block text-sm text-muted">{post.readTime}</span>
      </span>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper/20 transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
        <Arrow />
      </span>
    </Link>
  );
}
