"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export const gutter = "px-4 sm:px-6 md:px-10 lg:px-14";

export function SectionLabel({
  index,
  label,
  tone = "dark",
}: {
  index: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <p
      className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] ${light ? "text-ink/55" : "text-muted"}`}
    >
      <span className={light ? "text-ink" : "text-lime"}>{index}</span>
      <span className={`h-px w-8 ${light ? "bg-ink/30" : "bg-paper/30"}`} />
      {label}
    </p>
  );
}

export function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path
        d="M3 11L11 3M11 3H5M11 3V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function buttonClass(variant: "solid" | "ghost" = "solid") {
  const base =
    "group inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300";
  if (variant === "ghost") {
    return `${base} border border-current/25 hover:border-paper hover:bg-paper hover:text-ink`;
  }
  return `${base} bg-lime text-ink hover:bg-paper`;
}

export function Magnetic({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    gsap.to(node, { x: x * 0.28, y: y * 0.35, duration: 0.35, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
  };

  return (
    <div ref={ref} className={className ?? "w-fit"} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  play,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  play: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) => {
    const shown = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
    return `${prefix}${shown}${suffix}`;
  };

  useGSAP(() => {
    const el = ref.current;
    if (!play || !el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = format(value);
      return;
    }
    const obj = { n: 0 };
    gsap.to(obj, {
      n: value,
      duration: 1.5,
      delay: 0.15,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(obj.n);
      },
    });
  }, { dependencies: [play, value, prefix, suffix, decimals], revertOnUpdate: true });

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}
