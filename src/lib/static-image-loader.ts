import type { ImageLoaderProps } from "next/image";
import manifest from "./image-manifest.json";

const hashes: Record<string, string> = manifest;

/**
 * Image loader for the static export (GitHub Pages).
 *
 * There is no image optimizer on a static host, so `npm run images`
 * (scripts/optimize-images.mjs) pre-builds one WebP per configured width:
 * /images/hero.webp at 640px is served from /_img/hero.<hash>.640.webp.
 * next/image only asks for widths from src/lib/image-sizes.json, and the
 * script builds exactly those, so every srcset entry exists.
 *
 * next/image does not add basePath to `src`, so it is prefixed here.
 */
export default function staticImageLoader({ src, width }: ImageLoaderProps): string {
  if (!src.startsWith("/")) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const hash = hashes[src];
  if (!hash) return `${base}${src}`;
  const name = src.slice("/images/".length).replace(/\.[^.]+$/, "");
  return `${base}/_img/${name}.${hash}.${width}.webp`;
}
