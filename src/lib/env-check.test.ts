import { describe, expect, it } from "vitest";
import { envProblems } from "@/lib/env-check";

const production = {
  NODE_ENV: "production",
  RESEND_API_KEY: "re_x",
  CONTACT_TO_EMAIL: "desk@example.com",
  CONTACT_FROM_EMAIL: "BridgeWide <noreply@example.com>",
  CRON_SECRET: "s3cret",
};

describe("envProblems", () => {
  it("is quiet when production is set up", () => {
    expect(envProblems(production)).toEqual([]);
  });

  it("is quiet in development with nothing set", () => {
    expect(envProblems({ NODE_ENV: "development" })).toEqual([]);
    expect(envProblems({})).toEqual([]);
  });

  it("names each missing production key as an error", () => {
    const problems = envProblems({ NODE_ENV: "production" });
    expect(problems.every((problem) => problem.level === "error")).toBe(true);
    const text = problems.map((problem) => problem.message).join("\n");
    for (const name of ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL", "CRON_SECRET"]) {
      expect(text).toContain(name);
    }
  });

  it("treats a blank value as missing", () => {
    expect(envProblems({ ...production, RESEND_API_KEY: "   " }).map((problem) => problem.message).join()).toContain("RESEND_API_KEY");
  });

  it("warns about the dev flag in production", () => {
    expect(envProblems({ ...production, DESK_ALLOW_UNAUTHENTICATED: "1" })).toEqual([
      expect.objectContaining({ level: "warning" }),
    ]);
  });

  it("warns when only the Turnstile site key is set, and errors when only the secret is", () => {
    expect(envProblems({ ...production, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4" })).toEqual([
      expect.objectContaining({ level: "warning" }),
    ]);
    expect(envProblems({ ...production, TURNSTILE_SECRET_KEY: "0x4" })).toEqual([
      expect.objectContaining({ level: "error" }),
    ]);
    expect(envProblems({ ...production, TURNSTILE_SECRET_KEY: "a", NEXT_PUBLIC_TURNSTILE_SITE_KEY: "b" })).toEqual([]);
  });

  it("checks Turnstile in development too, since a half-set pair breaks local forms", () => {
    expect(envProblems({ NODE_ENV: "development", TURNSTILE_SECRET_KEY: "a" })).toHaveLength(1);
  });
});
