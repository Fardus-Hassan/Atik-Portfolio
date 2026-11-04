"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress({ target, className = "bg-lime" }: { target: string; className?: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const node = document.getElementById(target);
      if (!node || !bar.current) return;
      const rect = node.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 1;
      bar.current.style.transform = `scaleX(${progress})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <div ref={bar} className={`h-full origin-left scale-x-0 ${className}`} />
    </div>
  );
}
