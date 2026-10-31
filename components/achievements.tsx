"use client";

import { useRef } from "react";
import type { SiteContent } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { gutter, SectionLabel } from "@/components/ui";

export function Achievements({
  achievements,
}: {
  achievements: SiteContent["achievements"];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-achievement]", {
        y: 28,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="achievements" ref={root} className="scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className={`${gutter} mb-10 max-w-xl sm:mb-14`}>
        <SectionLabel index={achievements.index} label={achievements.label} />
        <p className="mt-4 text-lg leading-relaxed text-muted">{achievements.intro}</p>
      </div>
      <div className={gutter}>
        <ul className="grid sm:grid-cols-2">
          {achievements.items.map((item) => (
            <li
              key={item.title}
              data-achievement
              className="border-line px-0 py-8 last:border-b-0 sm:border-b-0 sm:px-8 sm:py-10 sm:odd:border-r sm:[&:nth-child(n+3)]:border-t lg:px-10 lg:py-12 max-sm:border-b"
            >
              <p className="font-serif text-[clamp(3.2rem,8vw,5.5rem)] leading-none tracking-[-0.04em] text-paper">
                {item.figure}
              </p>
              <h3 className="mt-6 text-xl tracking-tight sm:text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
