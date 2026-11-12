import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const items = JSON.parse(readFileSync(new URL("./roadmap-issues.json", import.meta.url), "utf8"));
const created = [];

for (const [branch, title, body] of items) {
  const full = [
    body,
    "",
    `Branch: \`${branch}\` from \`origin/dev\`.`,
    "",
    "Every commit on that branch ends with the two co-author trailers.",
  ].join("\n");
  const url = execFileSync(
    "gh",
    ["issue", "create", "--title", title, "--body", full],
    { encoding: "utf8" },
  ).trim();
  created.push({ branch, title, url });
  console.log(url);
}

writeFileSync(new URL("./roadmap-issue-urls.json", import.meta.url), JSON.stringify(created, null, 2));
