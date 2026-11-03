"use client";

import { useEffect, useState } from "react";
import { searchIcons } from "@/app/admin/actions";
import { MediaPicker, Modal } from "@/components/admin/media-picker";
import { buttonGhost, input } from "@/components/admin/ui";
import { SocialIcon } from "@/components/social-icon";
import type { IconResult } from "@/lib/admin-types";
import type { Icon } from "@/lib/content";

export function IconField({ value, onChange }: { value: Icon; onChange: (value: Icon) => void }) {
  const [mode, setMode] = useState<"library" | "upload" | null>(null);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-paper/20 text-paper">
        {value ? <SocialIcon platform="" icon={value} size={22} /> : <span className="text-[11px] text-paper/45">Built-in</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-paper/70">
          {value ? `${value.kind === "svg" ? "Library" : "Uploaded"}: ${value.name}` : "Using the built-in icon for this platform."}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode("library")} className={buttonGhost}>
            Icon library
          </button>
          <button type="button" onClick={() => setMode("upload")} className={buttonGhost}>
            Upload SVG / PNG
          </button>
          {value ? (
            <button type="button" onClick={() => onChange(null)} className="min-h-10 px-2 text-sm text-paper/50 hover:text-[#e2b1a8]">
              Use built-in
            </button>
          ) : null}
        </div>
      </div>

      {mode === "library" ? (
        <IconLibrary
          onClose={() => setMode(null)}
          onPick={(icon) => {
            onChange({ kind: "svg", name: icon.name, viewBox: icon.viewBox, body: icon.body, mode: icon.mode });
            setMode(null);
          }}
        />
      ) : null}
      {mode === "upload" ? (
        <MediaPicker
          kind="image"
          onClose={() => setMode(null)}
          onPick={(item) => {
            onChange({ kind: "image", name: item.originalName, src: item.url });
            setMode(null);
          }}
        />
      ) : null}
    </div>
  );
}

function IconLibrary({ onPick, onClose }: { onPick: (icon: IconResult) => void; onClose: () => void }) {
  const [source, setSource] = useState<"brands" | "lucide">("brands");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ items: IconResult[]; total: number } | null>(null);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      searchIcons(query, source).then((data) => alive && setResult(data));
    }, 200);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [query, source]);

  return (
    <Modal title="Icon library" onClose={onClose}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex shrink-0 gap-1 rounded-full border border-paper/15 p-1">
          {(
            [
              ["brands", "Brands"],
              ["lucide", "Outline"],
            ] as const
          ).map(([key, text]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSource(key)}
              className={`min-h-9 rounded-full px-4 text-sm ${source === key ? "bg-lime text-ink" : "text-paper/65 hover:text-paper"}`}
            >
              {text}
            </button>
          ))}
        </div>
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={source === "brands" ? "Search brands: telegram, github, behance…" : "Search icons: mail, phone, globe…"}
          className={input}
        />
      </div>
      <p className="mt-3 text-[13px] text-paper/45">
        {result ? `${result.total} found${result.total > result.items.length ? `, showing ${result.items.length}` : ""}.` : "Searching…"}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
        {result?.items.map((icon) => (
          <button
            key={`${icon.source}-${icon.name}`}
            type="button"
            onClick={() => onPick(icon)}
            title={icon.name}
            className="flex flex-col items-center gap-2 rounded-xl border border-line px-2 py-4 text-paper/80 transition-colors hover:border-lime hover:text-lime"
          >
            <SocialIcon platform="" icon={{ kind: "svg", ...icon }} size={24} />
            <span className="w-full truncate text-center text-[11px] text-paper/50">{icon.name}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
