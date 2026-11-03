"use server";

import { headers } from "next/headers";
import { API_URL } from "@/lib/site";

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  website: string;
};

export type ContactResult = { ok: true } | { ok: false; error: string; fields?: Record<string, string[]> };

export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const incoming = await headers();
  const forwardedFor = incoming.get("x-forwarded-for") ?? incoming.get("x-real-ip") ?? "";

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": incoming.get("user-agent") ?? "",
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
      },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return { ok: true };
    const body = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string[]> };
    return { ok: false, error: body.error ?? "Could not send the message.", fields: body.fields };
  } catch {
    return { ok: false, error: "Could not reach the server." };
  }
}
