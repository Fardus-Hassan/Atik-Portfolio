import type { Metadata } from "next";
import Link from "next/link";
import { card, formatDate, input, PageHeader, StatusBadge } from "@/components/admin/ui";
import { load, messageStatuses, statusLabels, type Message, type MessageStatus } from "@/lib/admin";

export const metadata: Metadata = { title: "Messages" };

type List = { items: Message[]; total: number; page: number; pageSize: number };
type Stats = { byStatus: Record<MessageStatus, number>; total: number };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const status = messageStatuses.find((value) => value === params.status);
  const q = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const query = new URLSearchParams({ page: String(page), pageSize: "20" });
  if (status) query.set("status", status);
  if (q) query.set("q", q);

  const [list, stats] = await Promise.all([load<List>(`/api/messages?${query}`), load<Stats>("/api/messages/stats")]);
  const pages = Math.max(1, Math.ceil(list.total / list.pageSize));

  const href = (next: { status?: string; page?: number }) => {
    const value = new URLSearchParams();
    const nextStatus = "status" in next ? next.status : status;
    if (nextStatus) value.set("status", nextStatus);
    if (q) value.set("q", q);
    if (next.page && next.page > 1) value.set("page", String(next.page));
    const text = value.toString();
    return `/admin/messages${text ? `?${text}` : ""}`;
  };

  const tabs = [{ key: undefined, label: "All", count: stats.total }, ...messageStatuses.map((key) => ({ key, label: statusLabels[key], count: stats.byStatus[key] }))];

  return (
    <>
      <PageHeader title="Messages" intro="Everything sent through the contact form. Open one to change its status or add a note." />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const on = tab.key === status;
          return (
            <Link
              key={tab.label}
              href={href({ status: tab.key, page: 1 })}
              className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                on ? "border-lime bg-lime text-ink" : "border-paper/15 text-paper/70 hover:border-paper/40"
              }`}
            >
              {tab.label}
              <span className={`tabular-nums ${on ? "text-ink/60" : "text-paper/40"}`}>{tab.count}</span>
            </Link>
          );
        })}
      </div>

      <form action="/admin/messages" className="mt-4 flex gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <input name="q" defaultValue={q} placeholder="Search name, email, company, or message" className={input} />
        <button type="submit" className="shrink-0 rounded-xl border border-paper/20 px-4 text-sm hover:border-paper/50">
          Search
        </button>
      </form>

      <section className={`${card} mt-6 overflow-hidden`}>
        {list.items.length ? (
          <ul>
            {list.items.map((message) => (
              <li key={message.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/admin/messages/${message.id}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-white/[0.03] md:flex-row md:items-center md:gap-6"
                >
                  <span className="min-w-0 md:w-56 md:shrink-0">
                    <span className={`block truncate ${message.status === "new" ? "font-semibold" : "font-medium"}`}>{message.name}</span>
                    <span className="block truncate text-sm text-paper/50">{message.email}</span>
                  </span>
                  <span className="line-clamp-2 min-w-0 flex-1 text-sm text-paper/65">{message.message}</span>
                  <span className="flex shrink-0 items-center gap-3 text-[13px] text-paper/45">
                    <StatusBadge status={message.status} />
                    {formatDate(message.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-14 text-center text-paper/50">{q || status ? "No messages match this filter." : "No messages yet."}</p>
        )}
      </section>

      {pages > 1 ? (
        <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Pages">
          {page > 1 ? (
            <Link href={href({ page: page - 1 })} className="min-h-10 rounded-full border border-paper/20 px-4 py-2.5 hover:border-paper/50">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-paper/50">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link href={href({ page: page + 1 })} className="min-h-10 rounded-full border border-paper/20 px-4 py-2.5 hover:border-paper/50">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}
