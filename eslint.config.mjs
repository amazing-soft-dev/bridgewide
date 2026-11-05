import { createRequire } from "node:module";
import path from "node:path";
import { defineConfig, globalIgnores } from "eslint/config";

const require = createRequire(import.meta.url);

// typescript-eslint throws on import when TypeScript is 7, because 7.0 has no
// JavaScript compiler API. Every eslint-config-next entry point imports it.
// Stub the nested copy so the config can load, then drop the block that would
// parse .ts/.tsx with it. Delete this once typescript-eslint supports
// TypeScript 7:
// https://github.com/typescript-eslint/typescript-eslint/issues/10940
// `package.json` is not an exported subpath. The parser entry lives in dist/.
const eslintConfigNextDir = path.resolve(
  path.dirname(require.resolve("eslint-config-next/parser")),
  "..",
);
const typescriptEslintPath = require.resolve("typescript-eslint", {
  paths: [eslintConfigNextDir],
});
const Module = require("module");
const stub = new Module(typescriptEslintPath);
stub.filename = typescriptEslintPath;
stub.loaded = true;
stub.exports = {};
require.cache[typescriptEslintPath] = stub;

const nextVitals = (await import("eslint-config-next/core-web-vitals")).default;

const eslintConfig = defineConfig([
  // The kept `next` block still lists `@typescript-eslint/parser` under
  // `import/parsers`. The only import rule enabled today does not load it.
  ...nextVitals.filter((block) => block.name !== "next/typescript"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
