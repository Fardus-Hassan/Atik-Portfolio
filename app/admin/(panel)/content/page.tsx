import type { Metadata } from "next";
import Link from "next/link";
import { card, PageHeader } from "@/components/admin/ui";
import { sectionGroups, sectionNotes, sectionTitle } from "@/lib/admin-sections";

export const metadata: Metadata = { title: "Content" };

export default function ContentPage() {
  return (
    <>
      <PageHeader title="Content" intro="Every text, image, link, and icon on the site. Pick a section to edit it." />
      <div className="flex flex-col gap-10">
        {sectionGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-[12px] uppercase tracking-[0.18em] text-paper/45">{group.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.keys.map((key) => (
                <Link key={key} href={`/admin/content/${key}`} className={`${card} p-5 transition-colors hover:border-lime/50`}>
                  <p className="font-medium">{sectionTitle(key)} →</p>
                  {sectionNotes[key] ? <p className="mt-1.5 text-sm text-paper/55">{sectionNotes[key]}</p> : null}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
