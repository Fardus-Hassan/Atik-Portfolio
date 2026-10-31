import type { Metadata } from "next";
import { BackButton } from "@/components/back-button";
import { ReviewCard } from "@/components/review-card";
import { SectionLabel } from "@/components/ui";
import { getSiteContent } from "@/lib/content";

const pad = "px-4 sm:px-6 md:px-10 lg:px-14";

const content = getSiteContent();

export const metadata: Metadata = {
  title: `${content.testimonials.label} · ${content.profile.name}`,
  description: content.testimonials.pageIntro,
};

export default function ClientsPage() {
  const { testimonials, profile } = content;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className={`${pad} page-fade sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-paper/90 py-4 backdrop-blur-md`}>
        <a href="/" className="min-h-11 text-sm font-medium tracking-tight">
          {profile.name}
        </a>
        <BackButton label={content.ui.back} />
      </header>

      <div className={`${pad} py-14 sm:py-20`}>
        <div className="page-rise" style={{ animationDelay: "60ms" }}>
          <SectionLabel index={testimonials.index} label={testimonials.label} tone="light" />
          <h1 className="mt-6 max-w-[14ch] font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[-0.04em]">
            {testimonials.label}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/60">{testimonials.pageIntro}</p>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-14">
          {testimonials.items.map((review, index) => (
            <li key={review.name} className="page-rise" style={{ animationDelay: `${160 + index * 60}ms` }}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
