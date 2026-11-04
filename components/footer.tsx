import type { SiteContent } from "@/lib/content";
import { SocialIcon } from "@/components/social-icon";
import { DownloadIcon } from "@/components/ui";
import { gutter } from "@/lib/layout";

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
            .map((social, index) => (
              <li key={`${social.platform}-${index}`}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center sm:h-11 sm:w-11 justify-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
                  {...(social.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <SocialIcon platform={social.platform} icon={social.icon} />
                </a>
              </li>
            ))}
        </ul>
      </div>
    </footer>
  );
}
