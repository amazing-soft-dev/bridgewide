import { describe, expect, it } from "vitest";
import { roles } from "@/content/site";
import { jobPosting } from "@/lib/structured-data";

const asia = roles.filter((role) => role.region === "asia");

describe("notice period on the Asia roles", () => {
  it("is 1 to 3 months on both Asia roles", () => {
    expect(asia.map((role) => role.slug).sort()).toEqual(["senior-backend-engineer-singapore", "senior-data-engineer-bangalore"]);
    for (const role of asia) expect(role.noticePeriod).toBe("1 to 3 months");
  });

  it("is in each Asia job posting's description", () => {
    for (const role of asia) {
      const posting = jobPosting(role);
      expect(posting?.description).toContain("Notice period: 1 to 3 months.");
    }
  });

  it("is not added to a role that has none", () => {
    const other = roles.find((role) => role.region !== "asia")!;
    expect(other.noticePeriod).toBeUndefined();
    expect(jobPosting(other)?.description ?? "").not.toContain("Notice period");
  });

  it("is left out of the posting once the role is closed (no posting at all)", () => {
    expect(jobPosting({ ...asia[0], closesOn: "2020-01-01" })).toBeNull();
  });
});
