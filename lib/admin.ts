import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/site";

export * from "@/lib/admin-types";

export const ADMIN_COOKIE = "atik_admin";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; issues?: { path: (string | number)[]; message: string }[] };

export async function adminToken() {
  return (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
}

export async function api<T>(path: string, init: RequestInit = {}, token?: string): Promise<ApiResult<T>> {
  const auth = token ?? (await adminToken());
  const headers = new Headers(init.headers);
  if (auth) headers.set("authorization", `Bearer ${auth}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("content-type", "application/json");

  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (response.ok) return { ok: true, data: body as T };
    return { ok: false, status: response.status, error: body.error ?? "Request failed.", issues: body.issues };
  } catch {
    return { ok: false, status: 503, error: "The API is not reachable. Is the server running?" };
  }
}

/** For pages: returns the data or sends the visitor to the login page. */
export async function load<T>(path: string): Promise<T> {
  const result = await api<T>(path);
  if (result.ok) return result.data;
  if (result.status === 401) redirect("/admin/login");
  throw new Error(result.error);
}
