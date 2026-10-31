"use client";

import { useRef } from "react";
import type { ServiceItem, SiteContent } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { gutter, SectionLabel } from "@/components/ui";

export function Services({
  services,
  onOpen,
}: {
  services: SiteContent["services"];
  onOpen: (item: ServiceItem) => void;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-service]", {
        y: 36,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} className="scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className={`${gutter} mb-8 flex flex-col gap-6 sm:mb-10 md:mb-14 md:flex-row md:items-end md:justify-between`}>
        <SectionLabel index={services.index} label={services.label} />
        <p className="max-w-md text-base leading-relaxed text-muted md:text-right">{services.intro}</p>
      </div>
      <ul className="border-t border-line">
        {services.items.map((item) => (
          <li key={item.title} data-service className="service-row border-b border-line">
            <button
              type="button"
              data-cursor="read"
              onClick={() => onOpen(item)}
              className={`${gutter} grid w-full min-w-0 gap-3 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-lime sm:gap-4 sm:py-7 md:grid-cols-12 md:items-start md:py-9`}
            >
              <span className="flex min-w-0 items-start justify-between gap-4 md:col-span-6">
                <h3 className="min-w-0 text-[1.65rem] leading-tight tracking-tight sm:text-4xl md:text-5xl">{item.title}</h3>
                <span className="service-arrow pt-1 text-xl md:hidden" aria-hidden>
                  ↗
                </span>
              </span>
              <p className="service-muted min-w-0 text-base leading-relaxed text-muted md:col-span-5 md:pt-2">{item.text}</p>
              <span className="service-arrow hidden text-xl md:col-span-1 md:block md:pt-2 md:text-right" aria-hidden>
                ↗
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
