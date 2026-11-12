// Point `.next` at a folder on the system drive.
//
// `next dev` times three small writes under `.next/dev` and warns when they
// take longer than 200ms. On a hard drive that benchmark lands just over the
// line. Next.js also refuses a `distDir` outside the project, and that check
// does not follow junctions, so the configured path stays `.next` while the
// bytes live under `%LOCALAPPDATA%`.
//
// Linux and a repo that is already on the LOCALAPPDATA drive are left alone.
// The hash keeps two clones from sharing one cache.
//
// It also links node_modules next to the cache so PostCSS can find its plugins.
//
// Run: npm automatically, as predev and prebuild.

import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, readlinkSync, rmSync, rmdirSync, symlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const link = path.join(root, ".next");

const localAppData = process.env.LOCALAPPDATA;
if (process.platform !== "win32" || !localAppData) {
  process.exit(0);
}

if (path.parse(root).root.toLowerCase() === path.parse(localAppData).root.toLowerCase()) {
  process.exit(0);
}

const id = createHash("sha256").update(path.resolve(root)).digest("hex").slice(0, 12);
const target = path.join(localAppData, "bridgewide", "next", id);

function samePath(left, right) {
  return path.resolve(left).toLowerCase() === path.resolve(right).toLowerCase();
}

// Junction readlink results sometimes wear an NT prefix.
function junctionTarget(linkPath) {
  const raw = readlinkSync(linkPath)
    .replace(/^\\\\\?\\/, "")
    .replace(/^\\\?\?\\/, "");
  return path.resolve(path.dirname(linkPath), raw);
}

mkdirSync(target, { recursive: true });

// Turbopack runs the PostCSS config from a chunk under `target`, and Node looks
// for `@tailwindcss/postcss` in the folders above that chunk. They are outside
// the repo, so without this the dev server answers 500 with "Cannot find
// module '@tailwindcss/postcss'". A node_modules junction beside the cache
// points those lookups back at the repo's packages.
const modulesLink = path.join(target, "node_modules");
const modulesTarget = path.join(root, "node_modules");
let modulesCurrent = null;
try {
  modulesCurrent = lstatSync(modulesLink);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
if (!modulesCurrent || !modulesCurrent.isSymbolicLink() || !samePath(junctionTarget(modulesLink), modulesTarget)) {
  if (modulesCurrent) rmdirSync(modulesLink);
  symlinkSync(modulesTarget, modulesLink, "junction");
  console.log(`Linked ${modulesLink} to ${modulesTarget}.`);
}

let current = null;
try {
  current = lstatSync(link);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

if (current?.isSymbolicLink()) {
  if (samePath(junctionTarget(link), target)) {
    process.exit(0);
  }
  // rmdir removes the junction itself and leaves the folder it points at.
  rmdirSync(link);
} else if (current) {
  // A large `.next` on a hard drive often reports ENOTEMPTY once while
  // Windows is still releasing files from the delete.
  rmSync(link, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  console.log(`Removed ${link} so the Next.js cache can move to ${target}.`);
}

symlinkSync(target, link, "junction");
console.log(`Linked ${link} to ${target}.`);
