"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import type { SiteContent } from "@/lib/content";
import { moduleEnabled } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { popScrollLock, pushScrollLock, scrollToId } from "@/lib/scroll";
import { Arrow, buttonClass, DownloadIcon, Magnetic } from "@/components/ui";

const desktopLink =
  "relative text-sm tracking-wide after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";
const mobileLink = "menu-link min-h-14 text-left font-serif text-[clamp(2.4rem,11vw,3.4rem)] leading-[0.95]";

export function Nav({
  content,
  booted,
}: {
  content: SiteContent;
  booted: boolean;
}) {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const links = content.nav.links.filter(
    (link) => "href" in link || link.id === "content" || moduleEnabled(content, link.id),
  );
  const cv = content.profile.cv;
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

  useLayoutEffect(() => {
    const panel = menu.current;
    if (!open || !panel) return;
    closing.current = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const tween = gsap.fromTo(
      panel,
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" },
    );
    return () => {
      tween.kill();
    };
  }, [open]);

  const closeMenu = (after?: () => void) => {
    const panel = menu.current;
    if (!open || !panel) {
      after?.();
      return;
    }
    if (closing.current) return;
    closing.current = true;
    const done = () => {
      setOpen(false);
      // The scroll lock is released in the effect cleanup after this render.
      if (after) window.setTimeout(after, 30);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }
    const items = panel.querySelectorAll("[data-menu-item]");
    gsap.set(items, { animation: "none" });
    gsap
      .timeline({ onComplete: done })
      .to(items, {
        y: -24,
        autoAlpha: 0,
        duration: 0.32,
        stagger: 0.03,
        ease: "power2.in",
      })
      .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.65, ease: "power4.inOut" }, 0.12);
  };

  const closeRef = useRef(closeMenu);
  useEffect(() => {
    closeRef.current = closeMenu;
  });

  useEffect(() => {
    if (!open) return;
    pushScrollLock();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      popScrollLock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => closeMenu(() => scrollToId(id));

  const goPage = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!open) return;
    event.preventDefault();
    closeMenu(() => router.push(href));
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
            {links.map((link) =>
              "href" in link ? (
                <Link key={link.href} href={link.href} className={desktopLink}>
                  {link.label}
                </Link>
              ) : (
                <button key={link.id} type="button" onClick={() => go(link.id)} className={desktopLink}>
                  {link.label}
                </button>
              ),
            )}
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
              onClick={() => (open ? closeMenu() : setOpen(true))}
            >
              {open ? content.nav.close : content.nav.menu}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          ref={menu}
          className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-paper md:hidden"
        >
          <div data-menu-item className="flex justify-end">
            <button type="button" className="min-h-11 text-sm uppercase tracking-[0.18em]" onClick={() => closeMenu()}>
              {content.nav.close}
            </button>
          </div>
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {links.map((link, index) => {
              const style = { animationDelay: `${index * 70}ms` };
              return "href" in link ? (
                <Link
                  key={link.href}
                  href={link.href}
                  data-menu-item
                  onClick={(event) => goPage(event, link.href)}
                  className={`${mobileLink} flex items-center`}
                  style={style}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  type="button"
                  data-menu-item
                  onClick={() => go(link.id)}
                  className={mobileLink}
                  style={style}
                >
                  {link.label}
                </button>
              );
            })}
            {showCta ? (
              <button
                type="button"
                data-menu-item
                onClick={() => go(content.nav.ctaTarget)}
                className="menu-link mt-6 text-left text-lime"
                style={{ animationDelay: `${links.length * 70}ms` }}
              >
                {content.nav.cta}
              </button>
            ) : null}
          </nav>
          <div data-menu-item className="flex flex-wrap items-center justify-between gap-4">
            <p className="break-all text-sm text-muted">{content.profile.email}</p>
            {cv ? (
              <a
                href={cv.href}
                download={cv.fileName}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/25 px-4 text-sm"
              >
                <DownloadIcon />
                {cv.label}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
