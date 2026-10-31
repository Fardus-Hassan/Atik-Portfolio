import type { Metadata } from "next";
import { CasesArchive } from "@/components/cases-archive";
import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export const metadata: Metadata = {
  title: `${content.cases.label} · ${content.profile.name}`,
  description: content.cases.pageIntro,
};

export default function CasesPage() {
  return <CasesArchive content={content} />;
}
