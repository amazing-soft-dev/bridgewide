import type { ImageLoaderProps } from "next/image";

/**
 * Image loader for the static export (GitHub Pages).
 *
 * next/image does not add basePath to `src`, so local paths are prefixed here.
 * The width query keeps each srcset entry distinct; static hosts ignore it.
 */
export default function staticImageLoader({ src, width }: ImageLoaderProps): string {
  if (!src.startsWith("/")) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}?w=${width}`;
}
