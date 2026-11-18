import { describe, expect, it } from "vitest";
import { isAuthorized } from "@/lib/cron-auth";

const request = (authorization?: string) =>
  new Request("https://example.test/api/cron", {
    headers: authorization ? { authorization } : {},
  });

describe("isAuthorized", () => {
  it("accepts the right bearer token", () => {
    expect(isAuthorized(request("Bearer s3cret"), { CRON_SECRET: "s3cret" })).toBe(true);
  });

  it("refuses a missing, wrong, or prefix-only token", () => {
    const env = { CRON_SECRET: "s3cret" };
    expect(isAuthorized(request(), env)).toBe(false);
    expect(isAuthorized(request("Bearer nope"), env)).toBe(false);
    expect(isAuthorized(request("Bearer s3cre"), env)).toBe(false);
    expect(isAuthorized(request("s3cret"), env)).toBe(false);
    expect(isAuthorized(request("Bearer s3cret extra"), env)).toBe(false);
  });

  it("fails closed when no secret is set", () => {
    expect(isAuthorized(request(), {})).toBe(false);
    expect(isAuthorized(request("Bearer "), { NODE_ENV: "development" })).toBe(false);
    expect(isAuthorized(request(), { NODE_ENV: "production" })).toBe(false);
  });

  it("opens only for explicit local development", () => {
    expect(isAuthorized(request(), { DESK_ALLOW_UNAUTHENTICATED: "1", NODE_ENV: "development" })).toBe(true);
    expect(isAuthorized(request(), { DESK_ALLOW_UNAUTHENTICATED: "1", NODE_ENV: "production" })).toBe(false);
    expect(isAuthorized(request(), { DESK_ALLOW_UNAUTHENTICATED: "true", NODE_ENV: "development" })).toBe(false);
  });

  it("does not let the escape hatch bypass a configured secret", () => {
    const env = { CRON_SECRET: "s3cret", DESK_ALLOW_UNAUTHENTICATED: "1", NODE_ENV: "development" };
    expect(isAuthorized(request(), env)).toBe(false);
  });
});
