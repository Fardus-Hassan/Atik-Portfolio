import Link from "next/link";
import type { BlogPost, SiteContent } from "@/lib/content";
import { formatDate, paragraphs, safeHref } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { BlogCover } from "@/components/blog-cover";
import { Footer } from "@/components/footer";
import { CoverImage } from "@/components/media";
import { ReadingProgress } from "@/components/reading-progress";
import { RichText, TextLink } from "@/components/rich-text";
import { SocialIcon } from "@/components/social-icon";
import { Arrow } from "@/components/ui";

const pad = "px-4 sm:px-6 md:px-10 lg:px-14";

function Neighbor({ post, label, align }: { post: BlogPost; label: string; align: "start" | "end" }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-3 rounded-[1.4rem] border border-ink/10 p-6 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper sm:p-8 ${
        align === "end" ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink/50 group-hover:text-paper/60">
        {align === "start" ? <span aria-hidden>←</span> : null}
        {label}
        {align === "end" ? <span aria-hidden>→</span> : null}
      </span>
      <span className="font-serif text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.08] tracking-[-0.02em]">{post.title}</span>
    </Link>
  );
}

type SectionImage = NonNullable<BlogPost["body"][number]["images"]>[number];

function SectionImages({ images }: { images: SectionImage[] }) {
  const shown = images.filter((item) => item.src);
  if (!shown.length) return null;
  const single = shown.length === 1;

  return (
    <div className={`my-10 grid gap-4 sm:my-12 ${single ? "" : "sm:grid-cols-2"}`}>
      {shown.map((item, index) => {
        const wide = single || (shown.length % 2 === 1 && index === 0);
        const href = item.link ? safeHref(item.link) : null;
        const frame = `relative block overflow-hidden rounded-[1.2rem] bg-ink/5 ${wide ? "aspect-[16/10]" : "aspect-[4/3]"}`;
        const picture = (
          <CoverImage
            src={item.src}
            alt={item.alt}
            sizes={wide ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
          />
        );
        return (
          <figure key={`${item.src}-${index}`} className={wide ? "sm:col-span-2" : ""}>
            {href ? (
              <TextLink href={href} className={`group ${frame}`}>
                <span className="block h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">{picture}</span>
                <span
                  aria-hidden
                  className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-paper/90 text-ink shadow-sm transition-colors duration-300 group-hover:bg-lime"
                >
                  <Arrow />
                </span>
              </TextLink>
            ) : (
              <div className={frame}>{picture}</div>
            )}
            {item.caption ? (
              <figcaption className="mt-3 flex gap-2.5 text-sm leading-relaxed text-ink/55">
                <span aria-hidden className="mt-[0.55em] h-px w-5 shrink-0 bg-ink/30" />
                <span>
                  <RichText text={item.caption} />
                </span>
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}

export function BlogArticle({
  content,
  post,
  newer,
  older,
  more,
  url,
}: {
  content: SiteContent;
  post: BlogPost;
  newer?: BlogPost;
  older?: BlogPost;
  more: BlogPost[];
  url: string;
}) {
  const { blog, profile, about } = content;
  const portrait = about.portrait.image;
  const share = [
    { platform: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
    { platform: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { platform: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <ReadingProgress target="article" className="bg-ink" />
      <header
        className={`${pad} page-fade sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-paper/90 py-4 backdrop-blur-md`}
      >
        <Link href="/" className="min-h-11 text-sm font-medium tracking-tight">
          {profile.name}
        </Link>
        <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm tracking-wide">
          <span aria-hidden>←</span>
          {blog.seeAll}
        </Link>
      </header>

      <article id="article">
        <div className={`${pad} pt-12 sm:pt-20`}>
          <div className="mx-auto max-w-5xl">
            <p className="page-rise flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-ink/55">
              <span className="rounded-full bg-ink px-3 py-1.5 text-paper">{post.category}</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden className="h-1 w-1 rounded-full bg-ink/30" />
              <span>{post.readTime}</span>
            </p>
            <h1
              className="page-rise mt-7 max-w-[18ch] font-serif text-[clamp(2.8rem,7.2vw,6.4rem)] leading-[0.93] tracking-[-0.045em]"
              style={{ animationDelay: "60ms" }}
            >
              {post.title}
            </h1>
            <p
              className="page-rise mt-7 max-w-2xl text-lg leading-relaxed text-ink/65 sm:text-xl"
              style={{ animationDelay: "120ms" }}
            >
              {post.excerpt}
            </p>
            <div className="page-rise mt-9 flex items-center gap-3.5" style={{ animationDelay: "160ms" }}>
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink">
                {portrait ? (
                  <CoverImage src={portrait} alt={about.portrait.alt} sizes="48px" position={about.portrait.position ?? "center 20%"} />
                ) : (
                  <span className="grid h-full w-full place-items-center font-serif text-xl text-paper">{profile.name.charAt(0)}</span>
                )}
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-ink/50">{blog.writtenBy}</span>
                <span className="mt-0.5 block text-[15px] font-medium">
                  {profile.name} <span className="font-normal text-ink/55">· {profile.role}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className={`${pad} page-rise mt-12 sm:mt-16`} style={{ animationDelay: "220ms" }}>
          <div className="relative mx-auto aspect-[4/3] max-w-[88rem] overflow-hidden rounded-[1.6rem] sm:aspect-[16/8]">
            <BlogCover post={post} sizes="(min-width: 1400px) 1400px, 100vw" priority size="lg" />
          </div>
        </div>

        <div className={`${pad} mx-auto mt-14 grid max-w-5xl gap-12 sm:mt-20 lg:grid-cols-[1fr_11rem] lg:gap-16`}>
          <div className="min-w-0">
            {post.body.map((section, index) => (
              <section key={index} className={index ? "mt-12 sm:mt-14" : ""}>
                {section.heading ? (
                  <h2 className="mb-5 font-serif text-[clamp(1.8rem,3.2vw,2.5rem)] leading-[1.05] tracking-[-0.025em]">
                    {section.heading}
                  </h2>
                ) : null}
                {paragraphs(section.text).map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className={`text-[1.12rem] leading-[1.8] text-ink/80 sm:text-[1.2rem] ${paragraphIndex ? "mt-6" : ""} ${
                      index === 0 && paragraphIndex === 0
                        ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-serif first-letter:text-[4.4rem] first-letter:leading-[0.78] first-letter:text-ink"
                        : ""
                    }`}
                  >
                    <RichText text={paragraph} />
                  </p>
                ))}
                {section.images?.length ? <SectionImages images={section.images} /> : null}
                {section.quote ? (
                  <blockquote className="my-12 border-l-[3px] border-lime pl-6 sm:pl-8">
                    <p className="font-serif text-[clamp(1.7rem,3.4vw,2.6rem)] italic leading-[1.12] tracking-[-0.02em]">
                      &ldquo;<RichText text={section.quote} />&rdquo;
                    </p>
                  </blockquote>
                ) : null}
              </section>
            ))}

            {post.tags.length ? (
              <ul className="mt-14 flex flex-wrap gap-2 border-t border-ink/10 pt-8">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm text-ink/70">
                    #{tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink/50">{blog.shareLabel}</p>
            <ul className="mt-4 flex gap-2 lg:flex-col lg:items-start">
              {share.map((item) => (
                <li key={item.platform}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${blog.shareLabel}: ${item.label}`}
                    className="inline-flex h-11 items-center gap-3 rounded-full border border-ink/15 px-4 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    <SocialIcon platform={item.platform} size={15} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>

      {newer || older ? (
        <nav aria-label="More articles" className={`${pad} mx-auto mt-20 grid max-w-5xl gap-3 sm:mt-24 sm:grid-cols-2`}>
          {newer ? <Neighbor post={newer} label={blog.newerLabel} align="start" /> : <span className="hidden sm:block" />}
          {older ? <Neighbor post={older} label={blog.olderLabel} align="end" /> : null}
        </nav>
      ) : null}

      {more.length ? (
        <section className={`${pad} mt-24 border-t border-ink/10 pb-24 pt-14 sm:mt-28 sm:pt-16`}>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-none tracking-[-0.035em]">{blog.moreTitle}</h2>
            <Link href="/blog" className="group inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-ink/30 pb-0.5 text-sm tracking-wide">
              {blog.seeAll}
              <Arrow />
            </Link>
          </div>
          <ul className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            {more.map((item) => (
              <li key={item.slug}>
                <BlogCard post={item} readLabel={blog.readLabel} tone="light" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="bg-ink text-paper">
        <section className={`${pad} py-20 sm:py-28`}>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[16ch] font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] tracking-[-0.04em]">{blog.ctaTitle}</h2>
            <Link
              href="/#contact"
              className="group inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-lime px-6 text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper md:self-auto"
            >
              {blog.ctaButton}
              <Arrow />
            </Link>
          </div>
        </section>
        <Footer content={content} />
      </div>
    </main>
  );
}
