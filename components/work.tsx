"use client";

import { useRef } from "react";
import type { CaseStudy, SiteContent } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { CoverImage } from "@/components/media";
import { gutter, SectionLabel } from "@/components/ui";

export function Work({
  work,
  onOpen,
}: {
  work: SiteContent["work"];
  onOpen: (item: CaseStudy) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        root.current?.querySelectorAll<HTMLElement>("[data-work-photo]").forEach((photo) => {
          gsap.from(photo, {
            scale: 1.14,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: photo, start: "top 90%", once: true },
          });
        });
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const trackEl = track.current;
        if (!trackEl) return;
        gsap.to(trackEl, {
          x: () => -(trackEl.scrollWidth - document.documentElement.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 0.7,
            start: "top top",
            anticipatePin: 1,
            invalidateOnRefresh: true,
            end: () =>
              "+=" + Math.max(0, trackEl.scrollWidth - document.documentElement.clientWidth),
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="scroll-mt-24 lg:flex lg:h-[100svh] lg:flex-col">
      <div className={`${gutter} pb-5 pt-20 sm:pb-6 sm:pt-24 md:pt-28`}>
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <SectionLabel index={work.index} label={work.label} />
            <p className="mt-4 max-w-md text-muted">{work.intro}</p>
          </div>
          <p className="hidden shrink-0 text-[11px] uppercase tracking-[0.2em] text-muted lg:block">{work.scrollHint}</p>
        </div>
        <div className="mt-6 hidden h-px bg-line lg:block">
          <div ref={progress} className="h-px origin-left scale-x-0 bg-lime" />
        </div>
      </div>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-hidden">
        <div
          ref={track}
          className={`flex flex-col gap-4 pb-12 sm:pb-16 lg:h-full lg:flex-row lg:items-stretch lg:gap-5 lg:pb-10 ${gutter}`}
        >
          {work.items.map((item, index) => (
            <article
              key={item.slug}
              data-cursor="view"
              role="button"
              tabIndex={0}
              onClick={() => onOpen(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpen(item);
                }
              }}
              className="flex w-full shrink-0 flex-col overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem] lg:h-full lg:min-h-0 lg:w-[78vw] lg:flex-row"
              style={{ background: item.background, color: item.foreground }}
              aria-label={`${item.client}: ${item.title}`}
            >
              <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden lg:aspect-auto lg:h-full lg:w-[46%]">
                <div data-work-photo className="absolute inset-0">
                  <CoverImage
                    src={item.image}
                    alt={item.imageAlt}
                    sizes="(min-width: 1024px) 36vw, 100vw"
                    position="center"
                  />
                </div>
                <div className="absolute left-3 top-3 flex gap-2 text-[11px] uppercase tracking-[0.16em] text-white sm:left-4 sm:top-4">
                  <span className="rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-black/50 px-3 py-1 backdrop-blur-sm">{item.year}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:gap-8 sm:p-8 lg:p-10">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">{item.client}</p>
                  <h3 className="mt-3 font-serif text-[clamp(1.85rem,6vw,3.4rem)] leading-[0.95] tracking-tight lg:text-5xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed opacity-80">{item.summary}</p>
                  <p className="mt-5 text-sm opacity-70">{item.services.join("  ·  ")}</p>
                </div>
                <div>
                  <p className="font-serif text-[clamp(2.75rem,10vw,4.5rem)] leading-none tracking-tight lg:text-7xl">
                    {item.metric}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] opacity-70">{item.metricLabel}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
