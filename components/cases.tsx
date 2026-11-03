import Link from "next/link";
import type { CaseStudy, SiteContent } from "@/lib/content";
import { CoverImage } from "@/components/media";
import { gutter, SectionLabel } from "@/components/ui";
export function CaseCard({
  item,
  wide = false,
  onOpen,
}: {
  item: CaseStudy;
  wide?: boolean;
  onOpen: (item: CaseStudy) => void;
}) {
  const result = item.story[item.story.length - 1]?.text;

  return (
    <button
      type="button"
      data-cursor="view"
      onClick={() => onOpen(item)}
      aria-label={`${item.client}: ${item.title}`}
      className="group relative flex h-full min-h-[26rem] w-full overflow-hidden rounded-[1.4rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime sm:min-h-[28rem] lg:min-h-[34rem]"
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
        <CoverImage
          src={item.image}
          alt={item.imageAlt}
          sizes={wide ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <div className="relative flex w-full flex-col justify-between p-5 text-white sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-white/75">
          <span>{item.client}</span>
          <span>{item.year}</span>
        </div>
        <div>
          <p className="font-serif text-[clamp(2.8rem,6vw,4.6rem)] leading-none tracking-[-0.04em]">{item.metric}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/70">{item.metricLabel}</p>
          <h3 className="mt-4 max-w-[18ch] font-serif text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.02] tracking-[-0.03em]">
            {item.title}
          </h3>
          {result ? <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">{result}</p> : null}
        </div>
      </div>
    </button>
  );
}

export function Cases({
  cases,
  items,
  onOpen,
}: {
  cases: SiteContent["cases"];
  items: CaseStudy[];
  onOpen: (item: CaseStudy) => void;
}) {
  return (
    <section id="cases" className="scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className={`${gutter} mb-8 flex flex-col gap-6 sm:mb-10 md:mb-14 md:flex-row md:items-end md:justify-between`}>
        <div className="max-w-md">
          <SectionLabel index={cases.index} label={cases.label} />
          <p className="mt-4 text-base leading-relaxed text-muted">{cases.intro}</p>
        </div>
        <Link
          href="/cases"          className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-paper/30 pb-0.5 text-sm tracking-wide"
        >
          {cases.seeAll}
          <span aria-hidden>→</span>
        </Link>
      </div>
      <ul className={`${gutter} grid gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-4`}>
        {items.map((item, index) => {
          const wide = index % 4 === 0 || index % 4 === 3;
          return (
            <li key={item.slug} className={wide ? "md:col-span-1 lg:col-span-7" : "md:col-span-1 lg:col-span-5"}>
              <CaseCard item={item} wide={wide} onOpen={onOpen} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
