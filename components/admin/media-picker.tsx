"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { listMedia, uploadMedia } from "@/app/admin/actions";
import { buttonGhost, buttonPrimary, input } from "@/components/admin/ui";
import type { MediaItem } from "@/lib/admin-types";

type Kind = "image" | "file";

const accept: Record<Kind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml",
  file: "application/pdf,image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml",
};

export const isImage = (url: string) => /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(url) || url.startsWith("data:image");

export function MediaField({ value, onChange, kind }: { value: string; onChange: (value: string) => void; kind: Kind }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="grid h-20 w-full shrink-0 place-items-center overflow-hidden rounded-xl border border-paper/15 bg-[repeating-conic-gradient(#1a1a17_0%_25%,#121210_0%_50%)] bg-[length:16px_16px] sm:w-28">
        {value && isImage(value) ? (
          // eslint-disable-next-line @next/next/no-img-element -- previews of uploaded and public files
          <img src={value} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="px-2 text-center text-[12px] text-paper/45">{value ? value.split(".").pop()?.toUpperCase() : "Empty"}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="/uploads/… or https://…" className={input} />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setOpen(true)} className={buttonGhost}>
            {kind === "image" ? "Choose image" : "Choose file"}
          </button>
          {value ? (
            <button type="button" onClick={() => onChange("")} className="min-h-10 px-2 text-sm text-paper/50 hover:text-[#e2b1a8]">
              Clear
            </button>
          ) : null}
        </div>
      </div>
      {open ? (
        <MediaPicker
          kind={kind}
          onClose={() => setOpen(false)}
          onPick={(item) => {
            onChange(item.url);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

export function MediaPicker({ kind, onPick, onClose }: { kind: Kind; onPick: (item: MediaItem) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    listMedia().then((result) => alive && setItems(result));
    return () => {
      alive = false;
    };
  }, []);

  const upload = (file: File) =>
    start(async () => {
      setError("");
      const data = new FormData();
      data.append("file", file);
      const result = await uploadMedia(data);
      if (!result.ok) return setError(result.error);
      onPick(result.item);
    });

  const shown = (items ?? []).filter((item) => kind === "file" || item.mime.startsWith("image/"));

  return (
    <Modal title={kind === "image" ? "Choose an image" : "Choose a file"} onClose={onClose}>
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInput}
          type="file"
          accept={accept[kind]}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.target.value = "";
          }}
        />
        <button type="button" onClick={() => fileInput.current?.click()} disabled={pending} className={buttonPrimary}>
          {pending ? "Uploading…" : "Upload new"}
        </button>
        <span className="text-[13px] text-paper/45">JPG, PNG, WebP, AVIF, GIF, SVG{kind === "file" ? ", PDF" : ""}. Up to 15 MB.</span>
      </div>
      {error ? <p className="mt-3 text-sm text-[#e2b1a8]">{error}</p> : null}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items === null ? (
          <p className="col-span-full py-10 text-center text-paper/50">Loading…</p>
        ) : shown.length ? (
          shown.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item)}
              className="group overflow-hidden rounded-xl border border-line text-left transition-colors hover:border-lime"
            >
              <span className="grid aspect-square place-items-center bg-[repeating-conic-gradient(#1a1a17_0%_25%,#121210_0%_50%)] bg-[length:16px_16px]">
                {item.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element -- uploaded file preview
                  <img src={item.url} alt={item.alt} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-sm text-paper/60">PDF</span>
                )}
              </span>
              <span className="block truncate px-2.5 py-2 text-[12px] text-paper/60 group-hover:text-paper">{item.originalName}</span>
            </button>
          ))
        ) : (
          <p className="col-span-full py-10 text-center text-paper/50">Nothing uploaded yet.</p>
        )}
      </div>
    </Modal>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[88svh] w-full max-w-3xl flex-col rounded-t-3xl border border-line bg-ink sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button type="button" onClick={onClose} className="min-h-10 px-2 text-sm text-paper/60 hover:text-paper">
            Close
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
