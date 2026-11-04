import { eq } from "drizzle-orm";
import { isSectionKey, SiteContentSchema, sectionKeys, type SectionKey, type SiteContent } from "../../shared/content-schema";
import { defaultContent } from "../../shared/default-content";
import { db } from "./db";
import { contentSections } from "./db/schema";

type Json = unknown;

function isPlainObject(value: Json): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Saved values win. Objects merge key by key so fields added to the schema later get their defaults. */
function mergeDefaults(base: Json, saved: Json): Json {
  if (isPlainObject(base) && isPlainObject(saved)) {
    const result: Record<string, Json> = { ...base };
    for (const [key, value] of Object.entries(saved)) result[key] = mergeDefaults(base[key], value);
    return result;
  }
  return saved === undefined ? base : saved;
}

export { isSectionKey };

/** Home sections added to the schema later are inserted at their default position. */
function withAllModules(saved: Json): Json {
  if (!Array.isArray(saved)) return saved;
  const result = [...saved];
  const present = new Set(result.map((item) => (isPlainObject(item) ? item.id : undefined)));
  defaultContent.modules.forEach((module, index) => {
    if (!present.has(module.id)) result.splice(Math.min(index, result.length), 0, module);
  });
  return result;
}

function resolveSection<K extends SectionKey>(key: K, rawSaved: Json): SiteContent[K] {
  const saved = key === "modules" ? withAllModules(rawSaved) : rawSaved;
  const schema = SiteContentSchema.shape[key];
  const direct = schema.safeParse(saved);
  if (direct.success) return direct.data as SiteContent[K];
  const merged = schema.safeParse(mergeDefaults(defaultContent[key], saved));
  if (merged.success) return merged.data as SiteContent[K];
  console.warn(`Saved content for "${key}" no longer matches the schema. Using the default.`);
  return defaultContent[key];
}

export async function getContent(): Promise<SiteContent> {
  const rows = await db.select().from(contentSections);
  const saved = new Map(rows.map((row) => [row.key, row.data]));
  const content = { ...defaultContent } as Record<SectionKey, unknown>;
  for (const key of sectionKeys) {
    if (saved.has(key)) content[key] = resolveSection(key, saved.get(key));
  }
  return content as SiteContent;
}

export async function getSection(key: SectionKey) {
  const [row] = await db.select().from(contentSections).where(eq(contentSections.key, key));
  return {
    key,
    data: row ? resolveSection(key, row.data) : defaultContent[key],
    customized: Boolean(row),
    updatedAt: row?.updatedAt ?? null,
  };
}

const allowedSvgTags = new Set(["path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "g"]);

/** Library icons are stored as SVG markup and rendered inline, so only plain shapes are accepted. */
export function unsafeIconReason(value: Json): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const reason = unsafeIconReason(item);
      if (reason) return reason;
    }
    return null;
  }
  if (!isPlainObject(value)) return null;
  if (value.kind === "svg" && typeof value.body === "string") {
    const body = value.body;
    if (/on\w+\s*=|javascript:|href\s*=|<!|<\?/i.test(body)) return "Icon markup contains a script or link.";
    for (const match of body.matchAll(/<\/?\s*([a-zA-Z][\w:-]*)/g)) {
      if (!allowedSvgTags.has(match[1].toLowerCase())) return `Icon markup contains a <${match[1]}> element.`;
    }
  }
  for (const child of Object.values(value)) {
    const reason = unsafeIconReason(child);
    if (reason) return reason;
  }
  return null;
}

export async function saveSection(key: SectionKey, data: Json) {
  const parsed = SiteContentSchema.shape[key].safeParse(data);
  if (!parsed.success) return { ok: false as const, issues: parsed.error.issues };
  const reason = unsafeIconReason(parsed.data);
  if (reason) return { ok: false as const, issues: [{ path: [], message: reason }] };

  const now = new Date();
  await db
    .insert(contentSections)
    .values({ key, data: parsed.data, updatedAt: now })
    .onConflictDoUpdate({ target: contentSections.key, set: { data: parsed.data, updatedAt: now } });
  return { ok: true as const, data: parsed.data };
}

export async function resetSection(key: SectionKey) {
  await db.delete(contentSections).where(eq(contentSections.key, key));
  return defaultContent[key];
}
