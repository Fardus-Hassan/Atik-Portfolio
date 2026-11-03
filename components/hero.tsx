"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";import { CoverImage } from "@/components/media";
import { Arrow, buttonClass, CountUp, gutter, Magnetic } from "@/components/ui";

export function Hero({
  content,
  booted,
}: {
  content: SiteContent;
  booted: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const { hero, profile, about } = content;
  const portrait = about.portrait;
  const hasPhoto = Boolean(portrait.image);

  // Plain effects instead of useGSAP: its revert restores the hidden pre-intro state when the route
  // is hidden and shown again on back navigation. Both effects re-run on that reveal, so the intro replays.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = el.querySelectorAll("[data-hero-line]");
    const fades = el.querySelectorAll("[data-hero-fade]");
    const photoInner = el.querySelector("[data-portrait-inner]");
    gsap.set(lines, { yPercent: 110 });
    gsap.set(fades, { autoAlpha: 0, y: 18 });
    if (photoInner) gsap.set(photoInner, { scale: 1.12 });
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !booted) return;
    const lines = el.querySelectorAll("[data-hero-line]");
    const fades = el.querySelectorAll("[data-hero-fade]");
    const photoInner = el.querySelector("[data-portrait-inner]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(lines, { yPercent: 0 });
      gsap.set(fades, { autoAlpha: 1, y: 0 });
      if (photoInner) gsap.set(photoInner, { scale: 1 });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
    timeline.to(lines, { yPercent: 0, duration: 1.15, stagger: 0.08 });
    if (photoInner) timeline.to(photoInner, { scale: 1, duration: 1.8, ease: "power2.out" }, 0);
    timeline.to(fades, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.15);
    return () => {
      timeline.progress(1).kill();
    };
  }, [booted]);

  return (
    <section
      id="content"
      ref={root}
      className="relative min-h-[100svh]"
    >
      {hasPhoto && portrait.image ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[92svh] overflow-hidden lg:inset-y-0 lg:left-auto lg:h-auto lg:w-[54%]">
          <div data-portrait-inner className="absolute inset-[-8%] lg:inset-[-4%]">
            <CoverImage
              src={portrait.image}
              alt={portrait.alt}
              sizes="(min-width: 1024px) 54vw, 100vw"
              position={portrait.position}
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink from-[8%] via-ink/75 via-[38%] to-transparent to-[68%] lg:bg-gradient-to-r lg:from-ink lg:from-[0%] lg:via-ink/80 lg:via-[22%] lg:to-transparent lg:to-[58%]" />
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink via-ink/55 to-transparent lg:hidden" />
        </div>
      ) : null}

      <div className={`relative z-10 flex min-h-[100svh] flex-col pb-6 pt-24 sm:pt-28 lg:w-[52%] lg:pt-32 ${gutter}`}>
        <div
          data-hero-fade
          className="hidden items-start justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-muted lg:flex"
        >
          <p>{profile.role}</p>
          <p>{profile.location}</p>
        </div>

        <div className="mt-auto pt-[40svh] lg:pt-10">
          <p data-hero-fade className="mb-4 text-[10px] uppercase tracking-[0.18em] text-paper/75 lg:hidden">
            {profile.role}
            <span className="mx-2 text-lime">/</span>
            {profile.location}
          </p>
          <h1 className="text-[clamp(2.7rem,10.4vw,6.4rem)] font-medium leading-[0.88] tracking-[-0.05em]">
            {hero.lines.map((line) => (
              <span key={line.text} className="block overflow-hidden py-[0.03em]">
                <span data-hero-line className={`block ${line.accent ? "font-serif italic text-lime" : ""}`}>
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-6 grid gap-6 lg:mt-8">
            <p data-hero-fade className="max-w-md text-base leading-relaxed text-paper/80 sm:text-lg">
              {hero.lede}
            </p>
            <div data-hero-fade className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
                <Magnetic className="w-full min-[420px]:w-fit">
                  <button
                    type="button"
                    className={`${buttonClass("solid")} w-full justify-center min-[420px]:w-auto`}
                    onClick={() => scrollToId(hero.primaryTarget)}
                  >
                    {hero.primaryCta}
                    <Arrow />
                  </button>
                </Magnetic>
                <Magnetic className="w-full min-[420px]:w-fit">
                  <button
                    type="button"
                    className={`${buttonClass("ghost")} w-full justify-center min-[420px]:w-auto`}
                    onClick={() => scrollToId(hero.secondaryTarget)}
                  >
                    {hero.secondaryCta}
                  </button>
                </Magnetic>
              </div>
              <p className="flex items-center gap-2 text-sm text-paper/70">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" />
                {profile.availability}
              </p>
            </div>
          </div>
        </div>

        <div data-hero-fade className="mt-8 lg:mt-12">
          <div className="mb-6 hidden items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted sm:flex">
            <span className="scroll-line" />
            {hero.scroll}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/15 pt-5 sm:gap-x-6 sm:pt-6 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="font-serif text-[clamp(1.8rem,6vw,3.2rem)] leading-none tracking-tight">
                  <CountUp
                    play={booted}
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </dt>
                <dd className="mt-2 text-[10px] uppercase leading-snug tracking-[0.16em] text-paper/55 sm:text-[11px]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
