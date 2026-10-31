"use client";

import { useEffect, useRef } from "react";
import { CoverImage } from "@/components/media";
import { gsap } from "@/lib/gsap";
import { popScrollLock, pushScrollLock } from "@/lib/scroll";

export function Preloader({
  name,
  role,
  image,
  imagePosition = "center 18%",
  onDone,
}: {
  name: string;
  role: string;
  image?: string | null;
  imagePosition?: string;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLParagraphElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const rootEl = root.current;
    const barEl = bar.current;
    const numEl = num.current;
    if (!rootEl || !barEl || !numEl) return;

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
      onDoneRef.current();
      return;
    }

    const obj = { n: 0 };
    gsap.set(barEl, { scaleX: 0, transformOrigin: "left center" });
    if (photo.current) gsap.set(photo.current, { scale: 1.12 });
    if (copy.current) gsap.set(copy.current, { autoAlpha: 0, y: 28 });

    const fallback = window.setTimeout(() => {
      if (!active) return;
      gsap.set(rootEl, { yPercent: -100 });
      onDoneRef.current();
      release();
    }, 4500);

    const timeline = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(fallback);
        release();
      },
    });

    if (photo.current) {
      timeline.to(photo.current, { scale: 1, duration: 1.7, ease: "power2.out" }, 0);
    }
    if (copy.current) {
      timeline.to(copy.current, { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out" }, 0.12);
    }
    timeline.to(
      obj,
      {
        n: 100,
        duration: 1.35,
        ease: "power1.inOut",
        onUpdate: () => {
          numEl.textContent = String(Math.round(obj.n)).padStart(3, "0");
          barEl.style.transform = `scaleX(${obj.n / 100})`;
        },
      },
      0,
    );
    timeline.add(() => {
      if (active) onDoneRef.current();
    });
    timeline.to(rootEl, {
      yPercent: -100,
      duration: 1.05,
      ease: "power4.inOut",
    });

    return () => {
      window.clearTimeout(fallback);
      timeline.kill();
      release();
    };
  }, []);

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[90] flex flex-col overflow-hidden bg-paper text-ink lg:flex-row"
      aria-hidden
    >
      {image ? (
        <div className="relative h-[68svh] w-full shrink-0 overflow-hidden bg-ink lg:h-full lg:w-[48%]">
          <div ref={photo} className="absolute inset-[-6%] origin-center">
            <CoverImage
              src={image}
              alt=""
              sizes="(min-width: 1024px) 48vw, 100vw"
              position={imagePosition}
              priority
            />
          </div>
        </div>
      ) : null}

      <div
        ref={copy}
        className="flex min-h-0 flex-1 flex-col justify-center px-5 py-6 sm:px-8 lg:justify-between lg:px-12 lg:py-14 xl:px-16"
      >
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink/50">{role}</p>
        <p className="mt-2 font-serif text-[clamp(5.4rem,18vw,10rem)] italic leading-[0.78] tracking-[-0.045em] lg:mt-0">
          {name}
        </p>
        <div className="mt-6 lg:mt-0">
          <div className="h-px w-full bg-ink/15">
            <div ref={bar} className="h-full w-full origin-left bg-lime" />
          </div>
          <p ref={num} className="mt-3 text-right font-serif text-3xl tabular-nums leading-none sm:text-4xl">
            000
          </p>
        </div>
      </div>
    </div>
  );
}
