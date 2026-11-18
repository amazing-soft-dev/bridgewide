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

describe("the 18:00 Pacific close", () => {
  it("falls at the right UTC instant in winter, summer, and on both DST change days", () => {
    // PST is UTC-8, PDT is UTC-7.
    expect(pacificClose("2027-01-16")?.toISOString()).toBe("2027-01-17T02:00:00.000Z");
    expect(pacificClose("2026-07-15")?.toISOString()).toBe("2026-07-16T01:00:00.000Z");
    // Clocks went back on 1 November 2026: 18:00 that day is PST.
    expect(pacificClose("2026-11-01")?.toISOString()).toBe("2026-11-02T02:00:00.000Z");
    // Clocks go forward on 14 March 2027: 18:00 that day is PDT.
    expect(pacificClose("2027-03-14")?.toISOString()).toBe("2027-03-15T01:00:00.000Z");
  });

  it.each(["2027-01-16", "2026-11-01", "2027-03-14", "2026-07-15"])(
    "is open at 17:59 and closed at 18:00 and 18:01 on %s",
    (date) => {
      const close = pacificClose(date)!.getTime();
      expect(isRoleOpen({ closesOn: date }, new Date(close - 60_000))).toBe(true);
      expect(isRoleOpen({ closesOn: date }, new Date(close))).toBe(false);
      expect(isRoleOpen({ closesOn: date }, new Date(close + 60_000))).toBe(false);
    },
  );

  it("is open all morning on the close date, whatever the visitor's zone", () => {
    // 09:00 Pacific on 16 January 2027 is 17:00 UTC; 09:00 in Tokyo is 00:00 UTC that day.
    expect(isRoleOpen({ closesOn: "2027-01-16" }, new Date("2027-01-16T17:00:00Z"))).toBe(true);
    expect(isRoleOpen({ closesOn: "2027-01-16" }, new Date("2027-01-16T00:00:00Z"))).toBe(true);
  });

  it("treats an unreadable close date as open instead of closing the role", () => {
    expect(isRoleOpen({ closesOn: "16 January 2027" }, new Date("2030-01-01T00:00:00Z"))).toBe(true);
  });
});
