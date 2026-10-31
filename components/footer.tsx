import type { SiteContent } from "@/lib/content";
import { gutter } from "@/components/ui";

export function Footer({ content }: { content: SiteContent }) {
  const { profile, footer, socials } = content;
  return (
    <footer className={`${gutter} pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4`}>
      <p className="overflow-hidden whitespace-nowrap font-serif leading-[0.8] tracking-[-0.06em] text-[clamp(3.25rem,18vw,14rem)] text-paper/[0.09]">
        {profile.mark}
      </p>
      <div className="mt-2 flex flex-col gap-5 border-t border-line pt-6 sm:pt-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-md text-2xl tracking-tight sm:text-3xl md:text-4xl">{footer.line}</p>
        <a href={`mailto:${profile.email}`} className="break-all text-lg underline decoration-paper/30 underline-offset-4 sm:break-normal md:text-2xl">
          {profile.email}
        </a>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <p>
          © {profile.year} {profile.name}. {footer.rights}
        </p>
        <ul className="flex gap-2">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-paper/50 hover:text-paper"
                {...(social.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                <SocialGlyph label={social.label} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

function SocialGlyph({ label }: { label: string }) {
  const name = label.toLowerCase();
  if (name.includes("linked")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
