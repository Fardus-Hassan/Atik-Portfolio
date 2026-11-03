import type { ReactNode } from "react";
import { statusLabels, type MessageStatus } from "@/lib/admin-types";

export const card = "rounded-2xl border border-line bg-white/[0.02]";
export const input =
  "w-full rounded-xl border border-paper/15 bg-ink px-3.5 py-2.5 text-[15px] text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-lime/70";
export const label = "mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-paper/55";
export const buttonPrimary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-lime px-5 text-sm font-medium text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50";
export const buttonGhost =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-paper/20 px-4 text-sm text-paper transition-colors hover:border-paper/50 disabled:cursor-not-allowed disabled:opacity-50";
export const buttonDanger =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#e2b1a8]/40 px-4 text-sm text-[#e2b1a8] transition-colors hover:bg-[#e2b1a8] hover:text-ink disabled:opacity-50";

const statusTone: Record<MessageStatus, string> = {
  new: "bg-lime text-ink",
  in_progress: "bg-[#f3c969] text-ink",
  replied: "bg-[#8ec5ff] text-ink",
  closed: "bg-paper/15 text-paper/80",
  spam: "bg-[#e2b1a8]/20 text-[#e2b1a8]",
};

export function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusTone[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function PageHeader({ title, intro, actions }: { title: string; intro?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-[clamp(2rem,4vw,2.8rem)] leading-none tracking-[-0.03em]">{title}</h1>
        {intro ? <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-paper/60">{intro}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
