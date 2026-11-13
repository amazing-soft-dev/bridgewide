import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { portraits } from "@/content/ai-training";
import { people, stories } from "@/content/site";

// The log is a document under docs/, so reading it is the point of the test.
const log = readFileSync(new URL("../../docs/permissions-log.md", import.meta.url), "utf8");

describe("the permissions log", () => {
  it("lists every client a story names", () => {
    const named = stories.map((story) => story.company).filter((company) => company !== "Anonymized client");
    for (const company of named) expect(log, `no row for client ${company}`).toContain(`| ${company} |`);
  });

  it("lists every consultant the site shows", () => {
    for (const person of people) expect(log, `no row for ${person.name}`).toContain(`| ${person.name} |`);
  });

  it("lists every AI-training portrait", () => {
    for (const portrait of portraits) expect(log, `no row for ${portrait.name}`).toContain(`| ${portrait.name} |`);
  });

  it("does not name an anonymized story's client", () => {
    const anonymous = stories.filter((story) => story.company === "Anonymized client");
    for (const story of anonymous) expect(JSON.stringify(story).toLowerCase()).not.toMatch(/northline|harbor|campo|keel|lumen/);
  });
});
