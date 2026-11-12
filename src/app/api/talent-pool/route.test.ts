import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";

const sendFormEmail = vi.fn(async () => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

const fields = {
  name: "Ada",
  email: "ada@example.com",
  region: "canada",
  country: "Canada",
  discipline: "Data",
  years: "6",
  workMode: "Remote",
  profile: "A short profile of the work.",
  consent: "yes",
};

describe("POST /api/talent-pool", () => {
  beforeEach(() => {
    sendFormEmail.mockClear();
    resetRateLimit();
  });

  it("rejects a bad file and missing consent", async () => {
    const { POST } = await import("./route");
    const bad = await POST(poolRequest({ ...fields }, "notes.txt"));
    expect(bad.status).toBe(400);
    const missing = await POST(poolRequest({ ...fields, consent: "" }));
    expect(missing.status).toBe(400);
    expect(sendFormEmail).not.toHaveBeenCalled();
  });

  it("attaches the file once under the talent-pool subject", async () => {
    const { POST } = await import("./route");
    const response = await POST(poolRequest(fields));
    expect(response.status).toBe(200);
    const desk = (sendFormEmail.mock.calls as unknown as [{ subject: string; text: string; attachments?: unknown[] }][])
      .map((call) => call[0])
      .find((input) => input.subject.startsWith("Talent pool"));
    expect(desk?.subject).toBe("Talent pool · Canada from Ada");
    expect(desk?.attachments).toHaveLength(1);
  });
});

function poolRequest(values: Record<string, string>, filename = "cv.pdf"): Request {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value) form.set(key, value);
  }
  form.set("file", new File([new TextEncoder().encode("%PDF-1.4 %%EOF")], filename, { type: filename.endsWith(".pdf") ? "application/pdf" : "text/plain" }));
  return new Request("https://www.bridgewide.org/api/talent-pool", { method: "POST", body: form });
}
