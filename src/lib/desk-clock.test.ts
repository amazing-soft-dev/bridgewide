import { afterEach, describe, expect, it } from "vitest";
import { closeDateFor, isRoleOpen, pacificClose } from "@/lib/desk-clock";

afterEach(() => {
  delete process.env.ROLE_CLOCK;
  delete process.env.ROLE_CLOSE_DATES;
});

describe("closeDateFor", () => {
  const role = { slug: "a-role", region: "usa", closesOn: undefined };

  it("uses the role's own date", () => {
    expect(closeDateFor({ ...role, closesOn: "2027-02-01" })).toBe("2027-02-01");
    expect(closeDateFor(role)).toBeUndefined();
  });

  it("applies a test override by slug or region, only when ROLE_CLOCK is set", () => {
    process.env.ROLE_CLOSE_DATES = "a-role=2027-01-16,region:canada=2027-01-17";
    expect(closeDateFor(role)).toBeUndefined();
    process.env.ROLE_CLOCK = "2027-01-17T04:00:00.000Z";
    expect(closeDateFor(role)).toBe("2027-01-16");
    expect(closeDateFor({ slug: "b", region: "canada" })).toBe("2027-01-17");
    expect(closeDateFor({ slug: "c", region: "europe" })).toBeUndefined();
  });

  it("ignores a malformed override", () => {
    process.env.ROLE_CLOCK = "2027-01-17T04:00:00.000Z";
    process.env.ROLE_CLOSE_DATES = "a-role=tomorrow,=2027-01-16";
    expect(closeDateFor(role)).toBeUndefined();
  });
});

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
