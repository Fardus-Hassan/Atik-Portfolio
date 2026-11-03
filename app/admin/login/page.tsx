import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="text-[11px] uppercase tracking-[0.24em] text-lime">Atik · Dashboard</p>
        <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.03em]">Sign in</h1>
        <p className="mt-3 text-[15px] text-paper/60">Manage the site, messages, and files.</p>
        <LoginForm />
      </div>
    </main>
  );
}
