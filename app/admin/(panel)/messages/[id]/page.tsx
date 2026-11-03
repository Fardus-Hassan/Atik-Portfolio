import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MessageActions } from "@/components/admin/message-actions";
import { card, formatDate } from "@/components/admin/ui";
import { api, type Message } from "@/lib/admin";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await api<Message>(`/api/messages/${Number(id)}`);
  if (!result.ok) {
    if (result.status === 401) redirect("/admin/login");
    if (result.status === 404) notFound();
    throw new Error(result.error);
  }
  const message = result.data;
  const subject = encodeURIComponent(`Re: your note${message.company ? ` from ${message.company}` : ""}`);

  return (
    <>
      <Link href="/admin/messages" className="-my-2 inline-flex min-h-10 items-center text-sm text-paper/55 hover:text-paper">
        ← All messages
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <article className={`${card} p-5 sm:p-7`}>
          <p className="text-[13px] text-paper/45">{formatDate(message.createdAt)}</p>
          <h1 className="mt-2 font-serif text-[clamp(2rem,4vw,2.6rem)] leading-tight tracking-[-0.02em]">{message.name}</h1>
          <dl className="mt-6 grid gap-4 border-y border-line py-5 text-sm sm:grid-cols-2">
            <Detail label="Email">
              <a href={`mailto:${message.email}`} className="break-all text-lime underline-offset-4 hover:underline">
                {message.email}
              </a>
            </Detail>
            <Detail label="Phone">
              {message.phone ? (
                <a href={`tel:${message.phone}`} className="hover:underline">
                  {message.phone}
                </a>
              ) : (
                "—"
              )}
            </Detail>
            <Detail label="Company">{message.company || "—"}</Detail>
            <Detail label="Last update">{formatDate(message.updatedAt)}</Detail>
          </dl>
          <p className="mt-6 whitespace-pre-wrap text-[17px] leading-relaxed text-paper/90">{message.message}</p>
          <a
            href={`mailto:${message.email}?subject=${subject}`}
            className="mt-8 inline-flex min-h-10 items-center gap-2 rounded-full bg-lime px-5 text-sm font-medium text-ink hover:bg-paper"
          >
            Reply by email →
          </a>
        </article>

        <MessageActions message={message} />
      </div>
    </>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-paper/45">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
