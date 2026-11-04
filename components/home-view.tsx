"use client";

import { useCallback, useState } from "react";
import type { CaseStudy, DetailView, ServiceItem, SiteContent } from "@/lib/content";
import { About } from "@/components/about";
import { Blog } from "@/components/blog";
import { Contact } from "@/components/contact";
import { DetailOverlay } from "@/components/detail-overlay";
import { Achievements } from "@/components/achievements";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Cases } from "@/components/cases";
import { Marquee } from "@/components/marquee";
import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { Services } from "@/components/services";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Testimonials } from "@/components/testimonials";
import { Videos } from "@/components/videos";
import { Work } from "@/components/work";
import { scrollToId } from "@/lib/scroll";

export function HomeView({ content }: { content: SiteContent }) {
  const [booted, setBooted] = useState(false);
  const [detail, setDetail] = useState<DetailView | null>(null);
  const closeDetail = useCallback(() => setDetail(null), []);

  const openWork = (item: CaseStudy) => {
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

  const openService = (item: ServiceItem) => {
    setDetail({
      eyebrow: content.services.label,
      title: item.title,
      meta: item.detail.meta,
      background: "#f4f0e6",
      foreground: "#090908",
      tags: item.detail.tags,
      blocks: item.detail.blocks,
    });
  };

  return (
    <>
      <a
        href="#content"
        onClick={(event) => {
          event.preventDefault();
          scrollToId("content");
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
      >
        {content.ui.skip}
      </a>
      <div className="grain" aria-hidden />
      <Preloader
        name={content.profile.name}
        role={content.profile.role}
        year={content.profile.year}
        loader={content.loader}
        onDone={() => setBooted(true)}
      />
      <Nav content={content} booted={booted} />
      <DetailOverlay detail={detail} closeLabel={content.ui.close} onClose={closeDetail} />
      <SmoothScroll>
        <main>
          <Hero content={content} booted={booted} />
          {content.modules
            .filter((module) => module.enabled)
            .map((module) => {
              switch (module.id) {
                case "marquee":
                  return <Marquee key={module.id} marquee={content.marquee} />;
                case "about":
                  return <About key={module.id} about={content.about} cv={content.profile.cv} />;
                case "services":
                  return <Services key={module.id} services={content.services} onOpen={openService} />;
                case "work":
                  return <Work key={module.id} work={content.work} onOpen={openWork} />;
                case "achievements":
                  return <Achievements key={module.id} achievements={content.achievements} />;
                case "testimonials":
                  return <Testimonials key={module.id} testimonials={content.testimonials} />;
                case "cases":
                  return (
                    <Cases
                      key={module.id}
                      cases={content.cases}
                      items={content.work.items}
                      onOpen={openWork}
                    />
                  );
                case "videos":
                  return <Videos key={module.id} videos={content.videos} />;
                case "blog":
                  return <Blog key={module.id} blog={content.blog} />;
                case "contact":
                  return (
                    <Contact key={module.id} contact={content.contact} email={content.profile.email} />
                  );
                default:
                  return null;
              }
            })}
          <Footer content={content} />
        </main>
      </SmoothScroll>
    </>
  );
}
