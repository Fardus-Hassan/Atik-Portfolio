"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const items: { href: string; label: string; icon: ReactNode; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", icon: icon("M3 12l9-8 9 8M5 10v10h14V10"), exact: true },
  { href: "/admin/messages", label: "Messages", icon: icon("M4 5h16v12H8l-4 3z") },
  { href: "/admin/content", label: "Content", icon: icon("M4 4h16v16H4zM4 9h16M9 9v11") },
  { href: "/admin/media", label: "Media", icon: icon("M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01") },
  { href: "/admin/settings", label: "Settings", icon: icon("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2") },
];

export function Sidebar() {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-30 border-b border-line bg-ink/95 backdrop-blur-md lg:h-[100svh] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3 sm:px-8 lg:px-6 lg:py-8">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl leading-none tracking-[-0.03em]">Atik</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-lime">Dashboard</span>
          </Link>
          <div className="flex items-center gap-1 lg:hidden">
            <a href="/" target="_blank" rel="noreferrer" className="min-h-10 px-2 py-2 text-sm text-paper/60">
              Site ↗
            </a>
            <form action={logout}>
              <button type="submit" className="min-h-10 px-2 text-sm text-paper/60">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] sm:px-7 lg:flex-col lg:px-3 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const on = active(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-10 shrink-0 items-center gap-3 rounded-full px-4 text-sm transition-colors lg:rounded-xl ${
                  on ? "bg-lime text-ink" : "text-paper/70 hover:bg-white/[0.05] hover:text-paper"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden flex-col gap-1 border-t border-line p-3 lg:flex">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-10 items-center rounded-xl px-4 text-sm text-paper/60 hover:bg-white/[0.05] hover:text-paper"
          >
            View site ↗
          </a>
          <form action={logout}>
            <button
              type="submit"
              className="flex min-h-10 w-full items-center rounded-xl px-4 text-left text-sm text-paper/60 hover:bg-white/[0.05] hover:text-paper"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
