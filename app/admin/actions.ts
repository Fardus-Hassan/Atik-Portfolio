"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, api, type IconResult, type MediaItem, type Message, type MessageStatus } from "@/lib/admin";
import { CONTENT_TAG } from "@/lib/site";
import { isSectionKey } from "@/shared/content-schema";

async function setSession(token: string) {
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
}

function guard<T extends { ok: boolean; status?: number }>(result: T) {
  if (!result.ok && result.status === 401) redirect("/admin/login");
  return result;
}

export async function login(_state: { error: string; email: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const result = await api<{ token: string }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password: formData.get("password") }),
    },
    "",
  );
  if (!result.ok) return { error: result.error, email };
  await setSession(result.data.token);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

export async function changePassword(_state: { error?: string; done?: boolean } | null, formData: FormData) {
  const next = String(formData.get("next") ?? "");
  if (next !== String(formData.get("confirm") ?? "")) return { error: "The new passwords do not match." };
  const result = guard(
    await api<{ token: string }>("/api/auth/password", {
      method: "POST",
      body: JSON.stringify({ current: formData.get("current"), next }),
    }),
  );
  if (!result.ok) return { error: result.error };
  await setSession(result.data.token);
  return { done: true };
}

export async function saveSection(key: string, data: unknown) {
  if (!isSectionKey(key)) return { ok: false as const, error: "Unknown section." };
  const result = guard(await api<{ data: unknown }>(`/api/content/${key}`, { method: "PUT", body: JSON.stringify({ data }) }));
  if (!result.ok) return { ok: false as const, error: result.error, issues: result.issues };
  updateTag(CONTENT_TAG);
  return { ok: true as const, data: result.data.data };
}

export async function resetSection(key: string) {
  if (!isSectionKey(key)) return { ok: false as const, error: "Unknown section." };
  const result = guard(await api<{ data: unknown }>(`/api/content/${key}`, { method: "DELETE" }));
  if (!result.ok) return { ok: false as const, error: result.error };
  updateTag(CONTENT_TAG);
  return { ok: true as const, data: result.data.data };
}

export async function updateMessage(id: number, patch: { status?: MessageStatus; note?: string }) {
  const result = guard(await api<Message>(`/api/messages/${id}`, { method: "PATCH", body: JSON.stringify(patch) }));
  return result.ok ? { ok: true as const, message: result.data } : { ok: false as const, error: result.error };
}

export async function deleteMessage(id: number) {
  const result = guard(await api(`/api/messages/${id}`, { method: "DELETE" }));
  if (!result.ok) return { ok: false as const, error: result.error };
  redirect("/admin/messages");
}

export async function listMedia() {
  const result = guard(await api<{ items: MediaItem[] }>("/api/media"));
  return result.ok ? result.data.items : [];
}

export async function uploadMedia(formData: FormData) {
  const result = guard(await api<MediaItem>("/api/media", { method: "POST", body: formData }));
  return result.ok ? { ok: true as const, item: result.data } : { ok: false as const, error: result.error };
}

export async function updateMediaAlt(id: number, alt: string) {
  const result = guard(await api<MediaItem>(`/api/media/${id}`, { method: "PATCH", body: JSON.stringify({ alt }) }));
  return result.ok ? { ok: true as const, item: result.data } : { ok: false as const, error: result.error };
}

export async function deleteMedia(id: number) {
  const result = guard(await api(`/api/media/${id}`, { method: "DELETE" }));
  return result.ok ? { ok: true as const } : { ok: false as const, error: result.error };
}

export async function searchIcons(q: string, source: "brands" | "lucide") {
  const params = new URLSearchParams({ q, source });
  const result = guard(await api<{ items: IconResult[]; total: number }>(`/api/icons?${params}`));
  return result.ok ? result.data : { items: [], total: 0 };
}
