"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/actions";
import { buttonPrimary, input, label } from "@/components/admin/ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {[
        ["current", "Current password", "current-password"],
        ["next", "New password", "new-password"],
        ["confirm", "Repeat new password", "new-password"],
      ].map(([name, text, autoComplete]) => (
        <div key={name}>
          <label htmlFor={name} className={label}>
            {text}
          </label>
          <input id={name} name={name} type="password" required minLength={name === "current" ? 1 : 8} autoComplete={autoComplete} className={input} />
        </div>
      ))}
      {state?.error ? <p role="alert" className="text-sm text-[#e2b1a8]">{state.error}</p> : null}
      {state?.done ? <p role="status" className="text-sm text-lime">Password changed.</p> : null}
      <button type="submit" disabled={pending} className={`${buttonPrimary} self-start`}>
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
