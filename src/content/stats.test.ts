import { describe, expect, it } from "vitest";
import { contentUpdatedOn, stats, statsPeriodEnd } from "@/content/site";

describe("the headline stats", () => {
  it("keep their figures and labels", () => {
    expect(stats.map((stat) => [stat.value, stat.label])).toEqual([
      ["186", "Placements in the past year"],
      ["9", "Median days to a shortlist"],
      ["94%", "Still in role after one year"],
      ["11", "Median days to fill a contract seat"],
    ]);
  });

  it("each carry a footnote", () => {
    for (const stat of stats) expect(stat.basis, stat.label).toBeTruthy();
  });

  it("name the 12-month period that ends on the last content update", () => {
    expect(statsPeriodEnd).toBe("12 November 2026");
    expect(contentUpdatedOn).toBe("2026-11-12");
    const [placements, , retention] = stats;
    expect(placements.basis).toContain("12 months to 12 November 2026");
    expect(placements.basis).toMatch(/start date/);
    expect(retention.basis).toContain("12 to 24 months before 12 November 2026");
    expect(retention.basis).toMatch(/12 months after their start date/);
  });

  it("count a placement on its start date, in every footnote that counts placements", () => {
    const text = stats.map((stat) => stat.basis).join(" ");
    expect(text.match(/start date/g)?.length).toBeGreaterThanOrEqual(3);
    expect(text).not.toMatch(/offer accepted|invoice/i);
  });
});
