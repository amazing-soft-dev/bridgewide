import { describe, expect, it } from "vitest";
import { SENTRY_DSN, resolveDsn } from "@/lib/sentry-dsn";

const key = "https://abc123@o1.ingest.sentry.io/1";

describe("resolveDsn", () => {
  it("uses the committed constant when there is no override", () => {
    expect(resolveDsn(undefined, key)).toBe(key);
    expect(resolveDsn("", key)).toBe(key);
    expect(resolveDsn("   ", key)).toBe(key);
  });

  it("lets an environment value win over the constant", () => {
    expect(resolveDsn("https://other@o2.ingest.sentry.io/2", key)).toBe("https://other@o2.ingest.sentry.io/2");
  });

  it("stays off when neither is set", () => {
    expect(resolveDsn(undefined, "")).toBeUndefined();
    expect(resolveDsn("  ", "  ")).toBeUndefined();
  });

  it("is either empty or a real Sentry key, never a half-typed value", () => {
    if (SENTRY_DSN === "") return;
    expect(SENTRY_DSN).toMatch(/^https:\/\/[0-9a-f]+@[a-z0-9.-]+\.ingest(\.[a-z]{2})?\.sentry\.io\/\d+$/);
  });
});
