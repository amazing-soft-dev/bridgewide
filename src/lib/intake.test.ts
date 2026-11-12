import { beforeEach, describe, expect, it, vi } from "vitest";
import { deliverIntake, newReference } from "@/lib/intake";
import { resetRateLimit } from "@/lib/rate-limit";

type Mail = { to?: string; subject: string; text: string; replyTo?: string; attachments?: unknown };

const sendFormEmail = vi.fn(async (..._args: unknown[]) => ({ ok: true as const }));

vi.mock("@/lib/mail", () => ({ sendFormEmail: (...args: unknown[]) => sendFormEmail(...args) }));

beforeEach(() => {
  resetRateLimit();
  sendFormEmail.mockReset();
  sendFormEmail.mockResolvedValue({ ok: true });
});

const base = {
  kind: "contact" as const,
  email: "ada@example.com",
  subject: "Contact · Press from Ada",
  text: "Name: Ada\nMessage: Hello",
  ip: "203.0.113.20",
  visitorSla: "A person answers.",
};

const mail = (index: number) => sendFormEmail.mock.calls[index][0] as Mail;

describe("deliverIntake", () => {
  it("sends the desk the whole message with a reference, replying to the visitor", async () => {
    const result = await deliverIntake(base);
    expect(result.ok).toBe(true);
    const desk = mail(0);
    expect(desk.to).toBeUndefined();
    expect(desk.subject).toBe("Contact · Press from Ada");
    expect(desk.replyTo).toBe("ada@example.com");
    expect(desk.text).toMatch(/^Reference: BW-[a-z0-9-]+\nName: Ada\nMessage: Hello$/);
  });

  it("sends the visitor a confirmation with the same reference", async () => {
    const result = await deliverIntake(base);
    const reference = /Reference: (BW-[a-z0-9-]+)/.exec(mail(0).text)![1];
    expect(result).toEqual({ ok: true, id: reference });
    const visitor = mail(1);
    expect(visitor.to).toBe("ada@example.com");
    expect(visitor.subject).toBe(`BridgeWide received your note (${reference})`);
    expect(visitor.text).toContain(`Reference: ${reference}`);
    expect(visitor.text).toContain("A person answers.");
    expect(visitor.text).not.toContain("Message: Hello");
  });

  it("attaches a CV to the desk email only", async () => {
    await deliverIntake({ ...base, kind: "cv", filename: "cv.pdf", contentType: "application/pdf", fileBase64: "JVBERi0xLjQK" });
    expect(mail(0).attachments).toEqual([
      { filename: "cv.pdf", content: "JVBERi0xLjQK", contentType: "application/pdf" },
    ]);
    expect(mail(1).attachments).toBeUndefined();
  });

  it("does not send the visitor a confirmation when the desk email fails", async () => {
    sendFormEmail.mockResolvedValueOnce({ ok: false, error: "down", status: 502 } as never);
    const result = await deliverIntake(base);
    expect(result).toMatchObject({ ok: false, status: 502 });
    expect(sendFormEmail).toHaveBeenCalledTimes(1);
  });

  it("still reports success with a reference when only the confirmation fails", async () => {
    sendFormEmail.mockResolvedValueOnce({ ok: true });
    sendFormEmail.mockResolvedValueOnce({ ok: false, error: "bounce", status: 502 } as never);
    const result = await deliverIntake(base);
    expect(result.ok).toBe(false);
    expect(result.id).toMatch(/^BW-/);
  });

  it("answers 429 after a burst from one address and keeps another address working", async () => {
    for (let i = 0; i < 8; i += 1) expect((await deliverIntake(base)).ok).toBe(true);
    expect(await deliverIntake(base)).toMatchObject({ ok: false, status: 429 });
    expect((await deliverIntake({ ...base, ip: "203.0.113.99" })).ok).toBe(true);
  });

  it("does not collapse two posts from one person: nothing is stored to compare", async () => {
    const first = await deliverIntake(base);
    const second = await deliverIntake(base);
    expect(first.id).not.toBe(second.id);
    expect(sendFormEmail).toHaveBeenCalledTimes(4);
  });
});

describe("newReference", () => {
  it("makes a different reference each time", () => {
    expect(newReference()).not.toBe(newReference());
  });
});
