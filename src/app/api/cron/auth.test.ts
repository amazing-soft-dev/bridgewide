import { afterEach, beforeEach, describe, expect, it } from "vitest";

const routes = [
  ["role digest", () => import("./role-digest/route"), "GET", "http://x.test/api/cron/role-digest"],
  ["talent retention", () => import("./talent-retention/route"), "GET", "http://x.test/api/cron/talent-retention"],
  ["desk record", () => import("../desk/record/route"), "POST", "http://x.test/api/desk/record"],
] as const;

describe.each(routes)("%s route auth", (_name, load, method, url) => {
  beforeEach(() => {
    process.env.CRON_SECRET = "s3cret";
  });
  afterEach(() => {
    delete process.env.CRON_SECRET;
    delete process.env.DESK_ALLOW_UNAUTHENTICATED;
  });

  const call = async (headers: Record<string, string> = {}) => {
    const mod = await load();
    const handler = method === "GET" ? (mod as { GET: (r: Request) => Promise<Response> }).GET : (mod as { POST: (r: Request) => Promise<Response> }).POST;
    return handler(new Request(url, { method, headers, body: method === "POST" ? "{}" : undefined }));
  };

  it("refuses a request with no token", async () => {
    expect((await call()).status).toBe(401);
  });

  it("refuses a wrong token", async () => {
    expect((await call({ authorization: "Bearer wrong" })).status).toBe(401);
  });

  it("refuses everything when no secret is set, even with the dev flag in production", async () => {
    delete process.env.CRON_SECRET;
    expect((await call()).status).toBe(401);
    process.env.DESK_ALLOW_UNAUTHENTICATED = "1";
    const previous = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    try {
      expect((await call()).status).toBe(401);
    } finally {
      (process.env as Record<string, string>).NODE_ENV = previous ?? "test";
    }
  });
});
