// Builds the responsive images used by the static export (GitHub Pages).
//
// GitHub Pages has no image optimizer, so next/image's srcset would point at
// the full-size original for every width. This script writes one WebP per
// width in src/lib/image-sizes.json for each photo in public/images:
//
//   public/images/hero.webp  ->  public/_img/hero.<hash>.640.webp ... .1920.webp
//
// The <hash> is taken from the source file's contents, so a changed photo gets
// new URLs and every file under /_img/ can be cached by a CDN "forever".
// src/lib/image-manifest.json maps each source path to its hash; the static
// image loader (src/lib/static-image-loader.ts) reads it.
//
// public/logo.png is the committed Organization logo. If it is missing, this
// script rebuilds it from public/logo-mark.webp, the raster mark. The header
// wordmark stays the SVG in src/components/brand/Logo.tsx.
//
// Run: npm run images   (CI and the Pages deploy run it before `next build`)

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "public", "images");
const outDir = path.join(root, "public", "_img");
const manifestPath = path.join(root, "src", "lib", "image-manifest.json");
const sizes = JSON.parse(await readFile(path.join(root, "src", "lib", "image-sizes.json"), "utf8"));
const widths = [...new Set([...sizes.imageSizes, ...sizes.deviceSizes])].sort((a, b) => a - b);
const QUALITY = 72;

const exists = (file) => stat(file).then(() => true, () => false);

await mkdir(outDir, { recursive: true });

const imageFile = /\.(webp|jpe?g|png|avif)$/i;

async function walk(dir, prefix = "") {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full, rel)));
    else found.push(rel);
  }
  return found;
}

const files = (await walk(srcDir)).filter((name) => imageFile.test(name)).sort();
const manifest = {};
const keep = new Set();
let written = 0;

for (const name of files) {
  const input = path.join(srcDir, ...name.split("/"));
  const buffer = await readFile(input);
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 10);
  const base = name.replace(/\.[^.]+$/, "");
  manifest[`/images/${name}`] = hash;

  for (const width of widths) {
    const outName = `${base}.${hash}.${width}.webp`;
    keep.add(outName);
    const output = path.join(outDir, ...outName.split("/"));
    if (await exists(output)) continue;
    await mkdir(path.dirname(output), { recursive: true });
    await sharp(buffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(output);
    written += 1;
  }
}

// Drop variants of photos that changed or were removed.
for (const name of await walk(outDir)) {
  if (!keep.has(name)) await rm(path.join(outDir, ...name.split("/")));
}

const json = `${JSON.stringify(manifest, null, 2)}\n`;
const previous = (await exists(manifestPath)) ? await readFile(manifestPath, "utf8") : "";
if (json !== previous) await writeFile(manifestPath, json);

const logo = path.join(root, "public", "logo.png");
if (!(await exists(logo))) {
  await sharp(path.join(root, "public", "logo-mark.webp"))
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(logo);
}

console.log(
  `images: ${files.length} photos x ${widths.length} widths, ${written} new file(s) in public/_img` +
    (json !== previous ? ", manifest updated" : ""),
);
