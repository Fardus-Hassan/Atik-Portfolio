import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/media-library";
import { PageHeader } from "@/components/admin/ui";
import { load, type MediaItem } from "@/lib/admin";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const { items } = await load<{ items: MediaItem[] }>("/api/media");
  return (
    <>
      <PageHeader
        title="Media"
        intro="Photos, logos, icons, and the CV. Upload here, or straight from any image field while editing content."
      />
      <MediaLibrary initial={items} />
    </>
  );
}
