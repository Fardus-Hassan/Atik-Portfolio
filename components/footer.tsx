import type { SiteContent, SocialPlatform } from "@/lib/content";
import { DownloadIcon, gutter } from "@/components/ui";

export function Footer({ content }: { content: SiteContent }) {
  const { profile, footer, socials } = content;
  return (
    <footer className={`${gutter} pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4`}>
      <p className="overflow-hidden whitespace-nowrap font-serif leading-[0.8] tracking-[-0.06em] text-[clamp(3.25rem,18vw,14rem)] text-paper/[0.09]">
        {profile.mark}
      </p>
      <div className="mt-2 flex flex-col gap-5 border-t border-line pt-6 sm:pt-8 md:flex-row md:items-end md:justify-between">
        <p className="max-w-md text-2xl tracking-tight sm:text-3xl md:text-4xl">{footer.line}</p>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <a href={`mailto:${profile.email}`} className="break-all text-lg underline decoration-paper/30 underline-offset-4 sm:break-normal md:text-2xl">
            {profile.email}
          </a>
          {profile.cv ? (
            <a
              href={profile.cv.href}
              download={profile.cv.fileName}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-paper/20 px-4 text-sm transition-colors hover:border-lime hover:bg-lime hover:text-ink"
            >
              <DownloadIcon />
              {profile.cv.label}
            </a>
          ) : null}
        </div>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <p>
          © {profile.year} {profile.name}. {footer.rights}
        </p>
        <ul className="flex flex-wrap gap-1 sm:gap-2">
          {socials
            .filter((social) => social.enabled && social.href)
            .map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center sm:h-11 sm:w-11 justify-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                  {...(social.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <SocialGlyph platform={social.platform} />
                </a>
              </li>
            ))}
        </ul>
      </div>
    </footer>
  );
}

const filledIcons: Partial<Record<SocialPlatform, string>> = {
  linkedin:
    "M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z",
  facebook:
    "M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z",
  youtube:
    "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z",
  tiktok:
    "M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  x: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z",
};

function SocialGlyph({ platform }: { platform: SocialPlatform }) {
  const path = filledIcons[platform];
  if (path) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d={path} />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "whatsapp") {
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M3.5 20.5l1.2-3.9A8.5 8.5 0 1 1 8 19.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          fill="currentColor"
          d="M9 8.5c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.8-.6.4-1.4.5-2.1.3-2.4-.7-4.3-2.6-5-5-.2-.7-.1-1.5.3-2.1z"
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
