"use client";

import { useState } from "react";
import type { CaseStudy, DetailView, SiteContent } from "@/lib/content";
import { BackButton } from "@/components/back-button";
import { CaseCard } from "@/components/cases";
import { DetailOverlay } from "@/components/detail-overlay";
import { SectionLabel } from "@/components/ui";

const pad = "px-4 sm:px-6 md:px-10 lg:px-14";

export function CasesArchive({ content }: { content: SiteContent }) {
  const { cases, profile, ui, work } = content;
  const [detail, setDetail] = useState<DetailView | null>(null);

  const open = (item: CaseStudy) => {
    setDetail({
      eyebrow: item.client,
      title: item.title,
      meta: item.year,
      metric: item.metric,
      metricLabel: item.metricLabel,
      image: item.image,
      imageAlt: item.imageAlt,
      background: item.background,
      foreground: item.foreground,
      tags: item.services,
      blocks: item.story,
    });
  };

  return (
    <>
      <main className="min-h-screen bg-ink text-paper">
        <header
          className={`${pad} page-fade sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink/90 py-4 backdrop-blur-md`}
        >
          <a href="/" className="min-h-11 text-sm font-medium tracking-tight">
            {profile.name}
          </a>
          <BackButton label={ui.back} />
        </header>

        <div className={`${pad} py-14 sm:py-20`}>
          <div className="page-rise" style={{ animationDelay: "60ms" }}>
            <SectionLabel index={cases.index} label={cases.label} />
            <h1 className="mt-6 max-w-[12ch] font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.92] tracking-[-0.04em]">
              {cases.label}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{cases.pageIntro}</p>
          </div>

          <ul className="mt-14 grid gap-4 md:grid-cols-2">
            {work.items.map((item, index) => (
              <li key={item.slug} className="page-rise" style={{ animationDelay: `${160 + index * 70}ms` }}>
                <CaseCard item={item} wide onOpen={open} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <DetailOverlay detail={detail} closeLabel={ui.close} onClose={() => setDetail(null)} />
    </>
  );
}
