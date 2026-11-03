import type { Metadata } from "next";
import Link from "next/link";
import { card, formatDate, PageHeader, StatusBadge } from "@/components/admin/ui";
import { load, messageStatuses, statusLabels, type Message, type MessageStatus } from "@/lib/admin";

export const metadata: Metadata = { title: "Overview" };

type Stats = { byStatus: Record<MessageStatus, number>; total: number; recent: Message[] };

export default async function OverviewPage() {
  const stats = await load<Stats>("/api/messages/stats");

  return (
    <>
      <PageHeader title="Overview" intro="New messages, and quick links to everything on the site." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {messageStatuses.map((status) => (
          <Link
            key={status}
            href={`/admin/messages?status=${status}`}
            className={`${card} p-4 transition-colors hover:border-paper/30 sm:p-5`}
          >
            <p className="text-[12px] uppercase tracking-[0.14em] text-paper/55">{statusLabels[status]}</p>
            <p className={`mt-3 font-serif text-4xl leading-none ${status === "new" && stats.byStatus.new ? "text-lime" : ""}`}>
              {stats.byStatus[status]}
            </p>
          </Link>
        ))}
      </div>

      <section className={`${card} mt-8`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-medium">Latest messages</h2>
          <Link href="/admin/messages" className="-my-2 inline-flex min-h-10 items-center text-sm text-paper/60 hover:text-paper">
            All {stats.total} →
          </Link>
        </div>
        {stats.recent.length ? (
          <ul>
            {stats.recent.map((message) => (
              <li key={message.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{message.name}</span>
                    <span className="block truncate text-sm text-paper/55">{message.message}</span>
                  </span>
                  <span className="flex items-center gap-3 text-[13px] text-paper/45">
                    <StatusBadge status={message.status} />
                    {formatDate(message.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-paper/50">No messages yet. They show up here when someone uses the contact form.</p>
        )}
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/content", title: "Edit content", text: "Every text, image, link, and section on the site." },
          { href: "/admin/content/seo", title: "SEO", text: "Titles, descriptions, share image, and indexing." },
          { href: "/admin/media", title: "Media", text: "Upload photos, logos, icons, and the CV." },
        ].map((link) => (
          <Link key={link.href} href={link.href} className={`${card} p-5 transition-colors hover:border-lime/50`}>
            <p className="font-medium">{link.title} →</p>
            <p className="mt-1.5 text-sm text-paper/55">{link.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
