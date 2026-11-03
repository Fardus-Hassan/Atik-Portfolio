"use client";

import { useRef, useState, useTransition } from "react";
import { deleteMedia, updateMediaAlt, uploadMedia } from "@/app/admin/actions";
import { buttonPrimary, card, input } from "@/components/admin/ui";
import type { MediaItem } from "@/lib/admin-types";

const size = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`);

export function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const [savedAlt, setSavedAlt] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, start] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const upload = (files: FileList | File[]) =>
    start(async () => {
      setError("");
      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append("file", file);
        const result = await uploadMedia(data);
        if (!result.ok) {
          setError(`${file.name}: ${result.error}`);
          continue;
        }
        setItems((current) => [result.item, ...current]);
      }
    });

  const remove = (item: MediaItem) => {
    if (!window.confirm(`Delete ${item.originalName}? Pages using it will show an empty image.`)) return;
    start(async () => {
      const result = await deleteMedia(item.id);
      if (!result.ok) return setError(result.error);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    });
  };

  const saveAlt = (item: MediaItem, alt: string) => {
    if (alt === item.alt) return;
    start(async () => {
      const result = await updateMediaAlt(item.id, alt);
      if (!result.ok) return setError(result.error);
      setItems((current) => current.map((entry) => (entry.id === item.id ? result.item : entry)));
      setSavedAlt(item.id);
      window.setTimeout(() => setSavedAlt((current) => (current === item.id ? null : current)), 1500);
    });
  };

  const copy = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
    } catch {
      // The Clipboard API needs HTTPS and a focused page; fall back to the old copy command.
      const field = document.createElement("textarea");
      field.value = item.url;
      document.body.append(field);
      field.select();
      const done = document.execCommand("copy");
      field.remove();
      if (!done) return setError(`Copy failed. The link is ${item.url}`);
    }
    setCopied(item.id);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length) upload(event.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center transition-colors ${
          dragging ? "border-lime bg-lime/5" : "border-paper/25"
        }`}
      >
        <p className="text-paper/70">Drop files here, or</p>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,application/pdf"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) upload(event.target.files);
            event.target.value = "";
          }}
        />
        <button type="button" onClick={() => fileInput.current?.click()} disabled={pending} className={buttonPrimary}>
          {pending ? "Working…" : "Choose files"}
        </button>
        <p className="text-[13px] text-paper/45">JPG, PNG, WebP, AVIF, GIF, SVG, PDF. Up to 15 MB each.</p>
      </div>
      {error ? <p className="mt-3 text-sm text-[#e2b1a8]">{error}</p> : null}

      {items.length ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className={`${card} overflow-hidden`}>
              <div className="grid aspect-[4/3] place-items-center bg-[repeating-conic-gradient(#1a1a17_0%_25%,#121210_0%_50%)] bg-[length:16px_16px]">
                {item.mime.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element -- uploaded file preview
                  <img src={item.url} alt={item.alt} className="h-full w-full object-contain" />
                ) : (
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-lime underline-offset-4 hover:underline">
                    Open PDF ↗
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <span className="shrink-0 text-[12px] text-paper/45">{size(item.size)}</span>
                </div>
                {item.mime.startsWith("image/") ? (
                  <div className="relative">
                    <input
                      defaultValue={item.alt}
                      placeholder="Describe the image (alt text)"
                      aria-label={`Alt text for ${item.originalName}`}
                      onBlur={(event) => saveAlt(item, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.currentTarget.blur();
                      }}
                      className={`${input} py-2 pr-16 text-sm`}
                    />
                    {savedAlt === item.id ? (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-lime">Saved</span>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(item)}
                    className="min-h-9 flex-1 rounded-full border border-paper/20 px-3 text-[13px] hover:border-paper/50"
                  >
                    {copied === item.id ? "Copied" : "Copy link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="min-h-9 rounded-full border border-[#e2b1a8]/30 px-3 text-[13px] text-[#e2b1a8] hover:bg-[#e2b1a8]/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-paper/50">No files yet.</p>
      )}
    </>
  );
}
