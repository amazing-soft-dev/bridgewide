// Opens one GitHub issue per roadmap item, and never opens the same title twice.
//
//   node scripts/open-roadmap-issues.mjs <items.json> [--dry-run]
//
// <items.json> is an array of [branch, title, body]. With --dry-run the script
// only prints what it would create and what it would skip. Without it, the
// script creates the issues with `gh` and writes the URLs beside the input as
// <items>.urls.json.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { issueBody, planIssues } from "./roadmap-issues-lib.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const file = args.find((arg) => !arg.startsWith("--"));

if (!file) {
  console.error("Usage: node scripts/open-roadmap-issues.mjs <items.json> [--dry-run]");
  process.exit(2);
}

const items = JSON.parse(readFileSync(file, "utf8"));
const existing = JSON.parse(
  execFileSync("gh", ["issue", "list", "--state", "all", "--limit", "1000", "--json", "title"], {
    encoding: "utf8",
  }),
).map((issue) => issue.title);

const { create, skip } = planIssues(items, existing);

for (const item of skip) console.log(`skip    ${item.title}  (already exists)`);

if (dryRun) {
  for (const item of create) console.log(`create  ${item.title}  [${item.branch}]`);
  console.log(`\nDry run: ${create.length} to create, ${skip.length} to skip.`);
  process.exit(0);
}

const created = [];
for (const item of create) {
  const url = execFileSync(
    "gh",
    ["issue", "create", "--title", item.title, "--body", issueBody(item)],
    { encoding: "utf8" },
  ).trim();
  created.push({ branch: item.branch, title: item.title, url });
  console.log(url);
}

writeFileSync(file.replace(/\.json$/, "") + ".urls.json", JSON.stringify(created, null, 2) + "\n");
console.log(`\nCreated ${created.length}, skipped ${skip.length}.`);
