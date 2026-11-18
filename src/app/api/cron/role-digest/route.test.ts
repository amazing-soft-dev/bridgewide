import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendFormEmail = vi.fn();

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

beforeEach(() => {
  process.env.CRON_SECRET = "s3cret";
  process.env.ROLE_CLOCK = "2026-11-12T16:00:00.000Z"; // a Thursday, 08:00 Pacific
  sendFormEmail.mockReset();
});

afterEach(() => {
  delete process.env.CRON_SECRET;
  delete process.env.ROLE_CLOCK;
  vi.restoreAllMocks();
});

const run = async () => {
  const { GET } = await import("./route");
  return GET(new Request("http://x.test/api/cron/role-digest", { headers: { authorization: "Bearer s3cret" } }));
};

describe("role digest cron", () => {
  it("emails the desk the open and closed titles on a weekday", async () => {
    sendFormEmail.mockResolvedValue({ ok: true });
    expect(await (await run()).json()).toEqual({ ok: true, sent: true });
    expect(sendFormEmail).toHaveBeenCalledTimes(1);
    const mail = sendFormEmail.mock.calls[0][0] as { subject: string; text: string; to?: string };
    expect(mail.subject).toBe("Role digest 2026-11-12");
    expect(mail.text).toContain("Open:");
    expect(mail.text).toContain("Closed:");
    expect(mail.to).toBeUndefined(); // the desk inbox, never a candidate
    expect(mail.text).not.toMatch(/@/);
  });

  it("fails loudly when the mail cannot be sent", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sendFormEmail.mockResolvedValue({ ok: false, error: "Resend could not send the email.", status: 502 });

    const failed = await run();
    expect(failed.status).toBe(502);
    expect(log).toHaveBeenCalledTimes(1);
    const line = JSON.parse(String(log.mock.calls[0][0]));
    expect(line).toMatchObject({ event: "role-digest-failed", date: "2026-11-12", status: 502 });
  });

  it("skips weekends", async () => {
    process.env.ROLE_CLOCK = "2026-11-14T16:00:00.000Z"; // Saturday
    expect(await (await run()).json()).toEqual({ ok: true, sent: false });
    expect(sendFormEmail).not.toHaveBeenCalled();
  });

  it("uses the Pacific date, not the UTC date, late on a weekday evening", async () => {
    sendFormEmail.mockResolvedValue({ ok: true });
    process.env.ROLE_CLOCK = "2026-11-13T05:00:00.000Z"; // Thursday 21:00 Pacific, already Friday in UTC
    await run();
    expect((sendFormEmail.mock.calls[0][0] as { subject: string }).subject).toBe("Role digest 2026-11-12");
  });
});
