"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import type { SiteContent } from "@/lib/content";
import { ReviewCard } from "@/components/review-card";
import { ChevronIcon, gutter, SectionLabel } from "@/components/ui";
import { gsap } from "@/lib/gsap";
const INTERVAL = 5000;
const SWIPE = 60;

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
  }, [canRotate, paused, count, total, start]);

  const pages = Math.ceil(total / count);
  const canPage = pages > 1;
  const step = (delta: number) => {
    const page = Math.floor(start / count);
    setStart((((page + delta) % pages) + pages) % pages * count);
  };

  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; dx: number; active: boolean } | null>(null);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canPage || event.button !== 0) return;
    if (event.pointerType === "mouse") event.preventDefault();
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, active: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const el = track.current;
    if (!state || state.id !== event.pointerId || !el) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    if (!state.active) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      state.active = true;
      el.setPointerCapture(event.pointerId);
    }
    state.dx = dx;
    gsap.set(el, { x: dx * 0.6, opacity: 1 - Math.min(Math.abs(dx) / 600, 0.4) });
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const el = track.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null;
    if (!el || !state.active) return;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    if (event.type !== "pointercancel" && Math.abs(state.dx) > SWIPE) {
      step(state.dx < 0 ? 1 : -1);
      return;
    }
    gsap.to(el, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
  };

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
            href="/clients"            className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-ink/25 pb-0.5 text-sm tracking-wide"
          >
            {testimonials.seeAll}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-4">
          {canRotate && canPage ? (
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
            {String(pages).padStart(2, "0")}
          </p>
          {canPage ? (
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Previous reviews"
                onClick={() => step(-1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <ChevronIcon />
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                onClick={() => step(1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <ChevronIcon flip />
              </button>
            </div>
          ) : null}
        </div>

        <div
          data-cursor={canPage ? "drag" : undefined}
          className={`mt-12 ${canPage ? "touch-pan-y" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          <div
            key={start}
            ref={track}
            className="quote-set grid gap-12 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-ink/10"
          >
            {shown.map((review) => (
              <ReviewCard
                key={`${review.name}-${start}`}
                review={review}
                className="lg:px-8 xl:px-10 first:lg:pl-0 last:lg:pr-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
