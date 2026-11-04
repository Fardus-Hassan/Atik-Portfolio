import type { BlogPost } from "@/lib/content";
import { CoverImage } from "@/components/media";

const palettes = [
  { background: "#dff25a", foreground: "#090908", line: "rgba(9,9,8,0.18)" },
  { background: "#f4f0e6", foreground: "#090908", line: "rgba(9,9,8,0.14)" },
  { background: "#1a1a17", foreground: "#dff25a", line: "rgba(223,242,90,0.22)" },
  { background: "#2b2a24", foreground: "#f4f0e6", line: "rgba(244,240,230,0.16)" },
];

function paletteFor(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

/** The post cover, or a typographic cover in the site colors when no image is set. */
export function BlogCover({
  post,
  sizes,
  priority = false,
  size = "md",
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  size?: "md" | "lg";
}) {
  if (post.cover) {
    return <CoverImage src={post.cover} alt={post.coverAlt || post.title} sizes={sizes} priority={priority} />;
  }

  const palette = paletteFor(post.slug);
  return (
    <div
      role="img"
      aria-label={post.title}
      className="absolute inset-0 overflow-hidden"
      style={{ background: palette.background, color: palette.foreground }}
    >
      <svg viewBox="0 0 400 400" aria-hidden className="absolute -right-[18%] -top-[30%] h-[120%] opacity-100">
        <circle cx="200" cy="200" r="150" fill="none" stroke={palette.line} strokeWidth="1.2" />
        <circle cx="200" cy="200" r="110" fill="none" stroke={palette.line} strokeWidth="1.2" />
        <circle cx="200" cy="200" r="70" fill="none" stroke={palette.line} strokeWidth="1.2" />
      </svg>
      <span
        aria-hidden
        className={`absolute bottom-[8%] left-[7%] right-[7%] font-serif italic leading-[0.86] tracking-[-0.04em] ${
          size === "lg" ? "text-[clamp(3.4rem,9vw,7.5rem)]" : "text-[clamp(2.6rem,6vw,4.4rem)]"
        }`}
      >
        {post.category}
      </span>
      <span aria-hidden className="absolute left-[7%] top-[9%] font-serif text-3xl leading-none opacity-60">
        &ldquo;
      </span>
    </div>
  );
}
