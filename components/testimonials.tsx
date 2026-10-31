"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { ReviewCard } from "@/components/review-card";
import { gutter, SectionLabel } from "@/components/ui";

const INTERVAL = 5000;

export function Testimonials({
  testimonials,
}: {
  testimonials: SiteContent["testimonials"];
}) {
  const items = testimonials.items;
  const total = items.length;
  const hold = useRef({ hover: false, hidden: false });
  const [wide, setWide] = useState(false);
  const [motion, setMotion] = useState(true);
  const [paused, setPaused] = useState(false);
  const [start, setStart] = useState(0);
  const count = wide ? 3 : 1;
  const canRotate = motion && total > count;

  const setHold = (key: "hover" | "hidden", value: boolean) => {
    hold.current[key] = value;
    setPaused(hold.current.hover || hold.current.hidden);
  };

  useLayoutEffect(() => {
    const wideQuery = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setWide(wideQuery.matches);
      setMotion(!motionQuery.matches);
    };
    sync();
    wideQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    const onHide = () => setHold("hidden", document.hidden);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      wideQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  useEffect(() => {
    setStart(0);
  }, [count]);

  useEffect(() => {
    if (!canRotate || paused) return;
    const id = window.setInterval(() => {
      setStart((value) => (value + count) % total);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [canRotate, paused, count, total]);

  const shown = Array.from({ length: Math.min(count, total) }, (_, index) => items[(start + index) % total]).filter(
    (item): item is (typeof items)[number] => Boolean(item),
  );

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-paper py-16 text-ink sm:py-24 md:py-32"
      onMouseEnter={() => setHold("hover", true)}
      onMouseLeave={() => setHold("hover", false)}
    >
      <div className={gutter}>
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-lg">
            <SectionLabel index={testimonials.index} label={testimonials.label} tone="light" />
            <p className="mt-5 font-serif text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.15] tracking-[-0.03em]">
              {testimonials.intro}
            </p>
          </div>
          <Link
            href="/clients"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-ink/25 pb-0.5 text-sm tracking-wide"
          >
            {testimonials.seeAll}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-4">
          {canRotate ? (
            <div className="h-px w-16 overflow-hidden bg-ink/10" aria-hidden>
              <div
                key={`${start}-${paused ? "hold" : "run"}`}
                className="review-progress h-px bg-ink/80"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              />
            </div>
          ) : null}
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink/40">
            {String(Math.floor(start / count) + 1).padStart(2, "0")}
            <span className="px-2 text-ink/25">/</span>
            {String(Math.ceil(total / count)).padStart(2, "0")}
          </p>
        </div>

        <div key={start} className="quote-set mt-12 grid gap-12 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-ink/10">
          {shown.map((review) => (
            <ReviewCard
              key={`${review.name}-${start}`}
              review={review}
              className="lg:px-8 xl:px-10 first:lg:pl-0 last:lg:pr-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
