"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent, VideoItem } from "@/lib/content";
import { Arrow, gutter, SectionLabel } from "@/components/ui";

const thumb = (item: VideoItem, size: "maxresdefault" | "hqdefault") => `https://i.ytimg.com/vi/${item.youtubeId}/${size}.jpg`;

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className={flip ? "rotate-180" : ""}>
      <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Videos({ videos }: { videos: SiteContent["videos"] }) {
  const items = videos.items;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const list = useRef<HTMLUListElement>(null);
  const current = items[active];

  useEffect(() => {
    const el = list.current;
    const item = el?.children[active] as HTMLElement | undefined;
    if (!el || !item) return;
    if (el.scrollWidth > el.clientWidth) {
      el.scrollTo({
        left: item.offsetLeft - el.offsetLeft,
        behavior: "smooth",
      });
    } else if (el.scrollHeight > el.clientHeight) {
      el.scrollTo({
        top: item.offsetTop - (el.clientHeight - item.offsetHeight) / 2,
        behavior: "smooth",
      });
    }
  }, [active]);

  if (!current) return null;

  const step = (delta: number) => setActive((value) => (value + delta + items.length) % items.length);
  const count = (value: number) => String(value).padStart(2, "0");

  return (
    <section id="videos" className="scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className={`${gutter} mb-8 flex flex-col gap-6 sm:mb-10 md:mb-14 md:flex-row md:items-end md:justify-between`}>
        <div className="max-w-md">
          <SectionLabel index={videos.index} label={videos.label} />
          <p className="mt-4 text-base leading-relaxed text-muted">{videos.intro}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="mr-2 text-sm tabular-nums tracking-[0.2em] text-muted">
            {count(active + 1)} / {count(items.length)}
          </span>
          <button
            type="button"
            aria-label="Previous video"
            onClick={() => step(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-paper/20 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
          >
            <Chevron />
          </button>
          <button
            type="button"
            aria-label="Next video"
            onClick={() => step(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-paper/20 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
          >
            <Chevron flip />
          </button>
          {videos.channelHref ? (
            <a
              href={videos.channelHref}
              target="_blank"
              rel="noreferrer"
              className="group ml-2 hidden min-h-11 items-center gap-2 border-b border-paper/30 pb-0.5 text-sm tracking-wide sm:inline-flex"
            >
              {videos.channelLabel}
              <Arrow />
            </a>
          ) : null}
        </div>
      </div>

      <div className={`${gutter} grid gap-4 lg:grid-cols-12 lg:gap-6`}>
        <div className="lg:col-span-8">
          <div key={current.youtubeId} className="page-fade relative aspect-video overflow-hidden rounded-[1.4rem] bg-black">
            {playing ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={current.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`${videos.playLabel}: ${current.title}`}
                className="group absolute inset-0 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails are remote and not in next.config images */}
                <img
                  src={thumb(current, "maxresdefault")}
                  onError={(event) => {
                    event.currentTarget.src = thumb(current, "hqdefault");
                  }}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
                <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
                  <span className="video-ring absolute inset-0 rounded-full border border-lime" />
                  <PlayIcon className="ml-1 h-6 w-6 sm:h-8 sm:w-8" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-white/70">{current.meta}</span>
                  <span className="mt-2 block max-w-[22ch] font-serif text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[1.02] tracking-[-0.03em] text-white">
                    {current.title}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="relative min-w-0 lg:col-span-4">
          <ul
            ref={list}
            className="relative -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] lg:absolute lg:inset-0 lg:mx-0 lg:snap-y lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain lg:px-0 lg:pb-10 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <li key={item.youtubeId} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={isActive}
                    className={`group flex w-full flex-col gap-3 rounded-[1.1rem] border p-2.5 text-left transition-colors duration-300 lg:flex-row lg:items-center lg:gap-4 ${
                      isActive ? "border-lime/60 bg-white/[0.04]" : "border-line hover:border-paper/30"
                    }`}
                  >
                    <span className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-[0.8rem] bg-black lg:w-40">
                      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnails are remote and not in next.config images */}
                      <img
                        src={thumb(item, "hqdefault")}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full object-cover transition duration-500 ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}
                      />
                      <span
                        className={`absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-full ${isActive ? "bg-lime text-ink" : "bg-black/60 text-white"}`}
                      >
                        <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                      </span>
                    </span>
                    <span className="min-w-0 px-1 pb-1 lg:px-0 lg:pb-0">
                      <span className={`block text-[11px] uppercase tracking-[0.16em] ${isActive ? "text-lime" : "text-muted"}`}>
                        {count(index + 1)} · {item.meta}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-[15px] leading-snug text-paper/90">{item.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-16 bg-gradient-to-t from-ink to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
