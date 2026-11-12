import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listSubmissions, saveSubmission, type Submission } from "@/lib/desk-store";

// This file lives beside the cron route on purpose: the static export build deletes
// src/app/api/cron, and a test elsewhere that imports the route would no longer type-check.

const sendFormEmail = vi.fn(async (..._args: unknown[]) => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail: (...args: unknown[]) => sendFormEmail(...args) };
});

let dir: string;
const day = 24 * 60 * 60 * 1000;
const auth = { authorization: "Bearer s3cret" };

const person = (over: Partial<Submission>): Submission => ({
  id: "BW-x",
  kind: "talent-pool",
  at: new Date().toISOString(),
  status: "received",
  email: "ada@example.com",
  roleKey: "Staff Engineer",
  rightToWork: "Yes, I can work there",
  consent: { version: "talent-pool-12-months-v1", at: "2026-01-01T00:00:00.000Z" },
  body: "Name: Ada Lovelace\nPhone: 555-0100\nProfile: ten years of Rust",
  ...over,
});

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "retention-"));
  process.env.DESK_DATA_DIR = dir;
  process.env.CRON_SECRET = "s3cret";
  sendFormEmail.mockClear();
});

afterEach(() => {
  delete process.env.DESK_DATA_DIR;
  delete process.env.CRON_SECRET;
});

describe("12-month talent-pool retention", () => {
  it("anonymizes a profile past 12 months and leaves newer ones and other kinds alone", async () => {
    await saveSubmission(
      person({
        id: "old",
        email: "zed@example.com",
        body: "Name: Zed Zebra\nPhone: 555-0199",
        at: new Date(Date.now() - 400 * day).toISOString(),
      }),
    );
    await saveSubmission(person({ id: "recent", email: "bo@example.com", at: new Date(Date.now() - 300 * day).toISOString() }));
    await saveSubmission(
      person({ id: "contact-old", kind: "contact", email: "cy@example.com", at: new Date(Date.now() - 500 * day).toISOString() }),
    );

    const { GET } = await import("./route");
    const response = await GET(new Request("http://x.test/api/cron/talent-retention", { headers: auth }));
    expect(await response.json()).toEqual({ ok: true, deleted: 1 });

    const byId = Object.fromEntries((await listSubmissions()).map((item) => [item.id, item]));
    expect(byId.old).toMatchObject({ id: "old", kind: "talent-pool", status: "deleted", email: "", body: "" });
    expect(byId.old.consent).toBeUndefined();
    expect(byId.old.rightToWork).toBeUndefined();
    expect(byId.old.roleKey).toBeUndefined();
    expect(byId.recent.email).toBe("bo@example.com");
    expect(byId["contact-old"].email).toBe("cy@example.com");

    const onDisk = readFileSync(path.join(dir, "submissions.json"), "utf8");
    expect(onDisk).not.toContain("Zed Zebra");
    expect(onDisk).not.toContain("555-0199");
    expect(onDisk).not.toContain("zed@example.com");
  });

  it("tells the desk a count and nothing about the people", async () => {
    await saveSubmission(person({ id: "old", at: new Date(Date.now() - 400 * day).toISOString() }));
    const { GET } = await import("./route");
    await GET(new Request("http://x.test/api/cron/talent-retention", { headers: auth }));
    const mail = sendFormEmail.mock.calls[0][0] as { text: string };
    expect(mail.text).toBe("Deleted 1 talent-pool profiles older than 12 months.");
    expect(mail.text).not.toMatch(/ada|lovelace|@/i);
  });
});
