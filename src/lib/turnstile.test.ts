import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deliverIntake } from "@/lib/intake";
import { resetRateLimit } from "@/lib/rate-limit";
import { tokenFromForm, tokenFromJson, verifyHuman } from "@/lib/turnstile";

const sendFormEmail = vi.fn(async (..._args: unknown[]) => ({ ok: true as const }));
vi.mock("@/lib/mail", () => ({ sendFormEmail: (...args: unknown[]) => sendFormEmail(...args) }));

const answer = (body: unknown, ok = true) =>
  vi.fn(async () => ({ ok, json: async () => body }) as unknown as Response) as unknown as typeof fetch;

describe("tokens", () => {
  it("reads the widget's field from a form and from JSON", () => {
    const form = new FormData();
    form.set("cf-turnstile-response", "  tok  ");
    expect(tokenFromForm(form)).toBe("tok");
    expect(tokenFromForm(new FormData())).toBeUndefined();
    expect(tokenFromJson({ turnstileToken: "tok2" })).toBe("tok2");
    expect(tokenFromJson({ turnstileToken: "  " })).toBeUndefined();
    expect(tokenFromJson({ turnstileToken: 5 })).toBeUndefined();
    expect(tokenFromJson(null)).toBeUndefined();
  });
});

describe("verifyHuman", () => {
  it("is skipped when there is no secret key", async () => {
    const fetchImpl = answer({ success: false });
    expect(await verifyHuman(undefined, "1.2.3.4", { secret: "", fetchImpl })).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("refuses a missing token without calling Cloudflare", async () => {
    const fetchImpl = answer({ success: true });
    expect(await verifyHuman(undefined, "1.2.3.4", { secret: "s", fetchImpl })).toMatchObject({ ok: false, status: 400 });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("sends the secret, the token, and the visitor's address to siteverify", async () => {
    const fetchImpl = answer({ success: true });
    expect(await verifyHuman("tok", "203.0.113.7", { secret: "shh", fetchImpl })).toEqual({ ok: true });
    const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(init.method).toBe("POST");
    const sent = init.body as URLSearchParams;
    expect(sent.get("secret")).toBe("shh");
    expect(sent.get("response")).toBe("tok");
    expect(sent.get("remoteip")).toBe("203.0.113.7");
  });

  it("leaves out the address when there is none", async () => {
    const fetchImpl = answer({ success: true });
    await verifyHuman("tok", "local", { secret: "shh", fetchImpl });
    const init = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    expect((init.body as URLSearchParams).has("remoteip")).toBe(false);
  });

  it("refuses a token Cloudflare rejects", async () => {
    const result = await verifyHuman("bad", "1.2.3.4", { secret: "s", fetchImpl: answer({ success: false, "error-codes": ["invalid-input-response"] }) });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("refuses with a 503 when Cloudflare cannot be reached", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    expect(await verifyHuman("tok", "1.2.3.4", { secret: "s", fetchImpl })).toMatchObject({ ok: false, status: 503 });
  });

  it("refuses an answer that is not JSON", async () => {
    const fetchImpl = vi.fn(async () => ({
      json: async () => {
        throw new Error("not json");
      },
    })) as unknown as typeof fetch;
    expect(await verifyHuman("tok", "1.2.3.4", { secret: "s", fetchImpl })).toMatchObject({ ok: false, status: 503 });
  });
});

describe("a form post with the check turned on", () => {
  beforeEach(() => {
    resetRateLimit();
    sendFormEmail.mockClear();
    process.env.TURNSTILE_SECRET_KEY = "shh";
  });
  afterEach(() => {
    delete process.env.TURNSTILE_SECRET_KEY;
    vi.unstubAllGlobals();
  });

  const post = (humanToken?: string) =>
    deliverIntake({
      kind: "contact",
      email: "ada@example.com",
      subject: "Contact",
      text: "Hello",
      ip: "203.0.113.5",
      visitorSla: "A person answers.",
      humanToken,
    });

  it("sends no email when the token is missing", async () => {
    vi.stubGlobal("fetch", answer({ success: true }));
    expect(await post(undefined)).toMatchObject({ ok: false, status: 400 });
    expect(sendFormEmail).not.toHaveBeenCalled();
  });

  it("sends no email when Cloudflare rejects the token", async () => {
    vi.stubGlobal("fetch", answer({ success: false }));
    expect(await post("bad")).toMatchObject({ ok: false, status: 400 });
    expect(sendFormEmail).not.toHaveBeenCalled();
  });

  it("sends both emails when the token is good", async () => {
    vi.stubGlobal("fetch", answer({ success: true }));
    expect((await post("good")).ok).toBe(true);
    expect(sendFormEmail).toHaveBeenCalledTimes(2);
  });
});
