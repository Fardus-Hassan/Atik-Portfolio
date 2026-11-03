"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { buttonPrimary, input, label } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="mt-10 flex flex-col gap-5">
      <div>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state?.email} className={input} />
      </div>
      <div>
        <label htmlFor="password" className={label}>
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      {state?.error ? (
        <p role="alert" className="text-sm text-[#e2b1a8]">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={`${buttonPrimary} mt-2 w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
