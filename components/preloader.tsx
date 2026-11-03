"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { popScrollLock, pushScrollLock } from "@/lib/scroll";
import { session } from "@/lib/session";

export function Preloader({
  name,
  role,
  year,
  loader,
  onDone,
}: {
  name: string;
  role: string;
  year: string;
  loader: SiteContent["loader"];
  onDone: () => void;
}) {
  const words = loader.words;
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLParagraphElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useLayoutEffect(() => {
    const rootEl = root.current;
    const numEl = num.current;
    if (!rootEl || !numEl) return;

    if (session.introDone) {
      gsap.set(rootEl, { autoAlpha: 0 });
      onDoneRef.current();
      return;
    }

    const finish = () => {
      session.introDone = true;
      onDoneRef.current();
    };

    let active = true;
    pushScrollLock();
    const release = () => {
      if (!active) return;
      active = false;
      popScrollLock();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(rootEl, { autoAlpha: 0 });
      release();
      finish();
      return;
    }

    const q = gsap.utils.selector(rootEl);
    const panel = q("[data-l-panel]");
    const lime = q("[data-l-lime]");
    const chars = q("[data-l-char]");
    const lines = q("[data-l-line]");
    const fades = q("[data-l-fade]");
    const wordList = q("[data-l-words]");
    const bar = q("[data-l-bar]");
    const counter = { n: 0 };

    gsap.set(lines, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(chars, { yPercent: 120, rotate: 14, autoAlpha: 0, transformOrigin: "0% 100%" });
    gsap.set(fades, { autoAlpha: 0, y: 14 });
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    gsap.set([panel, lime], { clipPath: "inset(0% 0% 0% 0%)" });

    const fallback = window.setTimeout(() => {
      if (!active) return;
      gsap.set(rootEl, { autoAlpha: 0 });
      finish();
      release();
    }, 6500);

    const timeline = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(fallback);
        gsap.set(rootEl, { autoAlpha: 0 });
        release();
      },
    });

    timeline
      .to(lines, { scaleY: 1, duration: 1.1, stagger: 0.08, ease: "power3.inOut" }, 0)
      .to(chars, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.1, stagger: 0.07, ease: "power4.out" }, 0.15)
      .to(fades, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, 0.35)
      .to(
        counter,
        {
          n: 100,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            numEl.textContent = String(Math.round(counter.n)).padStart(3, "0");
          },
        },
        0.2,
      )
      .to(bar, { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0.2);

    words.slice(1).forEach((_, index) => {
      timeline.to(
        wordList,
        { yPercent: (-100 * (index + 1)) / words.length, duration: 0.5, ease: "power3.inOut" },
        0.75 + index * 0.5,
      );
    });

    timeline
      .to(chars, { yPercent: -120, rotate: -8, duration: 0.7, stagger: 0.05, ease: "power3.in" }, 2.55)
      .to(fades, { autoAlpha: 0, y: -10, duration: 0.4, stagger: 0.03, ease: "power2.in" }, 2.55)
      .to(lines, { scaleY: 0, transformOrigin: "bottom center", duration: 0.7, stagger: 0.05, ease: "power3.in" }, 2.6)
      .add(() => {
        if (active) finish();
      }, 3.05)
      .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" }, 3.05)
      .to(lime, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "power4.inOut" }, 3.2);
    return () => {
      window.clearTimeout(fallback);
      timeline.kill();
      release();
    };
  }, [words]);

  const letters = Array.from(name);

  return (
    <div ref={root} className="preloader fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      <div data-l-lime className="absolute inset-0 bg-lime" />
      <div data-l-panel className="absolute inset-0 flex flex-col bg-ink text-paper">
        <div className="pointer-events-none absolute inset-0 grid grid-cols-4 px-4 sm:px-6 md:px-10 lg:px-14">
          {[0, 1, 2, 3].map((line) => (
            <span key={line} data-l-line className="border-l border-paper/[0.07] last:border-r" />
          ))}
        </div>

        <div className="relative flex items-start justify-between px-4 pt-6 text-[11px] uppercase tracking-[0.24em] text-paper/55 sm:px-6 md:px-10 lg:px-14 lg:pt-10">
          <p data-l-fade>{role}</p>
          <p data-l-fade className="hidden sm:block">
            {loader.tag} © {year}
          </p>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-4">
          <p className="flex overflow-hidden pb-[0.06em] pl-[0.04em] pr-[0.14em] font-serif text-[clamp(7rem,44vw,21rem)] italic leading-[0.82] tracking-[-0.05em]">
            {letters.map((letter, index) => (
              <span key={`${letter}-${index}`} data-l-char className="inline-block will-change-transform">
                {letter}
              </span>
            ))}
          </p>
          <div data-l-fade className="mt-4 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-paper/60 sm:mt-6">
            <span className="h-px w-8 bg-paper/30" />
            <span className="relative block h-[1.4em] overflow-hidden">
              <span data-l-words className="flex flex-col">
                {words.map((word, index) => (
                  <span
                    key={word}
                    className={`block h-[1.4em] leading-[1.4em] ${index === words.length - 1 ? "text-lime" : ""}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </span>
            <span className="h-px w-8 bg-paper/30" />
          </div>
        </div>

        <div className="relative px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10 lg:px-14 lg:pb-10">
          <div className="flex items-end justify-between">
            <p data-l-fade className="text-[11px] uppercase tracking-[0.24em] text-paper/55">
              {loader.loading}
            </p>
            <p
              ref={num}
              data-l-fade
              className="font-serif text-[clamp(3rem,9vw,6rem)] tabular-nums leading-none tracking-[-0.03em]"
            >
              000
            </p>
          </div>
          <div className="mt-4 h-px w-full bg-paper/10">
            <div data-l-bar className="h-full w-full bg-lime" />
          </div>
        </div>
      </div>
    </div>
  );
}
