import type { Metadata } from "next";
import { CasesArchive } from "@/components/cases-archive";
import { pageMetadata } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getSiteContent(), "cases", "/cases");
}

export default async function CasesPage() {
  return <CasesArchive content={await getSiteContent()} />;
}
