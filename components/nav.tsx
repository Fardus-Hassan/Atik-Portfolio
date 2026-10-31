"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";
import { moduleEnabled } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { popScrollLock, pushScrollLock, scrollToId } from "@/lib/scroll";
import { Arrow, buttonClass, Magnetic } from "@/components/ui";

export function Nav({
  content,
  booted,
}: {
  content: SiteContent;
  booted: boolean;
}) {
  const header = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const links = content.nav.links.filter(
    (link) => link.id === "content" || moduleEnabled(content, link.id),
  );
  const showCta = moduleEnabled(content, content.nav.ctaTarget);

  useGSAP(
    () => {
      if (!booted) return;
      const node = header.current;
      if (!node) return;

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const desktop = window.innerWidth >= 768;
          const hide = desktop && !open && self.direction === 1 && self.scroll() > 80;
          node.classList.toggle("is-scrolled", self.scroll() > 24);
          gsap.to(node, {
            yPercent: hide ? -100 : 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });
    },
    { dependencies: [booted, open], revertOnUpdate: true },
  );

  useEffect(() => {
    if (!open) return;
    pushScrollLock();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      popScrollLock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 40 : 0);
  };

  return (
    <>
      <header
        ref={header}
        className={`site-nav fixed inset-x-0 top-0 z-50 transition-[opacity,color,background-color,border-color] duration-500 ${booted ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-10 lg:px-14">
          <button type="button" onClick={() => go("content")} className="min-h-11 text-sm font-medium tracking-tight">
            {content.profile.name}
          </button>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className="relative text-sm tracking-wide after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {showCta ? (
              <Magnetic className="hidden md:block">
                <button type="button" onClick={() => go(content.nav.ctaTarget)} className={buttonClass("solid")}>
                  {content.nav.cta}
                  <Arrow />
                </button>
              </Magnetic>
            ) : null}
            <button
              type="button"
              className="min-h-11 px-1 text-sm uppercase tracking-[0.18em] md:hidden"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? content.nav.close : content.nav.menu}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-paper md:hidden">
          <div className="flex justify-end">
            <button type="button" className="min-h-11 text-sm uppercase tracking-[0.18em]" onClick={() => setOpen(false)}>
              {content.nav.close}
            </button>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {links.map((link, index) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className="menu-link min-h-14 text-left font-serif text-[clamp(2.4rem,11vw,3.4rem)] leading-[0.95]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {link.label}
              </button>
            ))}
            {showCta ? (
              <button
                type="button"
                onClick={() => go(content.nav.ctaTarget)}
                className="menu-link mt-6 text-left text-lime"
                style={{ animationDelay: `${links.length * 70}ms` }}
              >
                {content.nav.cta}
              </button>
            ) : null}
          </nav>
          <p className="break-all text-sm text-muted">{content.profile.email}</p>
        </div>
      ) : null}
    </>
  );
}
