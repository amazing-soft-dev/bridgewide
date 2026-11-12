import { describe, expect, it } from "vitest";
import { isRoleOpen, pacificClose } from "@/lib/desk-clock";

const close = "2027-01-16";

describe("isRoleOpen", () => {
  it("stays open when the close date is missing", () => {
    expect(isRoleOpen({}, new Date("2027-06-01T00:00:00Z"))).toBe(true);
  });

  it("is open before 18:00 Pacific on the close date", () => {
    const instant = pacificClose(close);
    expect(instant).not.toBeNull();
    expect(isRoleOpen({ closesOn: close }, new Date(instant!.getTime() - 60_000))).toBe(true);
  });

  it("is closed after 18:00 Pacific on the close date", () => {
    const instant = pacificClose(close);
    expect(isRoleOpen({ closesOn: close }, new Date(instant!.getTime() + 60_000))).toBe(false);
  });

  it("keeps the published roles open on 12 November 2026", () => {
    expect(isRoleOpen({ closesOn: "2027-01-16" }, new Date("2026-11-12T16:00:00Z"))).toBe(true);
  });
});
