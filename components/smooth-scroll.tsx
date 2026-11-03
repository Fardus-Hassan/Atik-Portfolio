"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { setSmoother } from "@/lib/scroll";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    window.scrollTo(0, 0);

    if (reduced) {
      timers.push(window.setTimeout(() => window.scrollTo(0, 0), 60));
      return () => timers.forEach((id) => window.clearTimeout(id));
    }

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
    smoother.scrollTop(0);
    ScrollTrigger.refresh();

    // Back navigation can restore the previous page's scroll after this effect runs.
    timers.push(
      window.setTimeout(() => {
        ScrollTrigger.refresh();
        smoother.scrollTop(0);
      }, 60),
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
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
