import Link from "next/link";
import { pageHref } from "@/lib/blog";
import { ChevronIcon } from "@/components/ui";

/** Page numbers with gaps, like 1 … 4 5 6 … 12. */
function pageList(current: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const pages: (number | "gap")[] = [];
  for (let page = 1; page <= total; page++) {
    if (keep.has(page)) pages.push(page);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }
  return pages;
}

const step =
  "group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/20 px-5 text-sm transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink";
const stepDisabled = "inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/10 px-5 text-sm text-paper/30";

export function BlogPagination({
  current,
  total,
  newerLabel,
  olderLabel,
}: {
  current: number;
  total: number;
  newerLabel: string;
  olderLabel: string;
}) {
  if (total <= 1) return null;
  const count = (value: number) => String(value).padStart(2, "0");

  return (
    <nav aria-label="Pagination" className="mt-20 border-t border-line pt-8 sm:mt-24">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6 sm:justify-between">
        {current > 1 ? (
          <Link href={pageHref(current - 1)} rel="prev" className={`${step} order-2 sm:order-1`}>
            <ChevronIcon />
            {newerLabel}
          </Link>
        ) : (
          <span aria-hidden className={`${stepDisabled} order-2 hidden sm:order-1 sm:inline-flex`}>
            <ChevronIcon />
            {newerLabel}
          </span>
        )}

        <ol className="order-1 flex w-full items-center justify-center gap-1.5 sm:order-2 sm:w-auto">
          {pageList(current, total).map((page, index) =>
            page === "gap" ? (
              <li key={`gap-${index}`} aria-hidden className="w-8 text-center text-paper/40">
                …
              </li>
            ) : (
              <li key={page}>
                <Link
                  href={pageHref(page)}
                  aria-current={page === current ? "page" : undefined}
                  aria-label={`Page ${page}`}
                  className={`grid h-12 w-12 place-items-center rounded-full text-sm tabular-nums transition-colors duration-300 ${
                    page === current ? "bg-lime font-medium text-ink" : "text-paper/70 hover:bg-white/[0.06] hover:text-paper"
                  }`}
                >
                  {count(page)}
                </Link>
              </li>
            ),
          )}
        </ol>

        {current < total ? (
          <Link href={pageHref(current + 1)} rel="next" className={`${step} order-3`}>
            {olderLabel}
            <ChevronIcon flip />
          </Link>
        ) : (
          <span aria-hidden className={`${stepDisabled} order-3 hidden sm:inline-flex`}>
            {olderLabel}
            <ChevronIcon flip />
          </span>
        )}
      </div>
      <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-muted">
        {count(current)} / {count(total)}
      </p>
    </nav>
  );
}
