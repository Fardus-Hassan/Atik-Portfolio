"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content";
import { gutter, SectionLabel } from "@/components/ui";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function Contact({
  contact,
  email,
}: {
  contact: SiteContent["contact"];
  email: string;
}) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const emailValue = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = contact.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) next.email = contact.errors.email;
    if (!message) next.message = contact.errors.message;
    setErrors(next);
    if (Object.keys(next).length) return;
    // The Express endpoint will receive this payload later.
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-24 md:py-32">
      <div className={gutter}>
        <div className="overflow-hidden rounded-[1.4rem] border border-line sm:rounded-[1.8rem] lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 p-5 sm:gap-12 sm:p-7 md:p-12 lg:p-14">
            <div>
              <SectionLabel index={contact.index} label={contact.label} />
              <h2 className="mt-6 max-w-[12ch] font-serif text-[clamp(2.4rem,9vw,5.2rem)] leading-[0.95] tracking-[-0.03em]">
                {contact.title}
              </h2>
              <p className="mt-6 max-w-sm text-lg leading-relaxed text-paper/75">{contact.lede}</p>
            </div>
            <div>
              <a href={`mailto:${email}`} className="text-xl underline decoration-paper/30 underline-offset-4 md:text-2xl">
                {email}
              </a>
              <ul className="mt-8 space-y-2 text-sm text-muted">
                {contact.notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span className="text-paper/35">+</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-line p-5 sm:p-7 md:p-12 lg:border-l lg:border-t-0 lg:p-14">
            {sent ? (
              <div className="flex h-full min-h-80 flex-col justify-end">
                <p className="font-serif text-5xl leading-none md:text-6xl">{contact.successTitle}</p>
                <p className="mt-4 max-w-sm text-lg text-paper/75">{contact.successBody}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label={contact.fields.name.label} error={errors.name}>
                    <input
                      name="name"
                      placeholder={contact.fields.name.placeholder}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label={contact.fields.email.label} error={errors.email}>
                    <input
                      name="email"
                      type="email"
                      placeholder={contact.fields.email.placeholder}
                      autoComplete="email"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label={contact.fields.phone.label}>
                    <input
                      name="phone"
                      type="tel"
                      placeholder={contact.fields.phone.placeholder}
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </Field>
                  <Field label={contact.fields.company.label}>
                    <input
                      name="company"
                      placeholder={contact.fields.company.placeholder}
                      autoComplete="organization"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label={contact.fields.message.label} error={errors.message}>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={contact.fields.message.placeholder}
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <button
                  type="submit"
                  className="mt-2 inline-flex min-h-11 w-fit items-center rounded-full border border-paper/25 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  {contact.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "mt-2 w-full border-b border-paper/20 bg-transparent py-3 text-lg text-paper outline-none placeholder:text-paper/30 focus:border-paper/70";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-[#e2b1a8]">{error}</span> : null}
    </label>
  );
}
