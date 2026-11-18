import { afterEach, beforeEach, describe, expect, it } from "vitest";

beforeEach(() => {
  process.env.CRON_SECRET = "s3cret";
});

afterEach(() => {
  delete process.env.CRON_SECRET;
  delete process.env.DESK_ALLOW_UNAUTHENTICATED;
});

const call = async (headers: Record<string, string> = {}) => {
  const { GET } = await import("./role-digest/route");
  return GET(new Request("http://x.test/api/cron/role-digest", { headers }));
};

describe("role digest route auth", () => {
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
