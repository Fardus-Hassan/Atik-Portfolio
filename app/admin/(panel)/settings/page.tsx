import type { Metadata } from "next";
import { PasswordForm } from "@/components/admin/password-form";
import { card, PageHeader } from "@/components/admin/ui";
import { load } from "@/lib/admin";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { admin } = await load<{ admin: { email: string } }>("/api/auth/me");
  return (
    <>
      <PageHeader title="Settings" intro={`Signed in as ${admin.email}.`} />
      <section className={`${card} max-w-lg p-5 sm:p-7`}>
        <h2 className="text-lg font-medium">Change password</h2>
        <p className="mt-1 text-sm text-paper/55">Other signed-in devices are signed out when the password changes.</p>
        <PasswordForm />
      </section>
    </>
  );
}
