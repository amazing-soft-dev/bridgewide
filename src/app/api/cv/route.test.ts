import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_CV_BYTES } from "@/lib/cv-file";
import { resetRateLimit } from "@/lib/rate-limit";

const sendFormEmail = vi.fn(async () => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

describe("POST /api/cv", () => {
  beforeEach(() => {
    sendFormEmail.mockClear();
    resetRateLimit();
  });

  it("accepts a staffing CV without the AI checkbox", async () => {
    const { POST } = await import("./route");
    const response = await POST(cvRequest({ name: "Ada", email: "ada@example.com", region: "usa", rightToWork: "Yes, I can work there" }));
    expect(response.status).toBe(200);
  });

  it("rejects an AI-training CV without consent", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      cvRequest({
        name: "Ada",
        email: "ada@example.com",
        region: "usa",
        track: "ai-training",
        rightToWork: "Needs sponsorship",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("rejects an oversize file", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      cvRequest(
        { name: "Ada", email: "ada@example.com", region: "usa", rightToWork: "Yes, I can work there" },
        MAX_CV_BYTES + 1,
      ),
    );
    expect(response.status).toBe(400);
  });
});

function cvRequest(fields: Record<string, string>, size = 32): Request {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  form.set("file", new File([new Uint8Array(size)], "cv.pdf", { type: "application/pdf" }));
  return new Request("https://www.bridgewide.org/api/cv", { method: "POST", body: form });
}
