"use client";

import { useRouter } from "next/navigation";

export function BackButton({ label, className }: { label: string; className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className={className ?? "inline-flex min-h-11 items-center gap-2 text-sm tracking-wide"}
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}
