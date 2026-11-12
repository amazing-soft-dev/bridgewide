/**
 * Pure helpers for scripts/open-roadmap-issues.mjs, kept apart so a test can
 * import them without running `gh`.
 */

/** Same title, ignoring case and extra spaces. */
export function normalizeTitle(title) {
  return String(title).trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Split a roadmap file's items into the ones to create and the ones to skip.
 * Each item is [branch, title, body]. An item is skipped when an issue with
 * the same title already exists (open or closed) or when its title repeats
 * earlier in the same file.
 */
export function planIssues(items, existingTitles) {
  const seen = new Set(existingTitles.map(normalizeTitle));
  const create = [];
  const skip = [];
  for (const item of items) {
    const [branch, title, body] = item;
    if (typeof branch !== "string" || typeof title !== "string" || typeof body !== "string") {
      throw new Error(`Each item must be [branch, title, body]: ${JSON.stringify(item)}`);
    }
    const key = normalizeTitle(title);
    if (seen.has(key)) {
      skip.push({ branch, title });
      continue;
    }
    seen.add(key);
    create.push({ branch, title, body });
  }
  return { create, skip };
}

/** The issue body: the item's own text, then how the branch and commits must look. */
export function issueBody({ branch, body }) {
  return [
    body,
    "",
    `Branch: \`${branch}\` from \`origin/dev\`.`,
    "",
    "Every commit on that branch ends with the two co-author trailers.",
  ].join("\n");
}
