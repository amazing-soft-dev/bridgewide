import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimit } from "@/lib/rate-limit";

const sendFormEmail = vi.fn(async () => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

describe("salary guide mail", () => {
  beforeEach(() => {
    sendFormEmail.mockClear();
    resetRateLimit();
  });

  it("does not promise a private PDF", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new Request("https://www.bridgewide.org/api/salary-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "ada@example.com" }),
      }),
    );
    expect(response.status).toBe(200);
    const desk = (sendFormEmail.mock.calls as unknown as [{ subject: string; text: string }][])
      .map((call) => call[0])
      .find((input) => input.subject === "Salary guide request");
    expect(desk?.text).toContain("/salary-guide");
    expect(desk?.text.toLowerCase()).not.toContain("will send the guide");
    const footer = readFileSync(new URL("../../../components/site/FooterSignup.tsx", import.meta.url), "utf8");
    expect(footer).toContain("The guide is already at /salary-guide.");
  });
});
