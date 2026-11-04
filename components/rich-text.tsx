import Link from "next/link";
import type { ReactNode } from "react";
import { isExternal, safeHref } from "@/lib/blog";

const pattern = /\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)|((?:https?:\/\/|www\.)[^\s<]*[^\s<.,:;"')\]!?])/g;

const linkClass =
  "font-medium text-ink underline decoration-lime decoration-2 underline-offset-[0.22em] transition-colors hover:decoration-ink";

export function TextLink({ href, children, className = linkClass }: { href: string; children: ReactNode; className?: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

/** Plain text with `[label](url)` links and bare URLs turned into anchors. */
export function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const [whole, label, target, bare] = match;
    const href = safeHref(target ?? bare);
    if (match.index > last) nodes.push(text.slice(last, match.index));
    nodes.push(
      href ? (
        <TextLink key={match.index} href={href}>
          {label ?? bare}
        </TextLink>
      ) : (
        (label ?? whole)
      ),
    );
    last = match.index + whole.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
