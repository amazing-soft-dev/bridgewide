import { beforeEach, describe, expect, it, vi } from "vitest";

const sendFormEmail = vi.fn(async () => ({ ok: true as const }));

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendFormEmail.mockClear();
    process.env.RESEND_API_KEY = "test";
    process.env.CONTACT_TO_EMAIL = "desk@bridgewide.org";
    process.env.CONTACT_FROM_EMAIL = "BridgeWide <noreply@bridgewide.org>";
  });

  it("maps a missing topic to Something else for an older client", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest({ name: "Ada", email: "ada@example.com", message: "Hello there." }));
    expect(response.status).toBe(200);
    const desk = mailCalls().find((input) => input.subject.startsWith("Contact ·"));
    expect(desk?.subject).toBe("Contact · Something else from Ada");
  });

  it("rejects an unknown topic", async () => {
    const { POST } = await import("./route");
    const response = await POST(jsonRequest({ name: "Ada", email: "ada@example.com", topic: "Nope", message: "Hello" }));
    expect(response.status).toBe(400);
    expect(sendFormEmail).not.toHaveBeenCalled();
  });

  it("sends the subject and the topic line", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      jsonRequest({ name: "Ada", email: "ada@example.com", topic: "Press", message: "A question." }),
    );
    expect(response.status).toBe(200);
    const desk = mailCalls().find((input) => input.subject.startsWith("Contact ·"));
    expect(desk?.subject).toBe("Contact · Press from Ada");
    expect(desk?.text).toContain("Topic: Press");
    expect(desk?.text).toContain("Name: Ada");
    expect(desk?.replyTo).toBe("ada@example.com");
  });

  it("does not send when the honeypot is filled", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      jsonRequest({
        name: "Ada",
        email: "ada@example.com",
        topic: "Press",
        message: "Hello",
        companyWebsite: "https://spam.test",
      }),
    );
    expect(response.status).toBe(200);
    expect(sendFormEmail).not.toHaveBeenCalled();
  });
});

function mailCalls() {
  return (sendFormEmail.mock.calls as unknown as [{ subject: string; text: string; replyTo?: string }][]).map(
    (call) => call[0],
  );
}

function jsonRequest(body: unknown): Request {
  return new Request("https://www.bridgewide.org/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
