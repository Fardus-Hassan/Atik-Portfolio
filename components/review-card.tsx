import type { SiteContent } from "@/lib/content";
import { CoverImage } from "@/components/media";

type Review = SiteContent["testimonials"]["items"][number];

export function ReviewCard({ review, className = "" }: { review: Review; className?: string }) {
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <article className={`flex h-full flex-col justify-between ${className}`}>
      <div>
        <span aria-hidden className="block font-serif text-6xl leading-[0.6] text-ink/20">
          &ldquo;
        </span>
        <p className="mt-1 text-[1.08rem] leading-[1.65] text-ink/85 sm:text-[1.15rem] xl:text-[1.2rem]">
          {review.quote}
        </p>
      </div>
      <div className="mt-8 flex items-center gap-3.5 border-t border-ink/10 pt-5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
          {review.image ? (
            <CoverImage src={review.image} alt={review.imageAlt || review.name} sizes="48px" position="center 20%" />
          ) : (
            <span className="flex h-full w-full items-center justify-center rounded-full border border-ink/15 font-serif text-xl">
              {initial}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-medium leading-tight">{review.name}</p>
          <p className="mt-1 text-sm leading-snug text-ink/50">{review.role}</p>
        </div>
      </div>
    </article>
  );
}
