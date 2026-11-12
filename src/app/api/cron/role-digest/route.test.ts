import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendFormEmail = vi.fn();

vi.mock("@/lib/mail", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mail")>("@/lib/mail");
  return { ...actual, sendFormEmail };
});

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "digest-"));
  process.env.DESK_DATA_DIR = dir;
  process.env.CRON_SECRET = "s3cret";
  process.env.ROLE_CLOCK = "2026-11-12T16:00:00.000Z"; // a Thursday, 08:00 Pacific
  sendFormEmail.mockReset();
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  delete process.env.DESK_DATA_DIR;
  delete process.env.CRON_SECRET;
  delete process.env.ROLE_CLOCK;
  vi.restoreAllMocks();
});

const run = async () => {
  const { GET } = await import("./route");
  return GET(new Request("http://x.test/api/cron/role-digest", { headers: { authorization: "Bearer s3cret" } }));
};

describe("role digest cron", () => {
  it("fails loudly when the mail cannot be sent, and does not mark the day as sent", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sendFormEmail.mockResolvedValue({ ok: false, error: "Resend could not send the email.", status: 502 });

    const failed = await run();
    expect(failed.status).toBe(502);
    expect(log).toHaveBeenCalledTimes(1);
    const line = JSON.parse(String(log.mock.calls[0][0]));
    expect(line).toMatchObject({ event: "role-digest-failed", date: "2026-11-12", status: 502 });

    // Because the day was not marked, the next run tries again and succeeds.
    sendFormEmail.mockResolvedValue({ ok: true });
    const retried = await run();
    expect(retried.status).toBe(200);
    expect(await retried.json()).toEqual({ ok: true, sent: true });
  });

  it("sends once a day", async () => {
    sendFormEmail.mockResolvedValue({ ok: true });
    expect(await (await run()).json()).toEqual({ ok: true, sent: true });
    expect(await (await run()).json()).toEqual({ ok: true, sent: false });
    expect(sendFormEmail).toHaveBeenCalledTimes(1);
  });

  it("still sends once a day after the server restarts", async () => {
    sendFormEmail.mockResolvedValue({ ok: true });
    expect(await (await run()).json()).toEqual({ ok: true, sent: true });

    // A new server instance loads every module again and shares only the store.
    vi.resetModules();
    expect(await (await run()).json()).toEqual({ ok: true, sent: false });
    expect(sendFormEmail).toHaveBeenCalledTimes(1);
  });

  it("sends again the next weekday", async () => {
    sendFormEmail.mockResolvedValue({ ok: true });
    expect(await (await run()).json()).toEqual({ ok: true, sent: true });
    process.env.ROLE_CLOCK = "2026-11-13T16:00:00.000Z"; // Friday
    expect(await (await run()).json()).toEqual({ ok: true, sent: true });
    expect(sendFormEmail).toHaveBeenCalledTimes(2);
  });

  it("skips weekends", async () => {
    process.env.ROLE_CLOCK = "2026-11-14T16:00:00.000Z"; // Saturday
    expect(await (await run()).json()).toEqual({ ok: true, sent: false });
    expect(sendFormEmail).not.toHaveBeenCalled();
  });
});
