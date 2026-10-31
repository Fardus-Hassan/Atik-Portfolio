"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DetailView } from "@/lib/content";
import { CoverImage } from "@/components/media";
import { gsap } from "@/lib/gsap";
import { popScrollLock, pushScrollLock } from "@/lib/scroll";

export function DetailOverlay({
  detail,
  closeLabel,
  onClose,
}: {
  detail: DetailView | null;
  closeLabel: string;
  onClose: () => void;
}) {
  const [held, setHeld] = useState<DetailView | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const onCloseRef = useRef(onClose);
  const view = detail ?? held;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (detail) setHeld(detail);
  }, [detail]);

  useEffect(() => {
    return () => {
      if (!locked.current) return;
      locked.current = false;
      popScrollLock();
    };
  }, []);

  useLayoutEffect(() => {
    const rootEl = root.current;
    if (!rootEl || !view) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pieces = rootEl.querySelectorAll("[data-detail-piece]");
    const unlock = () => {
      if (!locked.current) return;
      locked.current = false;
      popScrollLock();
    };
    const lock = () => {
      if (locked.current) return;
      locked.current = true;
      pushScrollLock();
    };

    if (!detail) {
      if (reduced) {
        unlock();
        setHeld(null);
        return;
      }
      const tween = gsap.timeline({
        onComplete: () => {
          unlock();
          setHeld(null);
        },
      });
      tween.to(pieces, { autoAlpha: 0, y: 12, duration: 0.22, ease: "power2.in" }, 0);
      tween.to(rootEl, { yPercent: 100, duration: 0.55, ease: "power4.in" }, 0.04);
      return () => {
        tween.kill();
      };
    }

    lock();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);

    if (reduced) {
      gsap.set(rootEl, { yPercent: 0 });
      gsap.set(pieces, { autoAlpha: 1, y: 0 });
      return () => window.removeEventListener("keydown", onKey);
    }

    gsap.set(rootEl, { yPercent: 100 });
    gsap.set(pieces, { autoAlpha: 0, y: 28 });
    const tween = gsap.timeline();
    tween.to(rootEl, { yPercent: 0, duration: 0.72, ease: "power4.out" });
    tween.to(pieces, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power3.out" }, 0.16);

    return () => {
      tween.kill();
      window.removeEventListener("keydown", onKey);
    };
  }, [detail, view]);

  if (!view) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[70] overflow-y-auto"
      style={{ background: view.background, color: view.foreground }}
      role="dialog"
      aria-modal="true"
      aria-label={view.title}
    >
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 md:px-10">
        <div
          className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-4 px-4 py-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10"
          style={{ background: view.background }}
        >
          <p className="min-w-0 truncate text-[11px] uppercase tracking-[0.2em] opacity-70">{view.eyebrow}</p>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="min-h-11 shrink-0 rounded-full border border-current/20 px-4 text-sm"
          >
            {closeLabel}
          </button>
        </div>

        {view.image ? (
          <div data-detail-piece className="relative mt-2 aspect-[16/10] overflow-hidden rounded-2xl">
            <CoverImage src={view.image} alt={view.imageAlt ?? ""} sizes="(min-width: 768px) 800px, 100vw" />
          </div>
        ) : null}

        <h2
          data-detail-piece
          className="mt-8 max-w-3xl font-serif text-[clamp(2.1rem,8vw,4.5rem)] leading-[0.98] tracking-tight"
        >
          {view.title}
        </h2>
        <p data-detail-piece className="mt-4 text-sm uppercase tracking-[0.18em] opacity-60">
          {view.meta}
        </p>

        {view.metric ? (
          <div data-detail-piece className="mt-10 border-t border-current/15 pt-6">
            <p className="font-serif text-[clamp(2.8rem,12vw,4.5rem)] leading-none md:text-7xl">{view.metric}</p>
            {view.metricLabel ? (
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] opacity-70">{view.metricLabel}</p>
            ) : null}
          </div>
        ) : null}

        {view.tags.length ? (
          <ul data-detail-piece className="mt-8 flex flex-wrap gap-2">
            {view.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-current/20 px-3 py-1 text-sm">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div data-detail-piece className="mt-12 space-y-8 pb-10">
          {view.blocks.map((block) => (
            <div key={`${block.label ?? "block"}-${block.text.slice(0, 16)}`} className="max-w-2xl">
              {block.label ? (
                <p className="text-[11px] uppercase tracking-[0.18em] opacity-60">{block.label}</p>
              ) : null}
              <p className="mt-2 text-base leading-relaxed sm:text-lg">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
