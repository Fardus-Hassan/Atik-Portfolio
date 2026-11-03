"use client";

import { useRef } from "react";
import type { SiteContent } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { CoverImage } from "@/components/media";
import { DownloadIcon, gutter, SectionLabel } from "@/components/ui";

export function About({ about, cv }: { about: SiteContent["about"]; cv: SiteContent["profile"]["cv"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from("[data-about-photo]", {
        clipPath: "inset(10% 8% 10% 8% round 28px)",
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-about-photo]", start: "top 85%", once: true },
      });

      gsap.from("[data-word]", {
        opacity: 0.2,
        stagger: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-statement]",
          start: "top 80%",
          end: "top 40%",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="scroll-mt-24 py-16 sm:py-24 md:py-32 lg:py-40">
      <div className={gutter}>
        <SectionLabel index={about.index} label={about.label} />
        <h2
          data-statement
          className="mt-6 max-w-5xl font-serif text-[clamp(2rem,8vw,5rem)] leading-[1.05] tracking-[-0.03em] sm:mt-8"
        >
          {about.statement.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} data-word className="inline-block pr-[0.28em]">
              {word}
            </span>
          ))}
        </h2>

        <div className="mt-10 grid items-start gap-8 sm:mt-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div data-about-photo className="overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] lg:col-span-5">
            {about.portrait.image ? (
              <div className="relative aspect-[4/5]">
                <CoverImage
                  src={about.portrait.image}
                  alt={about.portrait.alt}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  position={about.portrait.position}
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-24 sm:p-7">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/75">{about.portrait.since}</p>
                  <p className="mt-2 max-w-[24ch] text-sm leading-relaxed text-white">{about.portrait.caption}</p>
                </div>
              </div>
            ) : (
              <div className="flex aspect-[4/5] flex-col bg-[#141412]">
                <div className="h-[36%] bg-lime" />
                <div className="flex flex-1 flex-col justify-between p-6 sm:p-9">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{about.portrait.since}</p>
                    <p className="mt-6 font-serif text-7xl leading-none text-paper sm:text-8xl">{about.portrait.mark}</p>
                  </div>
                  <p className="max-w-[18ch] text-sm leading-relaxed text-paper/70">{about.portrait.caption}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7">
            <div className="space-y-5 text-lg leading-relaxed text-paper/80">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {cv ? (
              <a
                href={cv.href}
                download={cv.fileName}
                data-cursor="link"
                className="group flex items-center justify-between gap-6 rounded-[1.25rem] border border-line p-5 transition-colors duration-300 hover:border-lime/50 hover:bg-white/[0.03] sm:p-6"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{cv.meta}</p>
                  <p className="mt-2 font-serif text-[clamp(1.8rem,4vw,2.4rem)] leading-none tracking-[-0.02em]">
                    {cv.label}
                  </p>
                </div>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:scale-110">
                  <DownloadIcon />
                </span>
              </a>
            ) : null}

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{about.principlesTitle}</p>
              <ol className="mt-4">
                {about.principles.map((principle, index) => (
                  <li key={principle.title} className="grid grid-cols-[auto_1fr] gap-4 border-t border-line py-4">
                    <span className="text-sm text-lime">0{index + 1}</span>
                    <div>
                      <h3 className="text-xl">{principle.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{principle.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{about.toolsTitle}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {about.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-line px-3 py-1.5 text-sm text-paper/85">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
