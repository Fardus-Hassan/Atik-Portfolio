import type { BrandLogo, SiteContent } from "@/lib/content";
import { LogoImage } from "@/components/media";
import { gutter } from "@/components/ui";

function Row({ items }: { items: BrandLogo[] }) {
  const half = [...items, ...items];

  return (
    <div className="logo-marquee overflow-hidden">
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
            {half.map((item, index) => (
              <li
                key={`${copy}-${item.name}-${index}`}
                className="flex items-center gap-8 px-5 sm:gap-12 sm:px-8"
                aria-hidden={index >= items.length ? true : undefined}
              >
                <LogoImage src={item.logo} alt={copy === 0 && index < items.length ? item.name : ""} />
                <span className="h-1 w-1 shrink-0 rounded-full bg-lime" aria-hidden />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Marquee({ marquee }: { marquee: SiteContent["marquee"] }) {
  if (!marquee.items.length) return null;

  return (
    <section aria-label={marquee.label} className="overflow-hidden border-y border-ink/10 bg-paper py-6 text-ink sm:py-8">
      <p className={`${gutter} pb-4 text-[11px] uppercase tracking-[0.24em] text-ink/45`}>{marquee.label}</p>
      <Row items={marquee.items} />
    </section>
  );
}
