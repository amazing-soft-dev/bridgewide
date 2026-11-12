import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";

const sendFormEmail = vi.fn(async () => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

const brief = {
  name: "Ada",
  email: "ada@example.com",
  company: "Northline",
  roleTitle: "Staff backend",
  regions: ["usa", "canada"],
  engagement: "Permanent",
  manager: "Amira Shah",
  stack: "Go",
  band: "$210,000",
  ninety: "Own the ledger",
  fee: "yes",
  message: "We need an owner.",
};

describe("POST /api/hire", () => {
  beforeEach(() => {
    sendFormEmail.mockClear();
    resetRateLimit();
    process.env.DESK_DATA_DIR = mkdtempSync(path.join(tmpdir(), "desk-"));
  });

  it("rejects a brief with no stack", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest({ ...brief, stack: "" }));
    expect(response.status).toBe(400);
  });

  it("includes the brief fields in the desk email", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest(brief));
    expect(response.status).toBe(200);
    const desk = (sendFormEmail.mock.calls as unknown as [{ subject: string; text: string }][])
      .map((call) => call[0])
      .find((input) => input.subject.startsWith("Hire brief"));
    expect(desk?.text).toContain("Hiring manager: Amira Shah");
    expect(desk?.text).toContain("Stack: Go");
    expect(desk?.text).toContain("Band: $210,000");
    expect(desk?.text).toContain("Regions:");
  });

  it("saves the engagement on the record, for the guarantee clock", async () => {
    const { POST } = await import("./route");
    const { listSubmissions } = await import("@/lib/desk-store");
    expect((await POST(jsonRequest(brief))).status).toBe(200);
    expect((await POST(jsonRequest({ ...brief, email: "bo@example.com", engagement: "Contract", duration: "6 months" }))).status).toBe(200);
    const records = await listSubmissions();
    expect(records.map((record) => record.engagement)).toEqual(["Permanent", "Contract"]);
  });

  it("does not send when the honeypot is filled", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest({ ...brief, companyWebsite: "https://spam.test" }));
    expect(response.status).toBe(200);
    expect(sendFormEmail).not.toHaveBeenCalled();
  });
});

function jsonRequest(body: unknown): Request {
  return new Request("https://www.bridgewide.org/api/hire", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
