import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { erasePatch, listSubmissions, saveSubmission, type Submission } from "@/lib/desk-store";

const sendFormEmail = vi.fn(async (..._args: unknown[]) => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail: (...args: unknown[]) => sendFormEmail(...args) };
});

let dir: string;
const day = 24 * 60 * 60 * 1000;

const person = (over: Partial<Submission>): Submission => ({
  id: "BW-x",
  kind: "talent-pool",
  at: new Date().toISOString(),
  status: "received",
  email: "ada@example.com",
  roleKey: "Staff Engineer",
  rightToWork: "Yes, I can work there",
  consent: { version: "talent-pool-12-months-v1", at: "2026-01-01T00:00:00.000Z" },
  feeAcknowledged: "20%",
  startDate: "2026-06-01",
  guaranteeEnd: "2026-08-24",
  body: "Name: Ada Lovelace\nPhone: 555-0100\nProfile: ten years of Rust",
  ...over,
});

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "erase-"));
  process.env.DESK_DATA_DIR = dir;
  process.env.CRON_SECRET = "s3cret";
  sendFormEmail.mockClear();
});

afterEach(() => {
  delete process.env.DESK_DATA_DIR;
  delete process.env.CRON_SECRET;
});

const auth = { authorization: "Bearer s3cret" };

describe("erasePatch", () => {
  it("keeps id, kind, time, and a deleted status, and clears every identifying field", () => {
    const patch = erasePatch();
    expect(patch).toMatchObject({ status: "deleted", email: "", body: "" });
    for (const key of ["roleKey", "rightToWork", "consent", "feeAcknowledged", "startDate", "guaranteeEnd"] as const) {
      expect(key in patch).toBe(true);
      expect(patch[key]).toBeUndefined();
    }
    expect(patch).not.toHaveProperty("id");
    expect(patch).not.toHaveProperty("kind");
    expect(patch).not.toHaveProperty("at");
  });
});

describe("a deletion request", () => {
  it("anonymizes the record but still writes to the address it had", async () => {
    await saveSubmission(person({ id: "BW-del", kind: "ai-apply" }));
    const { POST } = await import("@/app/api/desk/record/route");
    const response = await POST(
      new Request("http://x.test/api/desk/record", {
        method: "POST",
        headers: { ...auth, "content-type": "application/json" },
        body: JSON.stringify({ id: "BW-del", status: "deleted" }),
      }),
    );
    expect(response.status).toBe(200);

    const [record] = await listSubmissions();
    expect(record).toMatchObject({ id: "BW-del", kind: "ai-apply", status: "deleted", email: "", body: "" });
    expect(record.consent).toBeUndefined();
    expect(record.feeAcknowledged).toBeUndefined();

    const toCandidate = sendFormEmail.mock.calls.map((call) => call[0] as { to?: string }).find((mail) => mail.to);
    expect(toCandidate?.to).toBe("ada@example.com");
  });
});
