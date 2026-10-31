"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { setSmoother } from "@/lib/scroll";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollSmoother.get()?.kill();

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 0.9,
      effects: false,
      smoothTouch: false,
      normalizeScroll: false,
    });

    setSmoother(smoother);
    ScrollTrigger.refresh();

    return () => {
      smoother.kill();
      setSmoother(null);
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
