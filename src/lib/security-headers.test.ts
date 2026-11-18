import { describe, expect, it } from "vitest";
import { securityHeaders } from "@/lib/security-headers";

const header = (key: string) => securityHeaders.find((item) => item.key === key)?.value;

describe("security headers", () => {
  it("sets the five standard headers", () => {
    expect(header("Strict-Transport-Security")).toMatch(/max-age=\d{8,}/);
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header("Permissions-Policy")).toMatch(/camera=\(\)/);
    expect(header("X-Frame-Options")).toBe("DENY");
  });

  it("does not repeat a header", () => {
    const keys = securityHeaders.map((item) => item.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("sends the CSP as report-only, not enforced", () => {
    expect(header("Content-Security-Policy-Report-Only")).toBeTruthy();
    expect(header("Content-Security-Policy")).toBeUndefined();
  });

  const csp = header("Content-Security-Policy-Report-Only") ?? "";
  const directives = Object.fromEntries(csp.split("; ").map((part) => [part.split(" ")[0], part.split(" ").slice(1)]));

  it("shuts plugins, framing, and base-tag tricks", () => {
    expect(directives["object-src"]).toEqual(["'none'"]);
    expect(directives["frame-ancestors"]).toEqual(["'none'"]);
    expect(directives["base-uri"]).toEqual(["'self'"]);
    expect(directives["form-action"]).toEqual(["'self'"]);
  });

  it("has no wildcard source and no plain http source", () => {
    expect(csp).not.toMatch(/(^|\s)\*(\s|;|$)/);
    expect(csp).not.toMatch(/http:\/\//);
  });

  it("allows only the outside hosts the site uses: Turnstile, Vercel, and Sentry", () => {
    const hosts = [...csp.matchAll(/https:\/\/[a-z.-]+/g)].map((match) => match[0]);
    expect(new Set(hosts)).toEqual(
      new Set(["https://challenges.cloudflare.com", "https://va.vercel-scripts.com", "https://vitals.vercel-insights.com"]),
    );
    // Sentry's ingest hosts are the one wildcard: a subdomain per project, nothing broader.
    const wildcards = [...csp.matchAll(/https:\/\/\*\.[a-z.-]+/g)].map((match) => match[0]);
    expect(wildcards.every((host) => /^https:\/\/\*\.ingest(\.[a-z]{2})?\.sentry\.io$/.test(host))).toBe(true);
    expect(wildcards.length).toBe(3);
  });

  it("allows Turnstile to load its script and its frame", () => {
    expect(directives["script-src"]).toContain("https://challenges.cloudflare.com");
    expect(directives["frame-src"]).toContain("https://challenges.cloudflare.com");
  });
});
