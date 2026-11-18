import { describe, expect, it } from "vitest";
import { stories } from "@/content/site";
import { caseStudyLabels, caseStudySections, quoteSpeaker } from "@/lib/case-study";

describe("caseStudySections", () => {
  it("labels the three paragraphs Challenge, Approach, Result, in order", () => {
    const northline = stories.find((story) => story.slug === "northline-ledger-owner")!;
    const sections = caseStudySections(northline);
    expect(sections.map((section) => section.label)).toEqual([...caseStudyLabels]);
    expect(sections.map((section) => section.text)).toEqual([...northline.body]);
  });

  it("works for every story", () => {
    for (const story of stories) expect(caseStudySections(story)).toHaveLength(3);
  });

  it("puts the outcome last: the result block names a start or a close", () => {
    const northline = stories.find((story) => story.slug === "northline-ledger-owner")!;
    expect(caseStudySections(northline)[2].text).toMatch(/started sixteen days after the brief/);
  });
});

describe("quoteSpeaker", () => {
  it("takes the name before the first comma", () => {
    expect(quoteSpeaker("Amira Shah, VP Engineering, Northline")).toBe("Amira Shah");
    expect(quoteSpeaker("Wei Lin, CTO, Lumen Pay")).toBe("Wei Lin");
  });

  it("gives every named story a speaker, a title, and a company", () => {
    for (const story of stories.filter((item) => item.company !== "Anonymized client")) {
      const parts = story.attribution.split(",").map((part) => part.trim());
      expect(parts.length, story.slug).toBeGreaterThanOrEqual(3);
      expect(parts.at(-1), story.slug).toBe(story.company);
    }
  });
});
