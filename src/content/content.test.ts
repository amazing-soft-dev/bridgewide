import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { trainingRoles } from "@/content/ai-training";
import { people, regions, roles, stories } from "@/content/site";
import { isRoleOpen } from "@/lib/desk-clock";
import { jobPosting, trainingJobPosting } from "@/lib/structured-data";

describe("approved content", () => {
  it("covers five regions, including Asia", () => {
    expect(regions.map((region) => region.slug)).toEqual(["usa", "canada", "latam", "europe", "asia"]);
  });

  it("keeps the Asia roles, the Lumen Pay story, and Mei Tan's photo", () => {
    expect(roles.some((role) => role.slug === "senior-backend-engineer-singapore")).toBe(true);
    expect(roles.some((role) => role.slug === "senior-data-engineer-bangalore")).toBe(true);
    expect(stories.some((story) => story.slug === "lumen-pay-settlements")).toBe(true);
    expect(people.find((person) => person.name === "Mei Tan")?.image.endsWith("person-mei.webp")).toBe(true);
  });

  it("does not call the content a placeholder", () => {
    const source = readFileSync(new URL("./site.ts", import.meta.url), "utf8");
    expect(source.toLowerCase()).not.toContain("placeholder");
  });

  it("uses the approved country lines and close date", () => {
    expect(people.map((person) => person.focus)).toEqual([
      "United States",
      "United Kingdom (Europe)",
      "Mexico (LATAM)",
      "Canada",
      "Singapore (Asia)",
      "United States",
    ]);
  });

  it("keeps every role open until it has its own close date", () => {
    const soon = new Date("2026-11-12T16:00:00Z");
    for (const role of roles) {
      if (role.closesOn) expect(role.closesOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      else expect(isRoleOpen(role, new Date("2099-01-01T00:00:00Z"))).toBe(true);
    }
    expect(roles.every((role) => isRoleOpen(role, soon))).toBe(true);
  });

  it("does not put a validThrough on a role with no close date", () => {
    const singapore = roles.find((role) => role.slug === "senior-backend-engineer-singapore");
    const open = jobPosting({ ...singapore!, closesOn: undefined });
    expect(open).not.toBeNull();
    expect(open).not.toHaveProperty("validThrough");
    expect(jobPosting({ ...singapore!, closesOn: "2027-01-16" })).toHaveProperty("validThrough", "2027-01-16");
  });

  it("publishes 32 training cards and does not invent a floor for a ceiling", () => {
    expect(trainingRoles).toHaveLength(32);
    const ceiling = trainingRoles.find((role) => role.slug === "outlier-general-usa");
    expect(ceiling?.payMin).toBeNull();
    expect(ceiling?.payMax).toBe(35);
    const posting = trainingJobPosting(ceiling!);
    expect(posting.hiringOrganization).toEqual({ "@type": "Organization", name: "Outlier" });
    expect(posting.baseSalary.value).not.toHaveProperty("minValue");
    expect(trainingRoles.every((role) => trainingJobPosting(role).hiringOrganization.name !== "BridgeWide")).toBe(
      true,
    );
  });

  it("emits a staffing posting for an open Asia role and nothing once it is closed", () => {
    const singapore = roles.find((role) => role.slug === "senior-backend-engineer-singapore");
    const posting = jobPosting(singapore!);
    expect(posting?.hiringOrganization).toMatchObject({ name: "BridgeWide" });
    expect(JSON.stringify(posting)).toContain("SG");
    expect(jobPosting({ ...singapore!, closesOn: "2020-01-01" })).toBeNull();
  });
});
