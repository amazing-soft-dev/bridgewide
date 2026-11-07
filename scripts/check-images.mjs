// Every photo on the site is used once.
//
// Two rules, checked over public/images and src/:
//
// 1. No two files under public/images have the same bytes. A copy of a photo
//    under a new name is still the same photo.
// 2. No `/images/<file>` path is referenced from more than one place in src/.
//    The content files and components each name a photo once, so a path that
//    appears twice is a photo wired into two slots. Comment lines and the
//    generated src/lib/image-manifest.json are not references.
//
// A photo that belongs to one entity (a story, a region, a consultant) is
// still referenced once, in its content entry, however many pages render it.
//
// Run: npm run check:images   (CI runs it in the quality job)

import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");
const srcDir = path.join(root, "src");

const imageFile = /\.(webp|jpe?g|png|avif|svg)$/i;
const sourceFile = /\.(ts|tsx|js|jsx|mjs|css|md|mdx)$/i;
const skip = new Set(["image-manifest.json"]);

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else found.push(full);
  }
  return found;
}

const rel = (file) => path.relative(root, file).split(path.sep).join("/");
const problems = [];

// 1. Byte-identical files.
const byHash = new Map();
for (const file of (await walk(imagesDir)).filter((f) => imageFile.test(f))) {
  const hash = createHash("sha256").update(await readFile(file)).digest("hex");
  const list = byHash.get(hash) ?? [];
  list.push(rel(file));
  byHash.set(hash, list);
}
for (const files of byHash.values()) {
  if (files.length > 1) problems.push(`same file under ${files.length} names: ${files.join(", ")}`);
}

// 2. One reference per path.
const refs = new Map();
const pathPattern = /\/images\/[A-Za-z0-9_./-]+\.(?:webp|jpe?g|png|avif|svg)/g;
for (const file of (await walk(srcDir)).filter((f) => sourceFile.test(f) && !skip.has(path.basename(f)))) {
  const lines = (await readFile(file, "utf8")).split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    for (const match of line.match(pathPattern) ?? []) {
      const list = refs.get(match) ?? [];
      list.push(`${rel(file)}:${index + 1}`);
      refs.set(match, list);
    }
  });
}
for (const [image, places] of [...refs].sort()) {
  if (places.length > 1) problems.push(`${image} is wired into ${places.length} slots: ${places.join(", ")}`);
}

if (problems.length) {
  for (const problem of problems) console.error(`check-images: ${problem}`);
  process.exit(1);
}
console.log(`check-images: ${byHash.size} photos, ${refs.size} referenced, each once`);
