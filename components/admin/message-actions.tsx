"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMessage, updateMessage } from "@/app/admin/actions";
import { buttonDanger, buttonGhost, card, input, label } from "@/components/admin/ui";
import { messageStatuses, statusLabels, type Message, type MessageStatus } from "@/lib/admin-types";

export function MessageActions({ message }: { message: Message }) {
  const router = useRouter();
  const [status, setStatus] = useState<MessageStatus>(message.status);
  const [note, setNote] = useState(message.note);
  const [savedNote, setSavedNote] = useState(message.note);
  const [feedback, setFeedback] = useState("");
  const [pending, start] = useTransition();

  const changeStatus = (next: MessageStatus) => {
    const previous = status;
    setStatus(next);
    start(async () => {
      const result = await updateMessage(message.id, { status: next });
      if (!result.ok) {
        setStatus(previous);
        setFeedback(result.error);
        return;
      }
      setFeedback(`Marked as ${statusLabels[next].toLowerCase()}.`);
      router.refresh();
    });
  };

  const saveNote = () =>
    start(async () => {
      const result = await updateMessage(message.id, { note });
      if (!result.ok) return setFeedback(result.error);
      setSavedNote(note);
      setFeedback("Note saved.");
    });

  const remove = () => {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    start(async () => {
      const result = await deleteMessage(message.id);
      if (result && !result.ok) setFeedback(result.error);
    });
  };

  return (
    <aside className="flex flex-col gap-4">
      <div className={`${card} p-5`}>
        <p className={label}>Status</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {messageStatuses.map((value) => (
            <button
              key={value}
              type="button"
              disabled={pending}
              onClick={() => value !== status && changeStatus(value)}
              aria-pressed={value === status}
              className={`min-h-10 rounded-xl border px-3 text-sm transition-colors ${
                value === status ? "border-lime bg-lime text-ink" : "border-paper/15 text-paper/75 hover:border-paper/40"
              }`}
            >
              {statusLabels[value]}
            </button>
          ))}
        </div>
      </div>

      <div className={`${card} p-5`}>
        <label htmlFor="note" className={label}>
          Private note
        </label>
        <textarea
          id="note"
          rows={5}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Only you see this."
          className={`${input} resize-y`}
        />
        <button type="button" onClick={saveNote} disabled={pending || note === savedNote} className={`${buttonGhost} mt-3 w-full`}>
          Save note
        </button>
      </div>

      <p className="min-h-5 text-sm text-paper/60" aria-live="polite">
        {feedback}
      </p>

      <button type="button" onClick={remove} disabled={pending} className={buttonDanger}>
        Delete message
      </button>
    </aside>
  );
}
