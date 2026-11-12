import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listSubmissions, saveSubmission, type Submission } from "@/lib/desk-store";

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail: vi.fn(async () => ({ ok: true as const })) };
});

beforeEach(() => {
  process.env.DESK_DATA_DIR = mkdtempSync(path.join(tmpdir(), "record-"));
  process.env.CRON_SECRET = "s3cret";
});

afterEach(() => {
  delete process.env.DESK_DATA_DIR;
  delete process.env.CRON_SECRET;
});

const hire = (over: Partial<Submission>): Submission => ({
  id: "BW-hire",
  kind: "hire",
  at: "2026-11-12T10:00:00.000Z",
  status: "in review",
  email: "ceo@northline.test",
  roleKey: "Staff Engineer",
  engagement: "Permanent",
  rightToWork: "Yes, I can work there",
  body: "A brief",
  ...over,
});

async function post(body: Record<string, unknown>) {
  const { POST } = await import("./route");
  return POST(
    new Request("http://x.test/api/desk/record", {
      method: "POST",
      headers: { authorization: "Bearer s3cret", "content-type": "application/json" },
      body: JSON.stringify({ id: "BW-hire", status: "introduced", startDate: "2026-11-12", ...body }),
    }),
  );
}

describe("the guarantee end date", () => {
  it("follows the record's engagement, so a Contract in the request cannot remove a Permanent guarantee", async () => {
    await saveSubmission(hire({ engagement: "Permanent" }));
    const response = await post({ engagement: "Contract" });
    expect(await response.json()).toMatchObject({ ok: true, guaranteeEnd: "2027-02-04" });
    expect((await listSubmissions())[0].guaranteeEnd).toBe("2027-02-04");
  });

  it("follows the record's engagement, so a Permanent in the request cannot add a Contract guarantee", async () => {
    await saveSubmission(hire({ engagement: "Contract" }));
    const response = await post({ engagement: "Permanent" });
    expect(await response.json()).toMatchObject({ ok: true, guaranteeEnd: null });
    expect((await listSubmissions())[0].guaranteeEnd).toBeUndefined();
  });

  it("uses the request only for an older record that saved no engagement", async () => {
    await saveSubmission(hire({ engagement: undefined }));
    expect(await (await post({ engagement: "Contract" })).json()).toMatchObject({ guaranteeEnd: null });
    expect(await (await post({ engagement: "Permanent" })).json()).toMatchObject({ guaranteeEnd: "2027-02-04" });
  });
});
