import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { expiredTalent } from "@/app/api/cron/talent-retention/route";
import { canIntroduce, guaranteeEnd, saveSubmission } from "@/lib/desk-store";
import { deliverIntake } from "@/lib/intake";
import { allowRequest, resetRateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/mail", () => ({
  sendFormEmail: vi.fn(async () => ({ ok: true })),
}));

describe("desk records", () => {
  beforeEach(() => {
    resetRateLimit();
    process.env.DESK_DATA_DIR = mkdtempSync(path.join(tmpdir(), "desk-"));
  });

  it("returns 429 after a burst and keeps a normal request", () => {
    const key = "203.0.113.5:contact";
    for (let i = 0; i < 8; i += 1) expect(allowRequest(key)).toBe(true);
    expect(allowRequest(key)).toBe(false);
  });

  it("returns the existing id for the same email and role", async () => {
    const first = await deliverIntake({
      kind: "contact",
      email: "ada@example.com",
      roleKey: "Press",
      subject: "Contact · Press from Ada",
      text: "Hello",
      ip: "203.0.113.8",
      visitorSla: "A person answers.",
    });
    const second = await deliverIntake({
      kind: "contact",
      email: "ada@example.com",
      roleKey: "Press",
      subject: "Contact · Press from Ada",
      text: "Hello again",
      ip: "203.0.113.9",
      visitorSla: "A person answers.",
    });
    expect(first.ok && second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(second.id).toBe(first.id);
      expect(second.duplicate).toBe(true);
    }
  });

  it("keeps a talent-pool file one day inside the window and drops one past it", () => {
    const now = Date.parse("2027-11-12T00:00:00Z");
    const inside = new Date(now - 364 * 24 * 60 * 60 * 1000).toISOString();
    const past = new Date(now - 366 * 24 * 60 * 60 * 1000).toISOString();
    expect(expiredTalent(inside, now)).toBe(false);
    expect(expiredTalent(past, now)).toBe(true);
  });

  it("refuses an introduction without right to work and gives contracts no end date", async () => {
    expect(canIntroduce({ status: "received", rightToWork: undefined })).toBe(false);
    expect(canIntroduce({ status: "deleted", rightToWork: "Yes, I can work there" })).toBe(false);
    expect(canIntroduce({ status: "received", rightToWork: "Needs sponsorship" })).toBe(true);
    expect(guaranteeEnd("2026-11-12", "Contract")).toBeUndefined();
    expect(guaranteeEnd("2026-11-12", "Permanent")).toBe("2027-02-04");
    await saveSubmission({
      id: "BW-test",
      kind: "cv",
      at: new Date().toISOString(),
      status: "received",
      email: "ada@example.com",
      body: "cv",
      fileBase64: "abc",
    });
    expect(canIntroduce({ status: "paused", rightToWork: "Yes, I can work there" })).toBe(false);
  });
});
