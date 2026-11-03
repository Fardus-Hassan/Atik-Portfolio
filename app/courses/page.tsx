import type { Metadata } from "next";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

const pad = "px-4 sm:px-6 md:px-10 lg:px-14";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getSiteContent(), "courses", "/courses");
}

export default async function CoursesPage() {
  const content = await getSiteContent();
  const { courses, profile } = content;
  const ring = `${courses.label} ${courses.status} · `.repeat(2);

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper">
      <header
        className={`${pad} page-fade sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/90 py-4 backdrop-blur-md`}
      >
        <Link href="/" className="min-h-11 text-sm font-medium tracking-tight">
          {profile.name}
        </Link>
        <BackButton label={content.ui.back} />
      </header>

      <div className={`${pad} relative grid flex-1 items-center gap-14 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-7">
          <p className="page-rise flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" />
            {courses.label}
          </p>
          <h1
            className="page-rise mt-6 font-serif text-[clamp(4.2rem,16vw,11rem)] italic leading-[0.85] tracking-[-0.05em] text-lime"
            style={{ animationDelay: "80ms" }}
          >
            {courses.status}
          </h1>
          <p
            className="page-rise mt-6 max-w-[16ch] text-[clamp(1.8rem,4.4vw,3rem)] leading-[1.05] tracking-[-0.03em]"
            style={{ animationDelay: "160ms" }}
          >
            {courses.title}
          </p>
          <p
            className="page-rise mt-6 max-w-lg text-lg leading-relaxed text-paper/70"
            style={{ animationDelay: "220ms" }}
          >
            {courses.intro}
          </p>
          <div className="page-rise mt-10" style={{ animationDelay: "280ms" }}>
            <a
              href={courses.ctaHref}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper"
            >
              {courses.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div
            className="page-rise pointer-events-none absolute -right-10 -top-16 hidden h-44 w-44 sm:block lg:-top-24"
            style={{ animationDelay: "200ms" }}
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className="soon-spin h-full w-full text-paper/50">
              <defs>
                <path id="soon-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text fontSize="14" letterSpacing="4.5" fill="currentColor" className="uppercase">
                <textPath href="#soon-ring">{ring}</textPath>
              </text>
            </svg>
          </div>

          <ul className="relative border-t border-line">
            {courses.topics.map((topic, index) => (
              <li
                key={topic}
                className="page-rise flex items-center justify-between gap-6 border-b border-line py-5 sm:py-6"
                style={{ animationDelay: `${320 + index * 80}ms` }}
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-lime">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-[clamp(1.5rem,3vw,2.1rem)] leading-tight tracking-[-0.02em]">
                    {topic}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-paper/20 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-paper/60">
                  {courses.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
