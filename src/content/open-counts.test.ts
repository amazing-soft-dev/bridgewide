import { afterEach, describe, expect, it } from "vitest";
import { getAnnouncement, openRoleCount, roles } from "@/content/site";

afterEach(() => {
  delete process.env.ROLE_CLOCK;
  delete process.env.ROLE_CLOSE_DATES;
});

describe("open role counts", () => {
  it("count every role while none has a close date", () => {
    const now = new Date("2026-11-12T16:00:00Z");
    expect(getAnnouncement(now).liveRoleCount).toBe(`${roles.length} roles live`);
    const usa = roles.filter((role) => role.region === "usa").length;
    expect(openRoleCount("usa", now)).toBe(usa);
  });

  it("follow the desk clock on each call, not the clock at import", () => {
    const usa = roles.filter((role) => role.region === "usa").length;
    process.env.ROLE_CLOCK = "2027-01-17T04:00:00.000Z";
    process.env.ROLE_CLOSE_DATES = "region:usa=2027-01-16";
    expect(openRoleCount("usa")).toBe(0);
    expect(getAnnouncement().liveRoleCount).toBe(`${roles.length - usa} roles live`);

    process.env.ROLE_CLOCK = "2027-01-16T20:00:00.000Z";
    expect(openRoleCount("usa")).toBe(usa);
  });
});
