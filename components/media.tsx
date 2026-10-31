import Image from "next/image";

export function LogoImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={220}
      height={48}
      style={{ height: "1.85rem", width: "auto" }}
    />
  );
}

export function CoverImage({
  src,
  alt,
  sizes,
  position = "center",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      style={{ objectPosition: position }}
    />
  );
}
