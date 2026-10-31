"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor({
  viewLabel,
  readLabel,
}: {
  viewLabel: string;
  readLabel: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bubbleEl = bubble.current;
    const dotEl = dot.current;
    const rootEl = root.current;
    const labelEl = label.current;
    if (!fine || reduced || !bubbleEl || !dotEl || !rootEl || !labelEl) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(rootEl, { autoAlpha: 0 });
    gsap.set(bubbleEl, { xPercent: -50, yPercent: -50, width: 40, height: 40, mixBlendMode: "difference" });
    gsap.set(dotEl, { xPercent: -50, yPercent: -50 });
    gsap.set(labelEl, { autoAlpha: 0 });

    const moveX = gsap.quickTo(bubbleEl, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(bubbleEl, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power2.out" });

    let mode = "";

    const rest = () => {
      gsap.to(bubbleEl, {
        width: 40,
        height: 40,
        backgroundColor: "transparent",
        borderColor: "#ffffff",
        mixBlendMode: "difference",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(labelEl, { autoAlpha: 0, duration: 0.15 });
      gsap.to(dotEl, { autoAlpha: 1, duration: 0.2 });
    };

    const apply = (next: string) => {
      if (next === mode) return;
      mode = next;
      if (next === "field") {
        gsap.to(rootEl, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      gsap.to(rootEl, { autoAlpha: 1, duration: 0.2 });
      if (next === "view" || next === "read") {
        labelEl.textContent = next === "view" ? viewLabel : readLabel;
        gsap.to(bubbleEl, {
          width: 108,
          height: 108,
          backgroundColor: "#dff25a",
          borderColor: "#dff25a",
          mixBlendMode: "normal",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(labelEl, { autoAlpha: 1, duration: 0.2 });
        gsap.to(dotEl, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      if (next === "link") {
        gsap.to(bubbleEl, {
          width: 64,
          height: 64,
          backgroundColor: "transparent",
          borderColor: "#ffffff",
          mixBlendMode: "difference",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(labelEl, { autoAlpha: 0, duration: 0.15 });
        gsap.to(dotEl, { autoAlpha: 1, duration: 0.2 });
        return;
      }
      rest();
    };

    const modeFrom = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return "";
      if (target.closest("input, textarea, select")) return "field";
      const marked = target.closest<HTMLElement>("[data-cursor]");
      if (marked?.dataset.cursor) return marked.dataset.cursor;
      if (target.closest("a, button")) return "link";
      return "";
    };

    const onMove = (event: MouseEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
      apply(modeFrom(event.target));
    };

    const hide = () => gsap.to(rootEl, { autoAlpha: 0, duration: 0.2 });

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [readLabel, viewLabel]);

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      <div
        ref={bubble}
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-white"
      >
        <span
          ref={label}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
        />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
    </div>
  );
}
