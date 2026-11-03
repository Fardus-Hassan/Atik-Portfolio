import { cacheLife, cacheTag } from "next/cache";
import { SiteContentSchema, type SiteContent } from "@/shared/content-schema";
import { defaultContent } from "@/shared/default-content";

export const API_URL = process.env.API_URL ?? "http://localhost:4000";
export const CONTENT_TAG = "content";

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  try {
    const response = await fetch(`${API_URL}/api/content`, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error(`Content API returned ${response.status}`);
    const content = SiteContentSchema.parse(await response.json());
    cacheLife("max");
    return content;
  } catch (error) {
    console.warn("Using default content:", error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return defaultContent;
  }
}
