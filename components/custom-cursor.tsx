"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor({
  viewLabel,
  readLabel,
  dragLabel,
}: {
  viewLabel: string;
  readLabel: string;
  dragLabel: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const refresh = useRef<() => void>(() => {});
  const pathname = usePathname();
  const disabled = pathname.startsWith("/admin");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bubbleEl = bubble.current;
    const dotEl = dot.current;
    const rootEl = root.current;
    const labelEl = label.current;
    if (disabled || !fine || reduced || !bubbleEl || !dotEl || !rootEl || !labelEl) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(rootEl, { autoAlpha: 0, mixBlendMode: "difference" });
    gsap.set(bubbleEl, { xPercent: -50, yPercent: -50, width: 40, height: 40 });
    gsap.set(dotEl, { xPercent: -50, yPercent: -50 });
    gsap.set(labelEl, { autoAlpha: 0 });

    const moveX = gsap.quickTo(bubbleEl, "x", { duration: 0.45, ease: "power3.out" });
    const moveY = gsap.quickTo(bubbleEl, "y", { duration: 0.45, ease: "power3.out" });
    const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power2.out" });

    let mode = "";
    let visible = false;

    const show = (value: boolean) => {
      if (visible === value) return;
      visible = value;
      gsap.to(rootEl, { autoAlpha: value ? 1 : 0, duration: 0.2, overwrite: "auto" });
    };

    const rest = () => {
      gsap.set(rootEl, { mixBlendMode: "difference" });
      gsap.to(bubbleEl, {
        width: 40,
        height: 40,
        backgroundColor: "transparent",
        borderColor: "#ffffff",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(labelEl, { autoAlpha: 0, duration: 0.15 });
      gsap.to(dotEl, { autoAlpha: 1, duration: 0.2 });
    };

    const apply = (next: string) => {
      show(next !== "field");
      if (next === mode) return;
      mode = next;
      if (next === "field") return;
      if (next === "view" || next === "read" || next === "drag") {
        labelEl.textContent = next === "view" ? viewLabel : next === "read" ? readLabel : dragLabel;
        gsap.set(rootEl, { mixBlendMode: "normal" });
        gsap.to(bubbleEl, {
          width: 108,
          height: 108,
          backgroundColor: "#dff25a",
          borderColor: "#dff25a",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(labelEl, { autoAlpha: 1, duration: 0.2 });
        gsap.to(dotEl, { autoAlpha: 0, duration: 0.2 });
        return;
      }
      if (next === "link") {
        gsap.set(rootEl, { mixBlendMode: "difference" });
        gsap.to(bubbleEl, {
          width: 64,
          height: 64,
          backgroundColor: "transparent",
          borderColor: "#ffffff",
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
      if (target.closest('a, button, [role="button"], summary, label[for]')) return "link";
      return "";
    };

    let placed = false;
    let last = { x: 0, y: 0 };
    refresh.current = () => {
      if (placed) apply(modeFrom(document.elementFromPoint(last.x, last.y)));
    };
    const onMove = (event: MouseEvent) => {
      if (!placed) {
        placed = true;
        gsap.set([bubbleEl, dotEl], { x: event.clientX, y: event.clientY });
      }
      last = { x: event.clientX, y: event.clientY };
      moveX(event.clientX);
      moveY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
      apply(modeFrom(event.target));
    };

    const hide = () => show(false);
    const onOut = (event: MouseEvent) => {
      if (!event.relatedTarget || (event.relatedTarget instanceof Element && event.relatedTarget.closest("iframe"))) {
        hide();
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove as EventListener, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      refresh.current = () => {};
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onMove as EventListener);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      gsap.killTweensOf([rootEl, bubbleEl, dotEl, labelEl]);
    };
  }, [disabled, dragLabel, readLabel, viewLabel]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => refresh.current());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  if (disabled) return null;

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-[120]" aria-hidden>
      <div
        ref={bubble}
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-white"
      >
        <span
          ref={label}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
        />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  );
}
