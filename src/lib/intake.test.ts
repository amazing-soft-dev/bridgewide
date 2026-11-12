import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listSubmissions } from "@/lib/desk-store";
import { deliverIntake } from "@/lib/intake";
import { resetRateLimit } from "@/lib/rate-limit";

const sendFormEmail = vi.fn(async (..._args: unknown[]) => ({ ok: true as const }));

vi.mock("@/lib/mail", () => ({ sendFormEmail: (...args: unknown[]) => sendFormEmail(...args) }));

let dir: string;

beforeEach(() => {
  resetRateLimit();
  sendFormEmail.mockClear();
  dir = mkdtempSync(path.join(tmpdir(), "intake-"));
  process.env.DESK_DATA_DIR = dir;
});

const cv = {
  kind: "cv" as const,
  email: "ada@example.com",
  subject: "CV from Ada",
  text: "Name: Ada\nFile: cv.pdf",
  ip: "203.0.113.20",
  visitorSla: "A person answers.",
  filename: "cv.pdf",
  contentType: "application/pdf",
  fileBase64: "JVBERi0xLjQK",
};

describe("a CV submission", () => {
  it("is emailed to the desk with the file attached", async () => {
    const result = await deliverIntake(cv);
    expect(result.ok).toBe(true);
    const deskMail = sendFormEmail.mock.calls[0][0] as { attachments?: { filename: string; content: string }[] };
    expect(deskMail.attachments).toEqual([
      { filename: "cv.pdf", content: "JVBERi0xLjQK", contentType: "application/pdf" },
    ]);
  });

  it("is saved with every field of the message but no file data", async () => {
    await deliverIntake(cv);
    const [record] = await listSubmissions();
    expect(record.body).toBe("Name: Ada\nFile: cv.pdf");
    expect(record).not.toHaveProperty("fileBase64");
    expect(record).not.toHaveProperty("filename");
    const onDisk = readFileSync(path.join(dir, "submissions.json"), "utf8");
    expect(onDisk).not.toContain("JVBERi0xLjQK");
  });

  it("does not attach anything to the visitor's confirmation", async () => {
    await deliverIntake(cv);
    const visitorMail = sendFormEmail.mock.calls[1][0] as { to?: string; attachments?: unknown };
    expect(visitorMail.to).toBe("ada@example.com");
    expect(visitorMail.attachments).toBeUndefined();
  });
});

describe("two posts from one person at the same moment", () => {
  it("both get the same reference and only one record is saved", async () => {
    const { getDeskStore } = await import("@/lib/desk-store");
    // Let both calls pass the duplicate check, as two simultaneous requests would.
    vi.spyOn(getDeskStore(), "findDuplicate")
      .mockResolvedValueOnce(undefined) // first request: nothing yet
      .mockResolvedValueOnce(undefined); // second request: check ran before the first was saved

    const first = await deliverIntake({ ...cv, kind: "contact", roleKey: "Press", fileBase64: undefined, filename: undefined });
    const second = await deliverIntake({ ...cv, kind: "contact", roleKey: "Press", fileBase64: undefined, filename: undefined });

    expect(first.ok && second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(second.id).toBe(first.id);
      expect(second.duplicate).toBe(true);
    }
    expect(await listSubmissions()).toHaveLength(1);
  });
});
