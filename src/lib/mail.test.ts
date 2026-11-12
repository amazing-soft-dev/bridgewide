import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { sendFormEmail } from "@/lib/mail";

const mail = { subject: "Hello", text: "Body", replyTo: "ada@example.com" };
const now = { retryDelaysMs: [0, 0] as const };

const ok = { data: { id: "1" }, error: null };
const fail = (statusCode: number | null, message = "nope") => ({ data: null, error: { statusCode, message, name: "x" } });

beforeEach(() => {
  send.mockReset();
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "desk@example.com";
  process.env.CONTACT_FROM_EMAIL = "BridgeWide <noreply@example.com>";
});

describe("sendFormEmail", () => {
  it("sends once when it works", async () => {
    send.mockResolvedValueOnce(ok);
    expect(await sendFormEmail(mail, now)).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("names the missing variables and does not call Resend", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendFormEmail(mail, now);
    expect(result).toEqual({ ok: false, error: "Missing RESEND_API_KEY.", status: 500 });
    expect(send).not.toHaveBeenCalled();
  });

  it("retries a rate limit and succeeds on the second try", async () => {
    send.mockResolvedValueOnce(fail(429)).mockResolvedValueOnce(ok);
    expect(await sendFormEmail(mail, now)).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("retries a 500 and a dropped connection, then succeeds on the third try", async () => {
    send.mockResolvedValueOnce(fail(503)).mockRejectedValueOnce(new Error("socket hang up")).mockResolvedValueOnce(ok);
    expect(await sendFormEmail(mail, now)).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("retries an answer with no status code", async () => {
    send.mockResolvedValueOnce(fail(null)).mockResolvedValueOnce(ok);
    expect((await sendFormEmail(mail, now)).ok).toBe(true);
  });

  it("gives up after the second retry and reports the last error", async () => {
    send.mockResolvedValue(fail(500, "Resend is down"));
    expect(await sendFormEmail(mail, now)).toEqual({ ok: false, error: "Resend is down", status: 502 });
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("does not retry a request that is wrong", async () => {
    send.mockResolvedValue(fail(422, "Invalid from address"));
    expect(await sendFormEmail(mail, now)).toEqual({ ok: false, error: "Invalid from address", status: 502 });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("does not retry a missing API key answer (401)", async () => {
    send.mockResolvedValue(fail(401, "API key is invalid"));
    await sendFormEmail(mail, now);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("sends the same message on every try, with a one-line subject", async () => {
    send.mockResolvedValueOnce(fail(503)).mockResolvedValueOnce(ok);
    await sendFormEmail({ ...mail, subject: "Line one\r\nBcc: attacker@example.com" }, now);
    const [first, second] = send.mock.calls.map((call) => call[0]);
    expect(second).toEqual(first);
    expect(first.subject).toBe("Line one Bcc: attacker@example.com");
    expect(first.to).toBe("desk@example.com");
  });

  it("sends a confirmation to the address it is given instead of the desk", async () => {
    send.mockResolvedValueOnce(ok);
    await sendFormEmail({ ...mail, to: " visitor@example.com " }, now);
    expect(send.mock.calls[0][0].to).toBe("visitor@example.com");
  });
});
