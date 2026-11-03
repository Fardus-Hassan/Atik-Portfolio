"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { resetSection, saveSection } from "@/app/admin/actions";
import { ErrorsContext, SchemaField, type JsonSchema } from "@/components/admin/schema-form";
import { buttonGhost, buttonPrimary } from "@/components/admin/ui";

type Issue = { path: (string | number)[]; message: string };

export function SectionEditor({
  sectionKey,
  schema,
  initial,
  customized,
}: {
  sectionKey: string;
  schema: JsonSchema;
  initial: unknown;
  customized: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [isCustom, setIsCustom] = useState(customized);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [feedback, setFeedback] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(value) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const saveRef = useRef<() => void>(() => {});
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const errors = useMemo(() => new Map(issues.map((issue) => [issue.path.join("."), issue.message])), [issues]);

  const save = () =>
    start(async () => {
      const result = await saveSection(sectionKey, value);
      if (!result.ok) {
        setIssues(result.issues ?? []);
        setFeedback({ tone: "error", text: result.error });
        return;
      }
      setIssues([]);
      setValue(result.data);
      setSaved(JSON.stringify(result.data));
      setIsCustom(true);
      setFeedback({ tone: "ok", text: "Saved. The live site is updated." });
    });

  useEffect(() => {
    saveRef.current = () => {
      if (dirty && !pending) save();
    };
  });

  const reset = () => {
    if (!window.confirm("Replace this section with the original content? Your edits here will be lost.")) return;
    start(async () => {
      const result = await resetSection(sectionKey);
      if (!result.ok) return setFeedback({ tone: "error", text: result.error });
      setIssues([]);
      setValue(result.data);
      setSaved(JSON.stringify(result.data));
      setIsCustom(false);
      setFeedback({ tone: "ok", text: "Restored the original content." });
    });
  };

  return (
    <ErrorsContext value={errors}>
      <div className="flex flex-col gap-6 pb-28">
        <SchemaField schema={{ ...schema, title: undefined }} value={value} onChange={setValue} path={[]} name={sectionKey} />

        {issues.length ? (
          <div className="rounded-2xl border border-[#e2b1a8]/40 p-4 text-sm text-[#e2b1a8]">
            <p className="font-medium">Fix these before saving:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {issues.slice(0, 8).map((issue, index) => (
                <li key={index}>
                  {issue.path.length ? <span className="text-paper/60">{issue.path.join(" › ")}: </span> : null}
                  {issue.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 backdrop-blur-md lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 lg:px-12">
          <p
            className={`min-w-0 flex-1 text-sm ${feedback?.tone === "error" ? "text-[#e2b1a8]" : dirty ? "text-[#f3c969]" : "text-paper/55"}`}
            aria-live="polite"
          >
            {feedback?.tone === "error"
              ? feedback.text
              : dirty
                ? "Unsaved changes"
                : (feedback?.text ?? (isCustom ? "Saved content is live." : "Showing the original content."))}
          </p>
          {isCustom ? (
            <button type="button" onClick={reset} disabled={pending} className={buttonGhost}>
              Restore original
            </button>
          ) : null}
          {dirty ? (
            <button
              type="button"
              onClick={() => {
                setValue(JSON.parse(saved));
                setIssues([]);
                setFeedback(null);
              }}
              disabled={pending}
              className={buttonGhost}
            >
              Discard
            </button>
          ) : null}
          <button type="button" onClick={save} disabled={pending || !dirty} title="Ctrl + S" className={buttonPrimary}>
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </ErrorsContext>
  );
}
