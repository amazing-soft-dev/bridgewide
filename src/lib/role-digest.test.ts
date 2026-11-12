import { describe, expect, it } from "vitest";
import type { Role } from "@/content/site";
import { digestText, shouldSendDigest } from "@/lib/role-digest";

const base = {
  boardTitle: "Role",
  boardCode: "ENG",
  country: "United States",
  countryCode: "USA",
  salaryMin: 1,
  salaryMax: 2,
  salaryUnit: "year",
  workMode: "Remote",
  engagement: "Permanent",
  salary: "$1–$2",
  discipline: "Backend",
  summary: "A seat.",
  consultantName: "Lena Cho",
  postedOn: "2026-10-18",
  duties: ["Own it", "Review it", "Ship it"],
  requirements: ["Go", "Design", "On-call"],
  benefits: ["Pay", "Remote", "Permanent"],
} as const;

function role(slug: string, title: string, closesOn: string): Role {
  return { ...base, slug, title, city: "Austin", region: "usa", closesOn };
}

describe("role digest", () => {
  it("lists closed and remaining titles and no applicant email", () => {
    const text = digestText(
      [role("open-one", "Open Seat", "2099-01-01"), role("closed-one", "Closed Seat", "2020-01-01")],
      new Date("2026-11-12T18:00:00Z"),
    );
    expect(text).toContain("Open Seat");
    expect(text).toContain("Closed Seat");
    expect(text).not.toMatch(/@/);
  });

  it("sends once per Pacific weekday", () => {
    const thursday = new Date("2026-11-12T18:00:00Z");
    expect(shouldSendDigest(undefined, thursday)).toBe(true);
    expect(shouldSendDigest("2026-11-12", thursday)).toBe(false);
  });
});
