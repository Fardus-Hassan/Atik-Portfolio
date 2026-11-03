import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import type { JsonSchema } from "@/components/admin/schema-form";
import { SectionEditor } from "@/components/admin/section-editor";
import { PageHeader } from "@/components/admin/ui";
import { load } from "@/lib/admin";
import { sectionNotes, sectionTitle } from "@/lib/admin-sections";
import { isSectionKey, sectionSchema } from "@/shared/content-schema";

type Section = { key: string; data: unknown; customized: boolean; updatedAt: string | null };

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return { title: isSectionKey(section) ? sectionTitle(section) : "Content" };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();

  const data = await load<Section>(`/api/content/${section}`);
  const schema = JSON.parse(JSON.stringify(z.toJSONSchema(sectionSchema(section), { unrepresentable: "any" }))) as JsonSchema;

  return (
    <>
      <Link href="/admin/content" className="-my-2 inline-flex min-h-10 items-center text-sm text-paper/55 hover:text-paper">
        ← All sections
      </Link>
      <div className="mt-5">
        <PageHeader title={sectionTitle(section)} intro={sectionNotes[section]} />
      </div>
      <SectionEditor sectionKey={section} schema={schema} initial={data.data} customized={data.customized} />
    </>
  );
}
