import type { SiteContent } from "@/lib/content";
import { CoverImage } from "@/components/media";

type Review = SiteContent["testimonials"]["items"][number];

export function ReviewCard({ review, className = "" }: { review: Review; className?: string }) {
  const initial = review.name.trim().charAt(0).toUpperCase();

  return (
    <article className={`flex h-full flex-col justify-between ${className}`}>
      <p className="font-serif text-[1.45rem] italic leading-[1.28] tracking-[-0.02em] text-ink sm:text-[1.7rem] lg:text-[1.55rem] xl:text-[1.75rem]">
        {review.quote}
      </p>
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
