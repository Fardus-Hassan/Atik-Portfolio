import type { Metadata } from "next";
import type { SiteContent } from "@/shared/content-schema";

type PageKey = keyof SiteContent["seo"]["pages"];

export function siteUrl(content: SiteContent) {
  return (process.env.SITE_URL || content.seo.siteUrl || "http://localhost:3000").replace(/\/$/, "");
}

export function baseMetadata(content: SiteContent): Metadata {
  const { seo } = content;
  const home = seo.pages.home;
  const images = seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.siteName }] : undefined;

  return {
    metadataBase: new URL(siteUrl(content)),
    title: { default: home.title, template: seo.titleTemplate.includes("%s") ? seo.titleTemplate : `%s · ${seo.siteName}` },
    description: home.description,
    keywords: seo.keywords,
    applicationName: seo.siteName,
    authors: [{ name: content.profile.name }],
    creator: content.profile.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: seo.siteName,
      title: home.title,
      description: home.description,
      url: "/",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: home.title,
      description: home.description,
      creator: seo.twitterHandle || undefined,
      images: images?.map((image) => image.url),
    },
    robots: seo.indexing
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: false },
    verification: seo.googleVerification ? { google: seo.googleVerification } : undefined,
  };
}

export function pageMetadata(content: SiteContent, page: Exclude<PageKey, "home">, path: string): Metadata {
  const { title, description } = content.seo.pages[page];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}

export function structuredData(content: SiteContent) {
  const url = siteUrl(content);
  const sameAs = content.socials
    .filter((social) => social.enabled && /^https?:\/\//.test(social.href))
    .map((social) => social.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name: content.profile.name,
        jobTitle: content.profile.role,
        email: content.profile.email,
        url,
        image: content.about.portrait.image ? new URL(content.about.portrait.image, url).toString() : undefined,
        sameAs,
        knowsAbout: content.services.items.map((service) => service.title),
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: content.seo.siteName,
        description: content.seo.pages.home.description,
        publisher: { "@id": `${url}/#person` },
      },
    ],
  };
}
